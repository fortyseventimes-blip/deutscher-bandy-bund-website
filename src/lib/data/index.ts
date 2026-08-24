/**
 * Data accessors — the seam between the pages and the data source. Today they
 * read the in-repo fixtures; a Payload/CMS implementation will replace the
 * bodies without changing a single call site (handoff: put data access behind a
 * layer that runs against fixtures first). All are async so the swap is trivial.
 */
import {
  teams as allTeams,
  players as allPlayers,
  staff as allStaff,
  games as allGames,
  gamesSorted,
  standingsWMQ,
  standingsPreseason,
  tournaments as allTournaments,
  news as allNews,
} from './fixtures'
import type { Game, Player, Standings, Team, Tournament, NewsTeaser, Staff, Position } from './types'

export async function getTeams(): Promise<Team[]> {
  return allTeams
}

export async function getTeam(slug: string): Promise<Team | null> {
  return allTeams.find((t) => t.slug === slug) ?? null
}

export type SquadFilter = { position?: Position | 'ALL'; q?: string }

/** Active roster for a team, with optional position + name/number filtering. */
export async function getSquad(teamSlug: string, filter: SquadFilter = {}): Promise<Player[]> {
  let list = allPlayers.filter((p) => p.teamSlug === teamSlug && p.status !== 'alumni')
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
}

/** Position counts for the filter chips (from the unfiltered squad). */
export async function getSquadCounts(teamSlug: string): Promise<Record<string, number>> {
  const list = allPlayers.filter((p) => p.teamSlug === teamSlug && p.status !== 'alumni')
  const counts: Record<string, number> = { ALL: list.length, TW: 0, VER: 0, MF: 0, ST: 0 }
  for (const p of list) counts[p.position] = (counts[p.position] ?? 0) + 1
  return counts
}

export async function getStaff(teamSlug: string): Promise<Staff[]> {
  return allStaff.filter((s) => s.teamSlug === teamSlug)
}

export async function getPlayer(slug: string): Promise<Player | null> {
  return allPlayers.find((p) => p.slug === slug) ?? null
}

export async function getRelatedPlayers(player: Player, limit = 4): Promise<Player[]> {
  return allPlayers
    .filter((p) => p.teamSlug === player.teamSlug && p.slug !== player.slug && p.status !== 'alumni')
    .slice(0, limit)
}

export type FixtureFilter = {
  team?: string // teamSlug
  competition?: string
  direction?: 'upcoming' | 'past' | 'all'
  season?: string
}

const PAST = new Set<Game['status']>(['finished'])

export async function getFixtures(filter: FixtureFilter = {}): Promise<Game[]> {
  let list = gamesSorted()
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
  return Array.from(new Set(allGames.map((g) => g.competition.name)))
}

export async function getGame(slug: string): Promise<Game | null> {
  return allGames.find((g) => g.slug === slug) ?? null
}

/** The chronologically next scheduled/live game across all teams. */
export async function getNextMatch(now: Date = new Date()): Promise<Game | null> {
  const live = gamesSorted().find((g) => g.status === 'live')
  if (live) return live
  const upcoming = gamesSorted().find(
    (g) => g.status === 'scheduled' && new Date(g.kickoff).getTime() >= now.getTime(),
  )
  return upcoming ?? gamesSorted().find((g) => g.status === 'scheduled') ?? null
}

/** The most recent finished game. */
export async function getLastResult(): Promise<Game | null> {
  return [...gamesSorted()].reverse().find((g) => g.status === 'finished') ?? null
}

export async function getStandings(competition?: string): Promise<Standings | null> {
  if (competition === standingsPreseason.competition) return standingsPreseason
  return standingsWMQ
}

export async function getTournaments(): Promise<Tournament[]> {
  return allTournaments
}

export async function getTournament(slug: string): Promise<Tournament | null> {
  return allTournaments.find((t) => t.slug === slug) ?? null
}

export async function getNewsTeasers(limit = 4): Promise<NewsTeaser[]> {
  return [...allNews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit)
}

export * from './types'
