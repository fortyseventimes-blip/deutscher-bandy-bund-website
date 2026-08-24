#!/usr/bin/env bash
#
# One command to run the site locally: `pnpm dev:up`.
#  1. creates .env on first run
#  2. starts a Postgres 17 container (infra/compose.dev.yml)
#  3. waits for it, applies migrations and seeds the base content
#  4. starts the Next.js dev server at http://localhost:3000
#
set -euo pipefail
cd "$(dirname "$0")/.."

COMPOSE_FILE="infra/compose.dev.yml"

# Pick `docker compose` (v2) or legacy `docker-compose`.
if docker compose version >/dev/null 2>&1; then
  DC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DC="docker-compose"
else
  echo "✗ Docker is required for the local database. Install Docker Desktop, or"
  echo "  run your own Postgres and set DATABASE_URI in .env, then use 'pnpm dev'."
  exit 1
fi

echo "→ Ensuring .env exists"
node scripts/init-env.mjs

echo "→ Starting Postgres ($COMPOSE_FILE)"
$DC -f "$COMPOSE_FILE" up -d

echo "→ Waiting for Postgres to be ready"
for i in $(seq 1 60); do
  if $DC -f "$COMPOSE_FILE" exec -T db pg_isready -U bandy -d bandy >/dev/null 2>&1; then
    echo "  database ready"
    break
  fi
  sleep 1
done

echo "→ Applying migrations"
pnpm migrate

echo "→ Seeding base content (idempotent)"
pnpm seed

echo "→ Starting the dev server on http://localhost:3000"
exec pnpm dev
