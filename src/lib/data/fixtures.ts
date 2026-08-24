import type {
  Team,
  Player,
  Staff,
  Game,
  Standings,
  Tournament,
  NewsTeaser,
  Side,
} from './types'

/**
 * Sample data matching the design prototypes. German copy is real; names, scores
 * and numbers are plausible placeholders (handoff). Season 2026/27, key date
 * 16.01.2027. Kickoffs are stored in UTC; the UI renders them in Europe/Berlin.
 *
 * Deliberate edge cases so the designed fallbacks are exercised:
 *  - two players without a portrait (ghost-number card), one without a bio,
 *  - games in every status (scheduled/live/finished/postponed/cancelled),
 *  - a pre-season all-zeros standings table and a tournament without a table.
 */

// --- Teams ------------------------------------------------------------------
export const teams: Team[] = [
  {
    id: 't-herren',
    slug: 'herren',
    name: 'Herren',
    gender: 'herren',
    crestCode: 'DEU',
    accent: '#DD0000',
    coach: 'Andreas Keller',
    description:
      'Die Herren-Nationalmannschaft des Deutschen Bandy-Bundes vertritt Deutschland bei internationalen Turnieren und der Weltmeisterschaft.',
  },
  {
    id: 't-damen',
    slug: 'damen',
    name: 'Damen',
    gender: 'damen',
    crestCode: 'DEU',
    accent: '#C9E4F0',
    coach: 'Petra Lindqvist',
    description:
      'Die Damen-Auswahl des Deutschen Bandy-Bundes im Aufbau — auf dem Weg zur ersten WM-Teilnahme.',
  },
  {
    id: 't-nachwuchs',
    slug: 'nachwuchs',
    name: 'Nachwuchs',
    gender: 'nachwuchs',
    ageGroup: 'U19',
    crestCode: 'DEU',
    accent: '#FFCC00',
    coach: 'Jonas Berg',
    description: 'Der Nachwuchskader (U19) des Deutschen Bandy-Bundes.',
  },
]

const DE = 'Deutschland'

// --- Players (Herren) -------------------------------------------------------
// number, first, last, position, opts
type P = Partial<Player> & {
  first: string
  last: string
  number: number
  position: Player['position']
}

