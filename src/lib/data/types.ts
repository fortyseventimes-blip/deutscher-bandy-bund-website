/**
 * Domain models for the public site. These are the shapes the presentation layer
 * consumes; the fixtures data source (fixtures.ts) produces them today and a
 * Payload/CMS source will produce the same shapes later — the accessor layer
 * (index.ts) is the seam, so no page changes when the CMS lands.
 *
 * Absence is modelled as optional/nullable throughout: no portrait, no bio, no
 * roster yet, no standings for a competition, participants not yet known. Every
 * such case has a designed fallback (handoff: "absence is the normal case").
 */

/** A labelled image drop-slot. No real photography is supplied yet; components
 * render a placeholder that names what belongs there. `src` arrives with media. */
export type ImageRef = {
  label: string
  alt?: string
  src?: string
  ratio?: '16/9' | '3/4' | '1/1' | '4/3'
}

export type Gender = 'herren' | 'damen' | 'nachwuchs'
export type Position = 'TW' | 'VER' | 'MF' | 'ST'
export type PlayerStatus = 'active' | 'injured' | 'inactive' | 'alumni'
export type GameStatus = 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled'
export type CompetitionKind = 'friendly' | 'tournament' | 'qualifier' | 'league'
export type EventTag = 'goal' | 'assist' | 'penalty'

export type Team = {
  id: string
  slug: string
  name: string
  gender: Gender
  ageGroup?: string
  crestCode: string // 3-letter placeholder crest
  accent?: string // CSS color token or hex for the crest ring / top accent
  description?: string
  coach?: string
}

export type PlayerStats = { caps: number; goals: number; assists: number }

export type Player = {
  id: string
  slug: string
  firstName: string
  lastName: string
  number: number
  position: Position
  teamSlug: string
  nationality: string
  birthYear?: number
  joinedYear?: number
  heightCm?: number
  weightKg?: number
  status: PlayerStatus
  captain?: boolean
  club?: string
  portrait?: ImageRef | null // null → ghost-number fallback
  bio?: string | null // null/empty → bio section omitted
  stats: PlayerStats
}

export type Staff = {
  id: string
  name: string
  role: string
  teamSlug: string
  portrait?: ImageRef | null
}

/** A game side references either a DBB team or an external opponent (design D3). */
export type Side = {
  kind: 'team' | 'opponent'
  name: string
  shortName: string
  crestCode: string
  accent?: string
  teamSlug?: string
  country?: string
}

export type Venue = {
  name: string
  city: string
  address?: string
  mapQuery?: string // used for the "open in maps" link / blocked-map fallback
}

export type RosterEntry = {
  playerSlug?: string
  firstName: string
  lastName: string
  number: number
  position: Position
  starter: boolean
  captain?: boolean
  events?: EventTag[]
}

export type TeamRoster = {
  coach?: string
  formation?: string
  players: RosterEntry[]
  bench: string[]
}

export type MatchRoster = {
  submitted: boolean
  home?: TeamRoster
  away?: TeamRoster
}

export type TimelineEvent = {
  minute: number
  type: 'goal' | 'penalty' | 'card' | 'info'
  side: 'home' | 'away'
  title: string
  running?: { home: number; away: number }
  detail?: string
}

export type StatLine = { label: string; home: number; away: number }

export type MatchReport = {
  paragraphs: string[]
  pullQuote?: string
}

export type Game = {
  id: string
  slug: string
  kickoff: string // ISO 8601, UTC
  status: GameStatus
  competition: { name: string; kind: CompetitionKind }
  round?: string
  home: Side
  away: Side
  homeScore?: number
  awayScore?: number
  halftime?: { home: number; away: number }
  venue: Venue
  isTournamentGame: boolean
  tournamentSlug?: string
  liveMinute?: number
  postponedTo?: string // ISO
  cancellationReason?: string
  ticketUrl?: string
  roster?: MatchRoster
  report?: MatchReport
  events?: TimelineEvent[]
  stats?: StatLine[]
  referee?: string
  attendance?: number
  weatherNote?: string
  gallery?: ImageRef[]
}

export type StandingsRow = {
  rank: number
  teamName: string
  isGermany?: boolean
  played: number
  win: number
  draw: number
  loss: number
  goalsFor: number
  goalsAgainst: number
  points: number
  zone?: 'qualify' | 'relegate'
}

export type Standings = {
  competition: string
  rows: StandingsRow[]
  preseason?: boolean
  note?: string
}

export type TournamentDay = {
  label: string
  date: string // ISO date
  games: Game[]
}

export type Tournament = {
  id: string
  slug: string
  name: string
  format: string
  startDate: string
  endDate: string
  venue: Venue
  hero?: ImageRef
  participants: { name: string; host?: boolean; resolved?: boolean }[]
  days: TournamentDay[]
  standings?: Standings // may be absent — tournament pages must render without it
  rules?: string[]
  weatherNote?: string
}

export type NewsTeaser = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string // ISO
  category: string
  image?: ImageRef | null
}

export type HeroState = 'upcoming' | 'live' | 'finished' | 'postponed' | 'summer-break'
