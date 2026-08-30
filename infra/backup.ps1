# Daily backup for the interim local-tunnel deployment (infra/compose.prod.yml).
# Dumps the Postgres database and archives the media uploads volume into
# .\backups\, timestamped, and deletes backups older than -KeepDays.
#
# Run manually to test:
#   powershell -ExecutionPolicy Bypass -File infra\backup.ps1
#
# Then schedule it once a day via Windows Task Scheduler — see
# docs/deploy-local-tunnel.md for the exact steps (Task Scheduler > Create
# Task > Trigger: daily > Action: run this script).
#
# This is a local safety net only (see the note in compose.prod.yml about
# this not being the full delivery-infra spec) — the backups still live on
# the same machine as the data they protect. Periodically copy the backups
# folder to a USB drive or cloud storage if the machine itself could be lost.

param(
    [int]$KeepDays = 30,
    [string]$BackupDir = (Join-Path $PSScriptRoot '..\backups')
)

$ErrorActionPreference = 'Stop'
$repoRoot = Join-Path $PSScriptRoot '..'
$envFile = Join-Path $repoRoot '.env.production'

if (-not (Test-Path $envFile)) {
    Write-Error "Missing $envFile — copy .env.production.example and fill it in first."
    exit 1
}

# Minimal .env parser: KEY=VALUE lines, ignores comments/blank lines.
$envVars = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*#') { return }
    if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$') {
        $envVars[$matches[1]] = $matches[2]
    }
}
$pgUser = if ($envVars.POSTGRES_USER) { $envVars.POSTGRES_USER } else { 'bandy' }
$pgDb = if ($envVars.POSTGRES_DB) { $envVars.POSTGRES_DB } else { 'bandy' }

New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
$stamp = Get-Date -Format 'yyyy-MM-dd_HHmm'

Write-Host "→ Dumping database ($pgDb)..."
$dbFile = Join-Path $BackupDir "db_$stamp.sql"
docker exec bandy-prod-db pg_dump -U $pgUser -d $pgDb | Out-File -Encoding utf8 $dbFile
if ($LASTEXITCODE -ne 0 -or -not (Test-Path $dbFile) -or (Get-Item $dbFile).Length -eq 0) {
    Write-Error "Database dump failed or produced an empty file — is the app stack running?"
    exit 1
}

Write-Host "→ Archiving media uploads..."
$mediaFile = "media_$stamp.tar.gz"
docker run --rm `
    -v bandy-prod-media:/data:ro `
    -v "${BackupDir}:/backup" `
    alpine sh -c "tar czf /backup/$mediaFile -C /data ."
if ($LASTEXITCODE -ne 0) {
    Write-Error "Media archive failed."
    exit 1
}

Write-Host "→ Removing backups older than $KeepDays days..."
Get-ChildItem $BackupDir -File | Where-Object {
    $_.LastWriteTime -lt (Get-Date).AddDays(-$KeepDays)
} | Remove-Item -Force

Write-Host "✓ Backup complete: $BackupDir\db_$stamp.sql and $BackupDir\$mediaFile"
