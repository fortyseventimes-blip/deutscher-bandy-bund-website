#!/usr/bin/env node
/**
 * Creates a local `.env` on first run so `pnpm dev:up` works with zero manual
 * setup. Copies `.env.example`, fills a random PAYLOAD_SECRET and the local
 * Docker Postgres connection string. Never overwrites an existing `.env`.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = join(root, '.env')

if (existsSync(envPath)) {
  console.log('.env already exists — leaving it untouched.')
  process.exit(0)
}

const example = readFileSync(join(root, '.env.example'), 'utf8')
const secret = randomBytes(48).toString('base64')

const env = example
  .replace(/^PAYLOAD_SECRET=.*$/m, `PAYLOAD_SECRET=${secret}`)
  .replace(/^DATABASE_URI=.*$/m, 'DATABASE_URI=postgres://bandy:bandy@localhost:5432/bandy')
  .replace(/^NEXT_PUBLIC_SERVER_URL=.*$/m, 'NEXT_PUBLIC_SERVER_URL=http://localhost:3000')

writeFileSync(envPath, env)
console.log('Created .env with a fresh PAYLOAD_SECRET and the local database URL.')
