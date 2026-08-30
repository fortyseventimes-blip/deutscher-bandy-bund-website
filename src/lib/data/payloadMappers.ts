import 'server-only'
import type {
  Team as PayloadTeam,
  Player as PayloadPlayer,
  Staff as PayloadStaff,
  Game as PayloadGame,
  Tournament as PayloadTournament,
  Venue as PayloadVenue,
  Opponent as PayloadOpponent,
  Media as PayloadMedia,
} from '@/payload-types'
import type {
  Team,
  Player,
  Staff,
  Game,
  Tournament,
  Venue,
  Side,
  ImageRef,
  StandingsRow,
  Standings,
} from './types'

/**
 * Payload → domain mappers. The pages only know the shapes in `types.ts`; these
 * functions are the one place that translates a Payload document into that
 * shape, so the accessor layer (index.ts) stays readable. Any document coming
 * through here is expected to be populated to at least depth 1 — an
 * un-populated relationship (a bare numeric id) is treated as absent, since
 * that only happens if a caller forgot to pass `depth`, not as normal data.
 */

function populated<T>(value: number | T | null | undefined): T | null {
  if (value == null || typeof value === 'number') return null
  return value
}

export function toImageRef(
  media: number | PayloadMedia | null | undefined,
  opts: { ratio?: ImageRef['ratio'] } = {},
): ImageRef | null {
  const doc = populated(media)
  if (!doc) return null
  return {
    label: doc.alt,
    alt: doc.alt,
    src: doc.url ?? undefined,
    ratio: opts.ratio,
  }
}

export function mapVenue(doc: PayloadVenue): Venue {
  return {
    name: doc.name,
    city: doc.city,
    address: doc.address ?? undefined,
    mapQuery: doc.mapQuery ?? undefined,
  }
}

export function mapTeam(doc: PayloadTeam): Team {
  return {
    id: String(doc.id),
    slug: doc.slug,
    name: doc.name,
    gender: doc.gender,
    ageGroup: doc.ageGroup ?? undefined,
    crestCode: doc.crestCode,
    accent: doc.accent ?? undefined,
    description: doc.description ?? undefined,
    coach: doc.coach ?? undefined,
  }
}

/** A game side is polymorphic — a DBB team or an external opponent (design D3). */
export function mapSide(
  rel: PayloadGame['home'] | PayloadGame['away'],
): Side {
  if (rel.relationTo === 'teams') {
    const team = populated<PayloadTeam>(rel.value)
    if (!team) return { kind: 'team', name: '—', shortName: '—', crestCode: '—' }
    return {
      kind: 'team',
      name: team.name,
      shortName: team.shortName,
      crestCode: team.crestCode,
      accent: team.accent ?? undefined,
      teamSlug: team.slug,
      country: 'Deutschland',
    }
  }
  const opponent = populated<PayloadOpponent>(rel.value)
  if (!opponent) return { kind: 'opponent', name: '—', shortName: '—', crestCode: '—' }
  return {
    kind: 'opponent',
    name: opponent.name,
    shortName: opponent.shortName,
    crestCode: opponent.crestCode,
    accent: opponent.accent ?? undefined,
    country: opponent.country ?? undefined,
  }
}

export function mapPlayer(doc: PayloadPlayer, teamSlugOverride?: string): Player {
  const team = populated<PayloadTeam>(doc.team)
  return {
    id: String(doc.id),
    slug: doc.slug,
    firstName: doc.firstName,
    lastName: doc.lastName,
    number: doc.number,
    position: doc.position,
    teamSlug: teamSlugOverride ?? team?.slug ?? '',
    nationality: doc.nationality ?? 'Deutschland',
    birthYear: doc.birthYear ?? undefined,
    joinedYear: doc.joinedYear ?? undefined,
    heightCm: doc.heightCm ?? undefined,
    weightKg: doc.weightKg ?? undefined,
    status: doc.playerStatus,
    captain: doc.captain ?? undefined,
    club: doc.club ?? undefined,
    // No upload → the designed ghost-number fallback, not a placeholder slot.
    portrait: toImageRef(doc.portrait, { ratio: '3/4' }),
    bio: doc.bio ?? null,
    stats: {
      caps: doc.stats?.caps ?? 0,
      goals: doc.stats?.goals ?? 0,
      assists: doc.stats?.assists ?? 0,
    },
  }
}

export function mapStaff(doc: PayloadStaff): Staff {
  const team = populated<PayloadTeam>(doc.team)
  return {
    id: String(doc.id),
    name: doc.name,
    role: doc.role,
    teamSlug: team?.slug ?? '',
    portrait: toImageRef(doc.portrait, { ratio: '3/4' }),
  }
}