export function slugifyName(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function player(p: P): Player {
  const slug = slugifyName(`${p.first}-${p.last}`)
  return {
    id: `p-${slug}`,
    slug,
    firstName: p.first,
    lastName: p.last,
    number: p.number,
    position: p.position,
    teamSlug: p.teamSlug ?? 'herren',
    nationality: p.nationality ?? 'Deutschland',
    birthYear: p.birthYear,
    joinedYear: p.joinedYear ?? 2019,
    heightCm: p.heightCm,
    weightKg: p.weightKg,
    status: p.status ?? 'active',
    captain: p.captain,
    club: p.club,
    portrait:
      p.portrait === null
        ? null
        : (p.portrait ?? { label: 'Freisteller-Porträt 3:4', ratio: '3/4' }),
    bio: p.bio === undefined ? defaultBio(p.first, p.last, p.position) : p.bio,
    stats: p.stats ?? { caps: 0, goals: 0, assists: 0 },
  }
}

function defaultBio(first: string, last: string, pos: Player['position']): string {
  const role =
    pos === 'TW'
      ? 'hält der Auswahl im Tor den Rücken frei'
      : pos === 'VER'
        ? 'organisiert die Defensive'
        : pos === 'MF'
          ? 'lenkt das Spiel aus dem Mittelfeld'
          : 'sorgt für die Tore'
  return `${first} ${last} ${role} und gehört seit mehreren Saisons zum festen Stamm der Nationalmannschaft. Auf dem Eis überzeugt ${first} durch Übersicht, Zweikampfstärke und einen unbedingten Willen.`
}

export const players: Player[] = [
  player({ first: 'Lukas', last: 'Brandt', number: 1, position: 'TW', captain: false, birthYear: 1994, joinedYear: 2016, heightCm: 189, weightKg: 84, club: 'Berlin Bandy', stats: { caps: 41, goals: 0, assists: 2 } }),
  player({ first: 'Erik', last: 'Sundberg', number: 5, position: 'VER', birthYear: 1996, club: 'Frankfurt IceHawks', stats: { caps: 33, goals: 3, assists: 7 } }),
  player({ first: 'Maximilian', last: 'Vogt', number: 6, position: 'VER', birthYear: 1998, club: 'München EV', stats: { caps: 22, goals: 1, assists: 5 } }),
  // no portrait → ghost-number card
  player({ first: 'Tobias', last: 'Reinhardt', number: 8, position: 'VER', portrait: null, birthYear: 1999, club: 'Hamburg Crocodiles', stats: { caps: 18, goals: 0, assists: 3 } }),
  player({ first: 'Jan', last: 'Kowalski', number: 10, position: 'MF', captain: true, birthYear: 1993, joinedYear: 2014, heightCm: 182, weightKg: 78, club: 'Berlin Bandy', stats: { caps: 58, goals: 24, assists: 31 } }),
  player({ first: 'Felix', last: 'Andersson', number: 11, position: 'MF', birthYear: 1997, club: 'Frankfurt IceHawks', stats: { caps: 29, goals: 9, assists: 14 } }),
  player({ first: 'Noah', last: 'Weiß', number: 14, position: 'MF', birthYear: 2001, club: 'Dresden Ice', stats: { caps: 12, goals: 2, assists: 4 } }),
  // no bio → bio section omitted
  player({ first: 'Elias', last: 'Hofmann', number: 17, position: 'MF', bio: null, birthYear: 2000, club: 'München EV', stats: { caps: 15, goals: 4, assists: 6 } }),
  player({ first: 'Paul', last: 'Nyström', number: 19, position: 'ST', birthYear: 1995, club: 'Berlin Bandy', stats: { caps: 37, goals: 28, assists: 12 } }),
  player({ first: 'David', last: 'Schneider', number: 21, position: 'ST', birthYear: 1998, club: 'Hamburg Crocodiles', stats: { caps: 26, goals: 15, assists: 9 } }),
  player({ first: 'Moritz', last: 'Lindgren', number: 23, position: 'ST', birthYear: 2002, club: 'Dresden Ice', stats: { caps: 8, goals: 3, assists: 1 } }),
  // second no-portrait case
  player({ first: 'Samuel', last: 'Okafor', number: 24, position: 'ST', portrait: null, nationality: 'Deutschland', birthYear: 2003, club: 'Frankfurt IceHawks', stats: { caps: 5, goals: 1, assists: 0 } }),
  player({ first: 'Benedikt', last: 'Frisch', number: 27, position: 'VER', birthYear: 1997, club: 'München EV', stats: { caps: 20, goals: 0, assists: 2 } }),
  player({ first: 'Leon', last: 'Karlsson', number: 30, position: 'TW', birthYear: 2000, club: 'Berlin Bandy', stats: { caps: 6, goals: 0, assists: 0 } }),
  player({ first: 'Julian', last: 'Mayer', number: 34, position: 'MF', birthYear: 1996, club: 'Hamburg Crocodiles', stats: { caps: 24, goals: 7, assists: 11 } }),
  player({ first: 'Fabian', last: 'Roth', number: 77, position: 'ST', birthYear: 1994, club: 'Dresden Ice', status: 'injured', stats: { caps: 31, goals: 19, assists: 8 } }),
  player({ first: 'Henrik', last: 'Wagner', number: 88, position: 'VER', birthYear: 1992, joinedYear: 2013, club: 'Berlin Bandy', status: 'alumni', stats: { caps: 64, goals: 5, assists: 18 } }),
]

// --- Staff ------------------------------------------------------------------
export const staff: Staff[] = [
  { id: 's-1', name: 'Andreas Keller', role: 'Cheftrainer', teamSlug: 'herren', portrait: { label: 'Porträt 3:4', ratio: '3/4' } },
  { id: 's-2', name: 'Petra Lindqvist', role: 'Co-Trainerin', teamSlug: 'herren', portrait: null },
  { id: 's-3', name: 'Dr. Martin Voss', role: 'Mannschaftsarzt', teamSlug: 'herren', portrait: { label: 'Porträt 3:4', ratio: '3/4' } },
]

// --- Sides (opponents + Germany) -------------------------------------------
const germany: Side = { kind: 'team', name: DE, shortName: 'GER', crestCode: 'DEU', accent: '#DD0000', teamSlug: 'herren', country: 'Deutschland' }
const opp = (name: string, short: string, code: string, accent: string, country: string): Side => ({ kind: 'opponent', name, shortName: short, crestCode: code, accent, country })
const finland = opp('Finnland', 'FIN', 'FIN', '#1F5F7D', 'Finnland')
const norway = opp('Norwegen', 'NOR', 'NOR', '#C42B2B', 'Norwegen')
const sweden = opp('Schweden', 'SWE', 'SWE', '#E0B400', 'Schweden')
const netherlands = opp('Niederlande', 'NED', 'NED', '#DD6B00', 'Niederlande')
const estonia = opp('Estland', 'EST', 'EST', '#2FBF71', 'Estland')

const berlin = { name: 'Horst-Dohm-Eisstadion', city: 'Berlin', address: 'Fritz-Wildung-Straße 9, 14199 Berlin', mapQuery: 'Horst-Dohm-Eisstadion, Berlin' }
const frankfurt = { name: 'Eissporthalle Frankfurt', city: 'Frankfurt am Main', address: 'Am Bornheimer Hang 4, 60386 Frankfurt', mapQuery: 'Eissporthalle Frankfurt' }
const inzell = { name: 'Max Aicher Arena', city: 'Inzell', address: 'Reichenhaller Str. 15, 83334 Inzell', mapQuery: 'Max Aicher Arena Inzell' }

// --- Games ------------------------------------------------------------------
export const games: Game[] = [
  // Next scheduled match — drives the home countdown (16.01.2027, 15:00 Berlin)
  {
    id: 'g-fin', slug: '2027-01-16-deutschland-finnland', kickoff: '2027-01-16T14:00:00Z', status: 'scheduled',
    competition: { name: 'WM-Qualifikation', kind: 'qualifier' }, round: 'Gruppe B · 3. Spieltag',
    home: germany, away: finland, venue: berlin, isTournamentGame: false, ticketUrl: '#tickets',
  },
  // Live (demo) — for the live row / scoreboard state
  {
    id: 'g-ned', slug: '2027-01-20-deutschland-niederlande', kickoff: '2027-01-20T18:30:00Z', status: 'live',
    competition: { name: 'WM-Qualifikation', kind: 'qualifier' }, round: 'Gruppe B · 4. Spieltag',
    home: germany, away: netherlands, homeScore: 2, awayScore: 1, halftime: { home: 1, away: 1 }, liveMinute: 63,
    venue: frankfurt, isTournamentGame: false,
    events: [
      { minute: 12, type: 'goal', side: 'away', title: 'Tor Niederlande', running: { home: 0, away: 1 }, detail: 'van Dijk' },
      { minute: 28, type: 'goal', side: 'home', title: 'Tor Deutschland', running: { home: 1, away: 1 }, detail: 'Nyström (Kowalski)' },
      { minute: 57, type: 'goal', side: 'home', title: 'Tor Deutschland', running: { home: 2, away: 1 }, detail: 'Schneider' },
      { minute: 61, type: 'penalty', side: 'away', title: 'Strafzeit Niederlande', detail: '5 Min · de Vries' },
    ],
    stats: [
      { label: 'Ballbesitz %', home: 54, away: 46 },
      { label: 'Torschüsse', home: 14, away: 9 },
      { label: 'Ecken', home: 6, away: 4 },
      { label: 'Strafzeiten', home: 2, away: 3 },
    ],
    referee: 'A. Johansson (SWE)', attendance: 1240,
  },
  // Finished — result (loss), full detail for the match page
  {
    id: 'g-nor', slug: '2026-11-22-deutschland-norwegen', kickoff: '2026-11-22T13:00:00Z', status: 'finished',
    competition: { name: 'Länderspiel', kind: 'friendly' }, round: 'Testspiel',
    home: germany, away: norway, homeScore: 3, awayScore: 5, halftime: { home: 2, away: 2 },
    venue: berlin, isTournamentGame: false,
    events: [
      { minute: 8, type: 'goal', side: 'home', title: 'Tor Deutschland', running: { home: 1, away: 0 }, detail: 'Nyström' },
      { minute: 19, type: 'goal', side: 'away', title: 'Tor Norwegen', running: { home: 1, away: 1 }, detail: 'Berg' },
      { minute: 33, type: 'goal', side: 'home', title: 'Tor Deutschland', running: { home: 2, away: 1 }, detail: 'Schneider (Andersson)' },
      { minute: 44, type: 'goal', side: 'away', title: 'Tor Norwegen', running: { home: 2, away: 2 }, detail: 'Haugen' },
      { minute: 61, type: 'goal', side: 'away', title: 'Tor Norwegen', running: { home: 2, away: 3 }, detail: 'Berg' },
      { minute: 74, type: 'goal', side: 'away', title: 'Tor Norwegen', running: { home: 2, away: 4 }, detail: 'Solberg' },
      { minute: 82, type: 'goal', side: 'home', title: 'Tor Deutschland', running: { home: 3, away: 4 }, detail: 'Roth' },
      { minute: 89, type: 'goal', side: 'away', title: 'Tor Norwegen', running: { home: 3, away: 5 }, detail: 'Berg' },
    ],
    stats: [
      { label: 'Ballbesitz %', home: 48, away: 52 },
      { label: 'Torschüsse', home: 17, away: 21 },
      { label: 'Ecken', home: 7, away: 8 },
      { label: 'Strafzeiten', home: 4, away: 2 },
    ],
    referee: 'M. Korhonen (FIN)', attendance: 1560,
    report: {
      paragraphs: [
        'Deutschland erwischte gegen ein abgezocktes Norwegen einen guten Start und führte früh durch Paul Nyström. Doch die Gäste zeigten über die gesamte Distanz die größere Kaltschnäuzigkeit.',
        'Nach ausgeglichener erster Halbzeit drehte Norwegen im Schlussdrittel auf. Der Anschlusstreffer von Fabian Roth kam zu spät, um die Partie noch einmal offen zu gestalten.',
        'Für die Auswahl von Andreas Keller bleiben trotz der Niederlage viele positive Ansätze — vor allem in der Chancenverwertung gilt es bis zur WM-Qualifikation zuzulegen.',
      ],
      pullQuote: 'Wir haben 60 Minuten mitgehalten und uns dann zu einfach auskontern lassen.',
    },
    gallery: [
      { label: 'Spielfoto 1', ratio: '4/3' }, { label: 'Spielfoto 2', ratio: '4/3' },
      { label: 'Spielfoto 3', ratio: '4/3' }, { label: 'Spielfoto 4', ratio: '4/3' },
      { label: 'Spielfoto 5', ratio: '4/3' }, { label: 'Spielfoto 6', ratio: '4/3' },
    ],
    roster: {
      submitted: true,
      home: {
        coach: 'Andreas Keller', formation: '3-3-4',
        players: [
          { firstName: 'Lukas', lastName: 'Brandt', number: 1, position: 'TW', starter: true, playerSlug: 'lukas-brandt' },
          { firstName: 'Erik', lastName: 'Sundberg', number: 5, position: 'VER', starter: true, playerSlug: 'erik-sundberg' },
          { firstName: 'Maximilian', lastName: 'Vogt', number: 6, position: 'VER', starter: true, playerSlug: 'maximilian-vogt' },
          { firstName: 'Benedikt', lastName: 'Frisch', number: 27, position: 'VER', starter: true, playerSlug: 'benedikt-frisch' },
          { firstName: 'Jan', lastName: 'Kowalski', number: 10, position: 'MF', starter: true, captain: true, events: ['assist'], playerSlug: 'jan-kowalski' },
          { firstName: 'Felix', lastName: 'Andersson', number: 11, position: 'MF', starter: true, events: ['assist'], playerSlug: 'felix-andersson' },
          { firstName: 'Julian', lastName: 'Mayer', number: 34, position: 'MF', starter: true, playerSlug: 'julian-mayer' },
          { firstName: 'Paul', lastName: 'Nyström', number: 19, position: 'ST', starter: true, events: ['goal'], playerSlug: 'paul-nystroem' },
          { firstName: 'David', lastName: 'Schneider', number: 21, position: 'ST', starter: true, events: ['goal'], playerSlug: 'david-schneider' },
          { firstName: 'Fabian', lastName: 'Roth', number: 77, position: 'ST', starter: true, events: ['goal'], playerSlug: 'fabian-roth' },
          { firstName: 'Noah', lastName: 'Weiß', number: 14, position: 'MF', starter: true, playerSlug: 'noah-weiss' },
        ],
        bench: ['30 Karlsson', '8 Reinhardt', '23 Lindgren', '24 Okafor', '17 Hofmann'],
      },
      away: {
        coach: 'Ole Gunnarsen', formation: '3-3-4',
        players: [
          { firstName: 'Anders', lastName: 'Lie', number: 1, position: 'TW', starter: true },
          { firstName: 'Henrik', lastName: 'Berg', number: 9, position: 'ST', starter: true, captain: true, events: ['goal', 'goal', 'goal'] },
          { firstName: 'Ole', lastName: 'Haugen', number: 7, position: 'MF', starter: true, events: ['goal'] },
          { firstName: 'Sander', lastName: 'Solberg', number: 11, position: 'ST', starter: true, events: ['goal'] },
        ],
        bench: ['Bench folgt'],
      },
    },
  },
  // Draw (finished)
  {
    id: 'g-swe', slug: '2026-12-06-deutschland-schweden', kickoff: '2026-12-06T15:00:00Z', status: 'finished',
    competition: { name: 'Länderspiel', kind: 'friendly' },
    home: germany, away: sweden, homeScore: 4, awayScore: 4, halftime: { home: 2, away: 3 },
    venue: inzell, isTournamentGame: false,
  },
  // Postponed (with new date)
  {
    id: 'g-est', slug: '2027-02-07-deutschland-estland', kickoff: '2027-02-07T14:00:00Z', status: 'postponed',
    competition: { name: 'WM-Qualifikation', kind: 'qualifier' }, round: 'Gruppe B · 5. Spieltag',
    home: germany, away: estonia, venue: frankfurt, isTournamentGame: false, postponedTo: '2027-02-21T14:00:00Z',
  },
  // Cancelled (with reason)
  {
    id: 'g-nor2', slug: '2027-03-01-norwegen-deutschland', kickoff: '2027-03-01T17:00:00Z', status: 'cancelled',
    competition: { name: 'Länderspiel', kind: 'friendly' },
    home: norway, away: germany, venue: { name: 'Vikingskipet', city: 'Hamar', mapQuery: 'Vikingskipet Hamar' },
    isTournamentGame: false, cancellationReason: 'Witterungsbedingt abgesagt',
  },
  // Further scheduled matches (spread across months for the grouped list)
  {
    id: 'g-fin2', slug: '2027-02-28-finnland-deutschland', kickoff: '2027-02-28T16:00:00Z', status: 'scheduled',
    competition: { name: 'WM-Qualifikation', kind: 'qualifier' }, round: 'Gruppe B · 6. Spieltag',
    home: finland, away: germany, venue: { name: 'Oulun jäähalli', city: 'Oulu', mapQuery: 'Oulun jäähalli' }, isTournamentGame: false,
  },
]

export function gamesSorted(): Game[] {
  return [...games].sort((a, b) => a.kickoff.localeCompare(b.kickoff))
}

// --- Standings --------------------------------------------------------------
export const standingsWMQ: Standings = {
  competition: 'WM-Qualifikation · Gruppe B',
  rows: [
    { rank: 1, teamName: 'Finnland', played: 4, win: 4, draw: 0, loss: 0, goalsFor: 22, goalsAgainst: 7, points: 12, zone: 'qualify' },
    { rank: 2, teamName: 'Norwegen', played: 4, win: 3, draw: 0, loss: 1, goalsFor: 18, goalsAgainst: 11, points: 9, zone: 'qualify' },
    { rank: 3, teamName: 'Deutschland', isGermany: true, played: 4, win: 2, draw: 1, loss: 1, goalsFor: 15, goalsAgainst: 14, points: 7 },
    { rank: 4, teamName: 'Niederlande', played: 4, win: 1, draw: 1, loss: 2, goalsFor: 12, goalsAgainst: 15, points: 4 },
    { rank: 5, teamName: 'Estland', played: 4, win: 1, draw: 0, loss: 3, goalsFor: 9, goalsAgainst: 18, points: 3, zone: 'relegate' },
    { rank: 6, teamName: 'Lettland', played: 4, win: 0, draw: 0, loss: 4, goalsFor: 6, goalsAgainst: 17, points: 0, zone: 'relegate' },
  ],
}

export const standingsPreseason: Standings = {
  competition: 'Bandy-Bundesliga 2027/28',
  preseason: true,
  note: 'Die Saison hat noch nicht begonnen. Der Spielbetrieb startet im November 2027.',
  rows: ['Berlin Bandy', 'Frankfurt IceHawks', 'München EV', 'Hamburg Crocodiles', 'Dresden Ice'].map(
    (teamName, i) => ({ rank: i + 1, teamName, played: 0, win: 0, draw: 0, loss: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }),
  ),
}

// --- Tournament (without table) --------------------------------------------
export const tournaments: Tournament[] = [
  {
    id: 'trn-pokal', slug: 'deutscher-rinkbandy-pokal-2027', name: 'Deutscher Rinkbandy-Pokal 2027',
    format: 'K.-o.-Turnier · 4 Mannschaften', startDate: '2027-03-13', endDate: '2027-03-14',
    venue: inzell, hero: { label: 'Turnier-Hero 16:9', ratio: '16/9' },
    participants: [
      { name: 'Berlin Bandy', host: false, resolved: true },
      { name: 'Frankfurt IceHawks', resolved: true },
      { name: 'München EV', host: true, resolved: true },
      { name: 'Hamburg Crocodiles', resolved: true },
    ],
    rules: ['2 × 30 Minuten', 'Bei Gleichstand: Penalty­schießen', 'Kleinfeld (Rinkbandy)'],
    weatherNote: 'Bei Tauwetter kann der Zeitplan kurzfristig angepasst werden.',
    days: [
      {
        label: 'Samstag · Halbfinals', date: '2027-03-13',
        games: [
          { id: 'trn-hf1', slug: 'hf1', kickoff: '2027-03-13T10:00:00Z', status: 'scheduled', competition: { name: 'Halbfinale 1', kind: 'tournament' }, home: opp('Berlin Bandy', 'BER', 'BER', '#DD0000', 'Deutschland'), away: opp('Hamburg Crocodiles', 'HAM', 'HAM', '#1F5F7D', 'Deutschland'), venue: inzell, isTournamentGame: true, tournamentSlug: 'deutscher-rinkbandy-pokal-2027' },
          { id: 'trn-hf2', slug: 'hf2', kickoff: '2027-03-13T13:00:00Z', status: 'scheduled', competition: { name: 'Halbfinale 2', kind: 'tournament' }, home: opp('München EV', 'MUC', 'MUC', '#FFCC00', 'Deutschland'), away: opp('Frankfurt IceHawks', 'FRA', 'FRA', '#2FBF71', 'Deutschland'), venue: inzell, isTournamentGame: true, tournamentSlug: 'deutscher-rinkbandy-pokal-2027' },
        ],
      },
      {
        label: 'Sonntag · Platzierung & Finale', date: '2027-03-14',
        games: [
          { id: 'trn-p3', slug: 'p3', kickoff: '2027-03-14T10:00:00Z', status: 'scheduled', competition: { name: 'Spiel um Platz 3', kind: 'tournament' }, round: 'Teilnehmer offen', home: opp('Verlierer HF1', '—', '—', '#98A3AD', ''), away: opp('Verlierer HF2', '—', '—', '#98A3AD', ''), venue: inzell, isTournamentGame: true, tournamentSlug: 'deutscher-rinkbandy-pokal-2027' },
          { id: 'trn-final', slug: 'final', kickoff: '2027-03-14T13:00:00Z', status: 'scheduled', competition: { name: 'Finale', kind: 'tournament' }, round: 'Teilnehmer offen', home: opp('Sieger HF1', '—', '—', '#98A3AD', ''), away: opp('Sieger HF2', '—', '—', '#98A3AD', ''), venue: inzell, isTournamentGame: true, tournamentSlug: 'deutscher-rinkbandy-pokal-2027' },
        ],
      },
    ],
  },
]

// --- News -------------------------------------------------------------------
export const news: NewsTeaser[] = [
  { id: 'n-1', slug: 'wm-qualifikation-kader-nominiert', title: 'WM-Qualifikation: Keller nominiert 20 Spieler', excerpt: 'Cheftrainer Andreas Keller hat den Kader für die entscheidenden Januar-Spiele bekannt gegeben.', date: '2026-12-18', category: 'Nationalmannschaft', image: { label: 'News-Bild 16:9', ratio: '16/9' } },
  { id: 'n-2', slug: 'rueckblick-norwegen', title: 'Lehrstunde gegen Norwegen: 3:5 im Test', excerpt: 'Deutschland hielt lange mit, verlor am Ende aber verdient gegen die abgezockten Skandinavier.', date: '2026-11-23', category: 'Spielbericht', image: { label: 'News-Bild 16:9', ratio: '16/9' } },
  { id: 'n-3', slug: 'damen-auswahl-startet', title: 'Damen-Auswahl nimmt Trainingsbetrieb auf', excerpt: 'Der Aufbau der Damen-Nationalmannschaft schreitet voran — erste Lehrgänge sind terminiert.', date: '2026-11-10', category: 'Verband', image: null },
  { id: 'n-4', slug: 'rinkbandy-pokal-ausgelost', title: 'Rinkbandy-Pokal 2027 ausgelost', excerpt: 'Die vier Teilnehmer und der Spielplan für das Turnier in Inzell stehen fest.', date: '2026-10-30', category: 'Turnier', image: { label: 'News-Bild 16:9', ratio: '16/9' } },
]
