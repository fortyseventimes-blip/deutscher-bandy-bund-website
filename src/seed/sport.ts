import type { Payload } from 'payload'
import {
  teams as teamFixtures,
  players as playerFixtures,
  staff as staffFixtures,
  games as gameFixtures,
  tournaments as tournamentFixtures,
  standingsWMQ,
  standingsPreseason,
} from '../lib/data/fixtures'
import type { Game, Side, Venue } from '../lib/data/types'

/**
 * Seeds the sport collections (seasons, venues, opponents, teams, staff,
 * players, tournaments, games) from the same sample data the fixtures data
 * layer used to serve directly. Idempotent — upserts by a natural key, safe to
 * re-run. Real photography is not supplied (handoff), so no Media documents
 * are created here: every seeded player/team/game renders the designed
 * fallback (ghost number, labelled drop-slot) rather than a fake placeholder
 * image.
 *
 * Locale note: sport content is seeded in German only (the default locale).
 * The English pages fall back to it via Payload's locale fallback — full EN
 * content entry is separate, deferred work (see PROGRESS.md Phase A).
 *
 * Modelling note vs. the original ad-hoc fixtures: the WM-Qualifikation group
 * table and the pre-season league table did not belong to any tournament in
 * the old fixtures (a design shortcut). Here they become two `tournaments`
 * documents of their own — the only entity the spec allows to carry
 * standings — so the model has no data disconnected from a relation. The
 * WM-Qualifikation qualifier games are linked to that tournament
 * (`isTournamentGame` + `tournament`); this is a deliberate improvement, not
 * a fixture artifact.
 */

type Id = number

async function upsert(
  payload: Payload,
  collection: string,
  where: Record<string, unknown>,
  data: Record<string, unknown>,
): Promise<Id> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existing = await (payload as any).find({ collection, where, limit: 1 })
  if (existing.docs.length > 0) {
    const id = existing.docs[0].id as Id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload as any).update({ collection, id, data })
    return id
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const created = await (payload as any).create({ collection, data })
  return created.id as Id
}

const venueKey = (v: Venue) => `${v.name}|${v.city}`
const opponentKey = (s: Side) => `${s.name}|${s.shortName}`