type PayloadRosterSide = NonNullable<NonNullable<PayloadGame['roster']>['home']>

export function mapGame(doc: PayloadGame): Game {
  const roster = doc.roster
  const mapRosterSide = (side?: PayloadRosterSide) => {
    if (!side) return undefined
    return {
      coach: side.coach ?? undefined,
      formation: side.formation ?? undefined,
      players: (side.players ?? []).map((p) => ({
        playerSlug: populated(p.player)?.slug,
        firstName: p.firstName,
        lastName: p.lastName,
        number: p.number,
        position: p.position,
        starter: p.starter ?? true,
        captain: p.captain ?? undefined,
        events: p.events?.length ? p.events.map((e) => e.type) : undefined,
      })),
      bench: side.bench ?? [],
    }
  }

  return {
    id: String(doc.id),
    slug: doc.slug,
    kickoff: doc.kickoff,
    status: doc.gameStatus,
    competition: doc.competition,
    round: doc.round ?? undefined,
    home: mapSide(doc.home),
    away: mapSide(doc.away),
    homeScore: doc.homeScore ?? undefined,
    awayScore: doc.awayScore ?? undefined,
    halftime:
      doc.halftime?.home != null && doc.halftime?.away != null
        ? { home: doc.halftime.home, away: doc.halftime.away }
        : undefined,
    venue: mapVenue(populated<PayloadVenue>(doc.venue) ?? { id: 0, name: '—', city: '—' } as PayloadVenue),
    isTournamentGame: doc.isTournamentGame ?? false,
    tournamentSlug: populated<PayloadTournament>(doc.tournament)?.slug,
    liveMinute: doc.liveMinute ?? undefined,
    postponedTo: doc.postponedTo ?? undefined,
    cancellationReason: doc.cancellationReason ?? undefined,
    ticketUrl: doc.ticketUrl ?? undefined,
    roster: roster
      ? {
          submitted: roster.submitted ?? false,
          home: mapRosterSide(roster.home),
          away: mapRosterSide(roster.away),
        }
      : undefined,
    report: doc.report
      ? {
          paragraphs: (doc.report.paragraphs ?? []).map((row) => row.text),
          pullQuote: doc.report.pullQuote ?? undefined,
        }
      : undefined,
    events: (doc.events ?? []).map((e) => ({
      minute: e.minute,
      type: e.type,
      side: e.side,
      title: e.title,
      running:
        e.runningHome != null && e.runningAway != null
          ? { home: e.runningHome, away: e.runningAway }
          : undefined,
      detail: e.detail ?? undefined,
    })),
    stats: (doc.stats ?? []).map((s) => ({ label: s.label, home: s.home, away: s.away })),
    referee: doc.referee ?? undefined,
    attendance: doc.attendance ?? undefined,
    weatherNote: doc.weatherNote ?? undefined,
    gallery: (doc.gallery ?? [])
      .map((row) => toImageRef(row.image, { ratio: '4/3' }))
      .filter((img): img is ImageRef => img !== null),
  }
}

export function mapStandings(doc: PayloadTournament): Standings | null {
  if (!doc.standings) return null
  const rows: StandingsRow[] = (doc.standings.rows ?? []).map((r) => ({
    rank: r.rank,
    teamName: r.teamName,
    isGermany: r.isGermany ?? undefined,
    played: r.played,
    win: r.win,
    draw: r.draw,
    loss: r.loss,
    goalsFor: r.goalsFor,
    goalsAgainst: r.goalsAgainst,
    points: r.points,
    zone: r.zone ?? undefined,
  }))
  return {
    competition: doc.name,
    rows,
    preseason: doc.standings.preseason ?? undefined,
    note: doc.standings.note ?? undefined,
  }
}

export function mapTournament(doc: PayloadTournament): Omit<Tournament, 'days'> {
  return {
    id: String(doc.id),
    slug: doc.slug,
    name: doc.name,
    format: doc.format,
    startDate: doc.startDate,
    endDate: doc.endDate,
    venue: mapVenue(populated<PayloadVenue>(doc.venue) ?? { id: 0, name: '—', city: '—' } as PayloadVenue),
    hero: toImageRef(doc.hero, { ratio: '16/9' }) ?? undefined,
    participants: (doc.participants ?? []).map((p) => ({
      name: p.name,
      host: p.host ?? undefined,
      resolved: p.resolved ?? undefined,
    })),
    standings: mapStandings(doc) ?? undefined,
    rules: doc.rules ?? undefined,
    weatherNote: doc.weatherNote ?? undefined,
  }
}
