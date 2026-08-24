#!/usr/bin/env node
/**
 * Cross-platform one-command local dev (`pnpm dev:up`), works on Windows/macOS/
 * Linux. Steps:
 *   1. create .env on first run
 *   2. start a Postgres 17 container (infra/compose.dev.yml)
 *   3. wait for it, apply migrations, seed base content
 *   4. start the Next.js dev server at http://localhost:3000
 */
import { spawnSync, spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const COMPOSE = ['-f', 'infra/compose.dev.yml']
const run = (cmd, args, opts = {}) =>
  spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: true, ...opts })

function step(msg) {
  console.log(`\n→ ${msg}`)
}

// 1. .env
step('Ensuring .env exists')
run('node', ['scripts/init-env.mjs'])

// 2. Detect Docker Compose
const hasComposeV2 = spawnSync('docker', ['compose', 'version'], { shell: true }).status === 0
const hasComposeV1 = spawnSync('docker-compose', ['version'], { shell: true }).status === 0
if (!hasComposeV2 && !hasComposeV1) {
  console.error(
    '\n✗ Docker is required for the local database.\n' +
      '  Install Docker Desktop and make sure it is running, then run `pnpm dev:up` again.\n' +
      '  (Or run your own Postgres, set DATABASE_URI in .env, and use `pnpm setup && pnpm dev`.)',
  )
  process.exit(1)
}
const dc = (args) =>
  hasComposeV2 ? run('docker', ['compose', ...args]) : run('docker-compose', args)

step('Starting Postgres')
if (dc([...COMPOSE, 'up', '-d']).status !== 0) {
  console.error('\n✗ Could not start the database container. Is Docker Desktop running?')
  process.exit(1)
}

// 3. Wait for the database to accept connections
step('Waiting for Postgres to be ready')
let ready = false
for (let i = 0; i < 60; i++) {
  const probe = spawnSync(
    hasComposeV2 ? 'docker' : 'docker-compose',
    (hasComposeV2 ? ['compose', ...COMPOSE] : COMPOSE).concat(['exec', '-T', 'db', 'pg_isready', '-U', 'bandy', '-d', 'bandy']),
    { cwd: root, shell: true },
  )
  if (probe.status === 0) {
    ready = true
    console.log('  database ready')
    break
  }
  spawnSync(process.platform === 'win32' ? 'timeout' : 'sleep', [process.platform === 'win32' ? '/t 1 /nobreak' : '1'], { shell: true, stdio: 'ignore' })
}
if (!ready) {
  console.error('\n✗ Postgres did not become ready in time. Check `docker ps` / Docker Desktop.')
  process.exit(1)
}

step('Applying migrations')
if (run('pnpm', ['migrate']).status !== 0) process.exit(1)

step('Seeding base content (idempotent)')
if (run('pnpm', ['seed']).status !== 0) process.exit(1)

step('Starting the dev server on http://localhost:3000  (press Ctrl+C to stop)')
const dev = spawn('pnpm', ['dev'], { cwd: root, stdio: 'inherit', shell: true })
dev.on('exit', (code) => process.exit(code ?? 0))