export async function seedSport(payload: Payload): Promise<void> {
  // --- Season -----------------------------------------------------------
  await upsert(payload, 'seasons', { name: { equals: '2026/27' } }, {
    name: '2026/27',
    isCurrent: true,
  })

  // --- Venues -------------------------------------------------------------
  const allTournamentGames: { game: Game; dayLabel?: string; tournamentSlug: string }[] = []
  for (const trn of tournamentFixtures) {
    for (const day of trn.days) {
      for (const game of day.games) {
        allTournamentGames.push({ game, dayLabel: day.label, tournamentSlug: trn.slug })
      }
    }
  }
  const allGames: Game[] = [...gameFixtures, ...allTournamentGames.map((g) => g.game)]

  const venueMap = new Map<string, Venue>()
  for (const g of allGames) venueMap.set(venueKey(g.venue), g.venue)
  for (const trn of tournamentFixtures) venueMap.set(venueKey(trn.venue), trn.venue)

  const venueIds = new Map<string, Id>()
  for (const v of venueMap.values()) {
    const id = await upsert(
      payload,
      'venues',
      { and: [{ name: { equals: v.name } }, { city: { equals: v.city } }] },
      { name: v.name, city: v.city, address: v.address, mapQuery: v.mapQuery },
    )
    venueIds.set(venueKey(v), id)
  }

  // --- Opponents ------------------------------------------------------------
  const opponentMap = new Map<string, Side>()
  for (const g of allGames) {
    if (g.home.kind === 'opponent') opponentMap.set(opponentKey(g.home), g.home)
    if (g.away.kind === 'opponent') opponentMap.set(opponentKey(g.away), g.away)
  }
  const opponentIds = new Map<string, Id>()
  for (const o of opponentMap.values()) {
    const id = await upsert(
      payload,
      'opponents',
      { and: [{ name: { equals: o.name } }, { shortName: { equals: o.shortName } }] },
      {
        name: o.name,
        shortName: o.shortName,
        crestCode: o.crestCode || '—',
        accent: o.accent,
        country: o.country,
      },
    )
    opponentIds.set(opponentKey(o), id)
  }

  // --- Teams ------------------------------------------------------------
  const teamIds = new Map<string, Id>()
  for (const t of teamFixtures) {
    const id = await upsert(
      payload,
      'teams',
      { slug: { equals: t.slug } },
      {
        name: t.name,
        slug: t.slug,
        gender: t.gender,
        ageGroup: t.ageGroup,
        crestCode: t.crestCode,
        shortName: 'GER',
        accent: t.accent,
        coach: t.coach,
        description: t.description,
      },
    )
    teamIds.set(t.slug, id)
  }

  // --- Staff ------------------------------------------------------------
  for (const s of staffFixtures) {
    await upsert(
      payload,
      'staff',
      { and: [{ name: { equals: s.name } }, { team: { equals: teamIds.get(s.teamSlug) } }] },
      { name: s.name, role: s.role, team: teamIds.get(s.teamSlug) },
    )
  }

  // --- Players ------------------------------------------------------------
  const playerIds = new Map<string, Id>()
  for (const p of playerFixtures) {
    const id = await upsert(
      payload,
      'players',
      { slug: { equals: p.slug } },
      {
        firstName: p.firstName,
        lastName: p.lastName,
        slug: p.slug,
        team: teamIds.get(p.teamSlug),
        number: p.number,
        position: p.position,
        playerStatus: p.status,
        captain: p.captain,
        nationality: p.nationality,
        birthYear: p.birthYear,
        joinedYear: p.joinedYear,
        heightCm: p.heightCm,
        weightKg: p.weightKg,
        club: p.club,
        bio: p.bio ?? undefined,
        stats: p.stats,
        _status: 'published',
      },
    )
    playerIds.set(p.slug, id)
  }

  // --- Tournaments (the real one + the two standings-hosting ones) --------
  const tournamentIds = new Map<string, Id>()
  for (const trn of tournamentFixtures) {
    const id = await upsert(
      payload,
      'tournaments',
      { slug: { equals: trn.slug } },
      {
        name: trn.name,
        slug: trn.slug,
        type: 'pokal',
        format: trn.format,
        startDate: trn.startDate,
        endDate: trn.endDate,
        venue: venueIds.get(venueKey(trn.venue)),
        participants: trn.participants,
        rules: trn.rules,
        weatherNote: trn.weatherNote,
        featuredStandings: false,
        _status: 'published',
      },
    )
    tournamentIds.set(trn.slug, id)
  }

  const qualifierGames = gameFixtures.filter((g) => g.competition.name === 'WM-Qualifikation')
  const qualifierKickoffs = qualifierGames.map((g) => g.kickoff).sort()
  const wmQualId = await upsert(
    payload,
    'tournaments',
    { slug: { equals: 'wm-qualifikation-gruppe-b' } },
    {
      name: standingsWMQ.competition,
      slug: 'wm-qualifikation-gruppe-b',
      type: 'qualifikation',
      format: 'Gruppenphase · 6 Mannschaften',
      startDate: qualifierKickoffs[0],
      endDate: qualifierKickoffs[qualifierKickoffs.length - 1],
      venue: venueIds.get(venueKey(gameFixtures[0].venue)),
      participants: standingsWMQ.rows.map((r) => ({ name: r.teamName, resolved: true })),
      featuredStandings: true,
      standings: { preseason: false, rows: standingsWMQ.rows },
      _status: 'published',
    },
  )
  tournamentIds.set('wm-qualifikation-gruppe-b', wmQualId)

  await upsert(
    payload,
    'tournaments',
    { slug: { equals: 'bandy-bundesliga-2027-28' } },
    {
      name: standingsPreseason.competition,
      slug: 'bandy-bundesliga-2027-28',
      type: 'liga',
      format: 'Bundesliga · 5 Vereine',
      startDate: '2027-11-01',
      endDate: '2028-04-30',
      venue: venueIds.get(venueKey(gameFixtures[0].venue)),
      participants: standingsPreseason.rows.map((r) => ({ name: r.teamName, resolved: true })),
      featuredStandings: false,
      standings: {
        preseason: true,
        note: standingsPreseason.note,
        rows: standingsPreseason.rows,
      },
      _status: 'published',
    },
  )

  // --- Games ----------------------------------------------------------------
  const sideRelation = (side: Side) =>
    side.kind === 'team'
      ? { relationTo: 'teams', value: teamIds.get(side.teamSlug!) }
      : { relationTo: 'opponents', value: opponentIds.get(opponentKey(side)) }

  const rosterSide = (side?: Game['roster'] extends infer R ? (R extends { home?: infer H } ? H : never) : never) => {
    if (!side) return undefined
    return {
      coach: side.coach,
      formation: side.formation,
      players: side.players.map((p) => ({
        player: p.playerSlug ? playerIds.get(p.playerSlug) : undefined,
        firstName: p.firstName,
        lastName: p.lastName,
        number: p.number,
        position: p.position,
        starter: p.starter,
        captain: p.captain,
        events: p.events?.map((type) => ({ type })),
      })),
      bench: side.bench,
    }
  }

  const gamesToSeed: {
    game: Game
    isTournamentGame: boolean
    tournamentSlug?: string
    dayLabel?: string
  }[] = [
    ...gameFixtures.map((game) => ({
      game,
      isTournamentGame: game.competition.name === 'WM-Qualifikation',
      tournamentSlug: game.competition.name === 'WM-Qualifikation' ? 'wm-qualifikation-gruppe-b' : undefined,
    })),
    ...allTournamentGames.map(({ game, dayLabel, tournamentSlug }) => ({
      game,
      isTournamentGame: true,
      tournamentSlug,
      dayLabel,
    })),
  ]

  for (const { game, isTournamentGame, tournamentSlug, dayLabel } of gamesToSeed) {
    await upsert(
      payload,
      'games',
      { slug: { equals: game.slug } },
      {
        slug: game.slug,
        kickoff: game.kickoff,
        gameStatus: game.status,
        competition: game.competition,
        round: game.round,
        home: sideRelation(game.home),
        away: sideRelation(game.away),
        homeScore: game.homeScore,
        awayScore: game.awayScore,
        halftime: game.halftime,
        venue: venueIds.get(venueKey(game.venue)),
        isTournamentGame,
        tournament: tournamentSlug ? tournamentIds.get(tournamentSlug) : undefined,
        tournamentDayLabel: dayLabel,
        liveMinute: game.liveMinute,
        postponedTo: game.postponedTo,
        cancellationReason: game.cancellationReason,
        ticketUrl: game.ticketUrl,
        roster: game.roster
          ? {
              submitted: game.roster.submitted,
              home: rosterSide(game.roster.home),
              away: rosterSide(game.roster.away),
            }
          : undefined,
        report: game.report
          ? {
              paragraphs: game.report.paragraphs.map((text) => ({ text })),
              pullQuote: game.report.pullQuote,
            }
          : undefined,
        events: game.events?.map((e) => ({
          minute: e.minute,
          type: e.type,
          side: e.side,
          title: e.title,
          runningHome: e.running?.home,
          runningAway: e.running?.away,
          detail: e.detail,
        })),
        stats: game.stats,
        referee: game.referee,
        attendance: game.attendance,
        weatherNote: game.weatherNote,
        _status: 'published',
      },
    )
  }
}
