import 'server-only'
import { getPayloadClient } from '../payload'
import { news as newsFixtures } from './fixtures'
import {
  mapTeam,
  mapPlayer,
  mapStaff,
  mapGame,
  mapTournament,
  mapStandings,
} from './payloadMappers'
import type {
  Game,
  Player,
  Standings,
  Team,
  Tournament,
  NewsTeaser,
  Staff,
  Position,
} from './types'

/**
 * Data accessors — the seam between the pages and the data source. These now
 * query Payload (the fixtures data source has moved to src/seed/sport.ts,
 * which seeds real documents from the same sample data). Every accessor keeps
 * its original signature so no page changed when the CMS landed.
 *
 * Payload's Local API bypasses access control by default, so every query
 * against a collection with a draft/publish lifecycle (players, games,
 * tournaments) explicitly filters `_status: published` itself — the site
 * layer never trusts access control to do that filtering for it. Every
 * accessor also tolerates a missing/unmigrated database (mirrors
 * `getGlobalSafe`), returning an empty result rather than throwing.
 */

async function tryOr<T>(fallback: T, run: () => Promise<T>): Promise<T> {
  try {
    return await run()
  } catch {
    return fallback
  }
}

const PUBLISHED = { _status: { equals: 'published' as const } }

export async function getTeams(): Promise<Team[]> {
  return tryOr([], async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'teams', depth: 1, limit: 50, sort: 'name' })
    return res.docs.map(mapTeam)
  })
}

export async function getTeam(slug: string): Promise<Team | null> {
  return tryOr(null, async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'teams',
      depth: 1,
      limit: 1,
      where: { slug: { equals: slug } },
    })
    const doc = res.docs[0]
    return doc ? mapTeam(doc) : null
  })
}

export type SquadFilter = { position?: Position | 'ALL'; q?: string }

/** Active roster for a team, with optional position + name/number filtering. */
export async function getSquad(teamSlug: string, filter: SquadFilter = {}): Promise<Player[]> {
  return tryOr([], async () => {
    const payload = await getPayloadClient()
    const team = await getTeam(teamSlug)
    if (!team) return []
    const res = await payload.find({
      collection: 'players',
      depth: 1,
      limit: 200,
      where: {
        and: [{ team: { equals: team.id } }, { playerStatus: { not_equals: 'alumni' } }, PUBLISHED],
      },
    })
    let list = res.docs.map((d) => mapPlayer(d, teamSlug))
    if (filter.position && filter.position !== 'ALL') {
      list = list.filter((p) => p.position === filter.position)
    }
    if (filter.q && filter.q.trim()) {
      const q = filter.q.trim().toLowerCase()
      list = list.filter(
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || String(p.number) === q,
      )
    }
    return list.sort((a, b) => a.number - b.number)
  })
}

/** Position counts for the filter chips (from the unfiltered squad). */
export async function getSquadCounts(teamSlug: string): Promise<Record<string, number>> {
  const list = await getSquad(teamSlug)
  const counts: Record<string, number> = { ALL: list.length, TW: 0, VER: 0, MF: 0, ST: 0 }
  for (const p of list) counts[p.position] = (counts[p.position] ?? 0) + 1
  return counts
}

export async function getStaff(teamSlug: string): Promise<Staff[]> {
  return tryOr([], async () => {
    const payload = await getPayloadClient()
    const team = await getTeam(teamSlug)
    if (!team) return []
    const res = await payload.find({
      collection: 'staff',
      depth: 1,
      limit: 50,
      where: { team: { equals: team.id } },
    })
    return res.docs.map(mapStaff)
  })
}

export async function getPlayer(slug: string): Promise<Player | null> {
  return tryOr(null, async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'players',
      depth: 1,
      limit: 1,
      where: { and: [{ slug: { equals: slug } }, PUBLISHED] },
    })
    const doc = res.docs[0]
    return doc ? mapPlayer(doc) : null
  })
}

export async function getRelatedPlayers(player: Player, limit = 4): Promise<Player[]> {
  return tryOr([], async () => {
    const list = await getSquad(player.teamSlug)
    return list.filter((p) => p.slug !== player.slug).slice(0, limit)
  })
}

export type FixtureFilter = {
  team?: string // teamSlug
  competition?: string
  direction?: 'upcoming' | 'past' | 'all'
  season?: string
}

const PAST = new Set<Game['status']>(['finished'])

/** All published games, sorted by kickoff ascending. The fixture list is small
 * enough that filtering/sorting in memory (as the fixtures source used to do)
 * stays simple and avoids fighting Payload's polymorphic-relationship query
 * syntax for very little benefit at this scale. */
