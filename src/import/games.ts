import fs from 'node:fs/promises'
import type { Payload } from 'payload'
import type { Game, Tournament } from '../payload-types'
import { slugifyName } from '../lib/slug'
import { safeHttpUrl } from '../lib/url'
import { STREAM_PROVIDER_NAMES, type StreamProvider } from '../lib/streams'
import type { TeamGender } from './filename'
import { ensureTeam } from './players'
import { ImportReport } from './report'

/**
 * One-off import of real games and tournaments from `games.json` — the
 * federation's results transcribed from the official FIB pages (every entry
 * carries its `sourceUrl`). Everything is created as a **draft**; an editor
 * checks it against the source and publishes in /admin. Matched by slug, so
 * re-running only writes a new draft version.
 */

type VenueInput = { name: string; city: string; address?: string }
type SideInput =
  | { team: TeamGender }
  | { opponent: { name: string; shortName: string; crestCode?: string; country?: string } }

export type TournamentInput = {
  slug: string
  name: string
  type: Tournament['type']
  format: string
  startDate: string
  endDate: string
  venue: VenueInput
  placement?: string
  participants?: string[]
  sourceUrl?: string
}

export type GameInput = {
  slug?: string
  kickoff: string
  status: Game['gameStatus']
  competition: Game['competition']
  round?: string
  home: SideInput
  away: SideInput
  homeScore?: number
  awayScore?: number
  venue: VenueInput
  tournament?: string
  sourceUrl?: string
  streamUrl?: string
  streamProvider?: StreamProvider
}

export type GamesFile = { tournaments?: TournamentInput[]; games?: GameInput[] }

function sideLabel(side: SideInput): string {
  return 'team' in side ? `Deutschland (${side.team})` : side.opponent.name
}

async function ensureVenue(payload: Payload, v: VenueInput): Promise<number> {
  const found = await payload.find({
    collection: 'venues',
    where: { and: [{ name: { equals: v.name } }, { city: { equals: v.city } }] },
    limit: 1,
  })
  if (found.docs[0]) return found.docs[0].id
  return (await payload.create({ collection: 'venues', data: v })).id
}

async function resolveSide(
  payload: Payload,
  side: SideInput,
  report: ImportReport,
): Promise<{ relationTo: 'teams' | 'opponents'; value: number }> {
  if ('team' in side) return { relationTo: 'teams', value: await ensureTeam(payload, side.team, report) }
  const o = side.opponent
  const found = await payload.find({ collection: 'opponents', where: { name: { equals: o.name } }, limit: 1 })
  if (found.docs[0]) return { relationTo: 'opponents', value: found.docs[0].id }
  const created = await payload.create({
    collection: 'opponents',
    data: { name: o.name, shortName: o.shortName, crestCode: o.crestCode ?? o.shortName, country: o.country },
  })
  return { relationTo: 'opponents', value: created.id }
}

function checkUrl(report: ImportReport, subject: string, field: string, url?: string): string | undefined {
  if (!url) return undefined
  if (safeHttpUrl(url)) return url
  report.add('review', subject, `${field} "${url}" is not an http(s) link — left empty`)
  return undefined
}

export async function importGames(payload: Payload, file: string): Promise<ImportReport> {
  const report = new ImportReport()
  const input = JSON.parse(await fs.readFile(file, 'utf8')) as GamesFile

  const tournamentIds = new Map<string, number>()
  for (const t of input.tournaments ?? []) {
    const data = {
      name: t.name,
      slug: t.slug,
      type: t.type,
      format: t.format,
      startDate: t.startDate,
      endDate: t.endDate,
      venue: await ensureVenue(payload, t.venue),
      placement: t.placement,
      participants: t.participants?.map((name) => ({ name, resolved: true })),
      sourceUrl: checkUrl(report, t.name, 'sourceUrl', t.sourceUrl),
      _status: 'draft' as const,
    }
    const found = await payload.find({ collection: 'tournaments', where: { slug: { equals: t.slug } }, limit: 1, draft: true })
    const id = found.docs[0]
      ? (await payload.update({ collection: 'tournaments', id: found.docs[0].id, data, draft: true })).id
      : (await payload.create({ collection: 'tournaments', data, draft: true })).id
    tournamentIds.set(t.slug, id)
    report.add(found.docs[0] ? 'updated' : 'created', `Turnier: ${t.name}`)
    if (!data.sourceUrl) report.add('review', t.name, 'no source link — add the official page before publishing')
  }

  for (const g of input.games ?? []) {
    const subject = `${g.kickoff.slice(0, 10)} ${sideLabel(g.home)} – ${sideLabel(g.away)}`
    const slug = g.slug ?? slugifyName(`${g.kickoff.slice(0, 10)}-${sideLabel(g.home)}-${sideLabel(g.away)}`)

    let tournament: number | undefined
    if (g.tournament) {
      tournament = tournamentIds.get(g.tournament)
      if (tournament === undefined) {
        const found = await payload.find({
          collection: 'tournaments',
          where: { slug: { equals: g.tournament } },
          limit: 1,
          draft: true,
        })
        tournament = found.docs[0]?.id
      }
      if (tournament === undefined) {
        report.add('error', subject, `tournament "${g.tournament}" not found in games.json or the CMS`)
        continue
      }
    }
    if (g.status === 'finished' && (g.homeScore == null || g.awayScore == null)) {
      report.add('review', subject, 'finished without a score')
    }
    if (g.streamProvider && !(g.streamProvider in STREAM_PROVIDER_NAMES)) {
      report.add('error', subject, `unknown streamProvider "${g.streamProvider}"`)
      continue
    }

    const data = {
      slug,
      kickoff: g.kickoff,
      gameStatus: g.status,
      competition: g.competition,
      round: g.round,
      home: await resolveSide(payload, g.home, report),
      away: await resolveSide(payload, g.away, report),
      homeScore: g.homeScore,
      awayScore: g.awayScore,
      venue: await ensureVenue(payload, g.venue),
      isTournamentGame: tournament !== undefined,
      tournament,
      sourceUrl: checkUrl(report, subject, 'sourceUrl', g.sourceUrl),
      streamUrl: checkUrl(report, subject, 'streamUrl', g.streamUrl),
      streamProvider: g.streamProvider,
      _status: 'draft' as const,
    }
    const found = await payload.find({ collection: 'games', where: { slug: { equals: slug } }, limit: 1, draft: true })
    if (found.docs[0]) {
      await payload.update({ collection: 'games', id: found.docs[0].id, data, draft: true })
      report.add('updated', subject, slug)
    } else {
      await payload.create({ collection: 'games', data, draft: true })
      report.add('created', subject, slug)
    }
    if (!data.sourceUrl) report.add('review', subject, 'no source link — add the official page before publishing')
  }

  return report
}
