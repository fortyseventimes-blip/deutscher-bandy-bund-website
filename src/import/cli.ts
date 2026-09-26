import 'dotenv/config'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'
import { importPlayers } from './players'
import { importPortraits } from './portraits'
import { importGames } from './games'

/**
 * pnpm import:players   [dir]        default dir: ./import/players
 * pnpm import:portraits [dir]        default dir: ./import/players (photos only)
 * pnpm import:games     [games.json] default file: ./import/games.json
 *
 * In the production stack the repo's `import/` folder is mounted read-only at
 * /app/import (infra/compose.prod.yml), so on the host PC:
 *   docker compose -f infra/compose.prod.yml --env-file .env.production exec app pnpm import:players
 */
const KINDS = {
  players: {
    title: 'Player import',
    run: importPlayers,
    defaultPath: 'import/players',
    footer: 'Everything was saved as a DRAFT. Review it in /admin and publish when it is correct.',
  },
  portraits: {
    title: 'Portrait update',
    run: importPortraits,
    defaultPath: 'import/players',
    footer:
      'Only photos were replaced; players were not changed. If the site still shows an old photo, reload with Ctrl+F5.',
  },
  games: {
    title: 'Games import',
    run: importGames,
    defaultPath: 'import/games.json',
    footer: 'Everything was saved as a DRAFT. Review it in /admin and publish when it is correct.',
  },
} as const

async function main() {
  const [kind, target] = process.argv.slice(2)
  if (!(kind in KINDS)) {
    console.error(`Usage: tsx src/import/cli.ts <${Object.keys(KINDS).join('|')}> [path]`)
    process.exit(2)
  }
  const job = KINDS[kind as keyof typeof KINDS]

  const payload = await getPayload({ config })
  const report = await job.run(payload, path.resolve(target ?? job.defaultPath))

  console.log('\n' + report.toMarkdown(job.title))
  console.log('\n' + job.footer)
  process.exit(report.count('error') > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