async function getAllGames(): Promise<Game[]> {
  return tryOr([], async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'games',
      depth: 2,
      limit: 500,
      sort: 'kickoff',
      where: PUBLISHED,
    })
    return res.docs.map(mapGame)
  })
}

export async function getFixtures(filter: FixtureFilter = {}): Promise<Game[]> {
  let list = await getAllGames()
  if (filter.team) {
    list = list.filter((g) => g.home.teamSlug === filter.team || g.away.teamSlug === filter.team)
  }
  if (filter.competition && filter.competition !== 'ALL') {
    list = list.filter((g) => g.competition.name === filter.competition)
  }
  if (filter.direction === 'upcoming') list = list.filter((g) => !PAST.has(g.status))
  else if (filter.direction === 'past') list = list.filter((g) => PAST.has(g.status))
  return list
}

/** Distinct competition names present in the data, for the filter chips. */
export async function getCompetitions(): Promise<string[]> {
  const list = await getAllGames()
  return Array.from(new Set(list.map((g) => g.competition.name)))
}

export async function getGame(slug: string): Promise<Game | null> {
  const list = await getAllGames()
  return list.find((g) => g.slug === slug) ?? null
}

/** The chronologically next scheduled/live game across all teams. */
export async function getNextMatch(now: Date = new Date()): Promise<Game | null> {
  const list = await getAllGames()
  const live = list.find((g) => g.status === 'live')
  if (live) return live
  const upcoming = list.find(
    (g) => g.status === 'scheduled' && new Date(g.kickoff).getTime() >= now.getTime(),
  )
  return upcoming ?? list.find((g) => g.status === 'scheduled') ?? null
}

/** The most recent finished game. */
export async function getLastResult(): Promise<Game | null> {
  const list = await getAllGames()
  return [...list].reverse().find((g) => g.status === 'finished') ?? null
}

export async function getStandings(_competition?: string): Promise<Standings | null> {
  return tryOr(null, async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'tournaments',
      depth: 0,
      limit: 1,
      where: { and: [{ featuredStandings: { equals: true } }, PUBLISHED] },
    })
    const doc = res.docs[0]
    return doc ? mapStandings(doc) : null
  })
}

export async function getTournaments(): Promise<Tournament[]> {
  return tryOr([], async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'tournaments',
      depth: 1,
      limit: 50,
      where: PUBLISHED,
      sort: '-startDate',
    })
    return Promise.all(res.docs.map((doc) => attachDays(doc)))
  })
}

export async function getTournament(slug: string): Promise<Tournament | null> {
  return tryOr(null, async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'tournaments',
      depth: 1,
      limit: 1,
      where: { and: [{ slug: { equals: slug } }, PUBLISHED] },
    })
    const doc = res.docs[0]
    return doc ? attachDays(doc) : null
  })
}

/** Build the day-grouped schedule for a tournament from the games that
 * reference it, grouped by `tournamentDayLabel` in kickoff order. */
async function attachDays(
  doc: Parameters<typeof mapTournament>[0],
): Promise<Tournament> {
  const base = mapTournament(doc)
  const payload = await getPayloadClient()
  // Any failure here propagates to the caller's own tryOr, which already
  // has a safe fallback (null / []) for the whole tournament lookup.
  const res = await payload.find({
    collection: 'games',
    depth: 2,
    limit: 100,
    sort: 'kickoff',
    where: { and: [{ tournament: { equals: doc.id } }, PUBLISHED] },
  })
  const games = res.docs.map(mapGame)
  const order: string[] = []
  const byLabel = new Map<string, typeof games>()
  for (const game of games) {
    const rawDoc = res.docs.find((d) => String(d.id) === game.id)
    const label = rawDoc?.tournamentDayLabel || game.kickoff.slice(0, 10)
    if (!byLabel.has(label)) {
      byLabel.set(label, [])
      order.push(label)
    }
    byLabel.get(label)!.push(game)
  }
  const days = order.map((label) => ({
    label,
    date: byLabel.get(label)![0].kickoff.slice(0, 10),
    games: byLabel.get(label)!,
  }))
  return { ...base, days }
}

/**
 * News/articles are Slice 3 scope (openspec `editorial-news`), not part of
 * this pass — the sport collections replace the fixtures, but there is no
 * `articles` collection yet. Kept on the sample data on purpose so the home
 * page's news section keeps working until that slice lands.
 */
export async function getNewsTeasers(limit = 4): Promise<NewsTeaser[]> {
  return [...newsFixtures].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit)
}

export * from './types'
