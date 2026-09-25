import 'dotenv/config'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'
import { importPlayers } from './players'
import { importGames } from './games'

/**
 * pnpm import:players [dir]        default dir: ./import/players
 * pnpm import:games   [games.json] default file: ./import/games.json
 *
 * In the production stack the repo's `import/` folder is mounted read-only at
 * /app/import (infra/compose.prod.yml), so on the host PC:
 *   docker compose -f infra/compose.prod.yml --env-file .env.production exec app pnpm import:players
 */
async function main() {
  const [kind, target] = process.argv.slice(2)
  if (kind !== 'players' && kind !== 'games') {
    console.error('Usage: tsx src/import/cli.ts <players|games> [path]')
    process.exit(2)
  }

  const payload = await getPayload({ config })
  const report =
    kind === 'players'
      ? await importPlayers(payload, path.resolve(target ?? 'import/players'))
      : await importGames(payload, path.resolve(target ?? 'import/games.json'))

  console.log('\n' + report.toMarkdown(kind === 'players' ? 'Player import' : 'Games import'))
  console.log(
    '\nEverything was saved as a DRAFT. Review it in /admin and publish when it is correct.',
  )
  process.exit(report.count('error') > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
