import type { CollectionBeforeValidateHook, CollectionConfig, Field } from 'payload'
import { APIError } from 'payload'
import { publicReadPublished, createSport, updateSport, deleteSport } from '../access'
import { canPublishSport } from '../access/predicates'
import { publishGuard } from '../access/publishGuard'
import { auditAfterChange, auditAfterDelete } from '../audit/hooks'

const EVENT_TAGS = [
  { label: { de: 'Tor', en: 'Goal' }, value: 'goal' },
  { label: { de: 'Vorlage', en: 'Assist' }, value: 'assist' },
  { label: { de: 'Strafzeit', en: 'Penalty' }, value: 'penalty' },
]

const POSITION_OPTIONS = [
  { label: { de: 'Torwart', en: 'Goalkeeper' }, value: 'TW' },
  { label: { de: 'Verteidigung', en: 'Defence' }, value: 'VER' },
  { label: { de: 'Mittelfeld', en: 'Midfield' }, value: 'MF' },
  { label: { de: 'Sturm', en: 'Forward' }, value: 'ST' },
]

/** One matchday roster entry: a player reference is optional (the away side of
 * a friendly against a foreign club has no Payload player docs), but the
 * displayed name/number/position are always required. */
const rosterPlayerFields: Field[] = [
  {
    name: 'player',
    type: 'relationship',
    relationTo: 'players',
    label: { de: 'Spieler (Verknüpfung)', en: 'Player (link)' },
  },
  { name: 'firstName', type: 'text', label: { de: 'Vorname', en: 'First name' }, required: true },
  { name: 'lastName', type: 'text', label: { de: 'Nachname', en: 'Last name' }, required: true },
  { name: 'number', type: 'number', label: { de: 'Rückennummer', en: 'Number' }, required: true },
  {
    name: 'position',
    type: 'select',
    label: { de: 'Position', en: 'Position' },
    required: true,
    options: POSITION_OPTIONS,
  },
  { name: 'starter', type: 'checkbox', label: { de: 'Startelf', en: 'Starter' }, defaultValue: true },
  { name: 'captain', type: 'checkbox', label: { de: 'Kapitän', en: 'Captain' }, defaultValue: false },
  {
    // An array of rows (not a hasMany select) so the same tag can repeat —
    // a hat-trick is three `goal` rows, which a multi-select can't hold
    // since its options must be unique.
    name: 'events',
    type: 'array',
    label: { de: 'Ereignisse', en: 'Events' },
    fields: [{ name: 'type', type: 'select', required: true, options: EVENT_TAGS }],
  },
]

const teamRosterFields: Field[] = [
  { name: 'coach', type: 'text', label: { de: 'Trainer', en: 'Coach' } },
  { name: 'formation', type: 'text', label: { de: 'Formation', en: 'Formation' } },
  {
    name: 'players',
    type: 'array',
    label: { de: 'Spieler', en: 'Players' },
    fields: rosterPlayerFields,
  },
  {
    name: 'bench',
    type: 'text',
    hasMany: true,
    label: { de: 'Bank', en: 'Bench' },
  },
]

/** Reject a roster where the same linked player appears twice — validation
 * only applies to entries that reference a player (openspec/specs/
 * content-modeling "Player selected twice"). */
const noDuplicateRosterPlayers: CollectionBeforeValidateHook = ({ data }) => {
  type Entry = { player?: string | number | null }
  const checkSide = (players?: Entry[] | null) => {
    if (!players) return
    const seen = new Set<string>()
    for (const entry of players) {
      if (entry.player == null) continue
      const key = String(entry.player)
      if (seen.has(key)) {
        throw new APIError(
          'Ein Spieler ist mehrfach in der Aufstellung enthalten.',
          400,
          undefined,
          true,
        )
      }
      seen.add(key)
    }
  }
  checkSide(data?.roster?.home?.players)
  checkSide(data?.roster?.away?.players)
  return data
}

/**
 * A game: kick-off, status, sides, venue, optional tournament relation and
 * matchday roster (openspec/specs/content-modeling, fixtures-results,
 * tournaments). Home/away are polymorphic — a DBB `teams` document or an
 * external `opponents` document (design D3), so neutral-venue tournament
 * games where the federation is the away side stay honest.
 */
export const Games: CollectionConfig = {
  slug: 'games',
  labels: {
    singular: { de: 'Spiel', en: 'Game' },
    plural: { de: 'Spiele', en: 'Games' },
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'kickoff', 'gameStatus', 'competition'],
    group: { de: 'Sport', en: 'Sport' },
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 10,
  },
  access: {
    read: publicReadPublished,
    create: createSport,
    update: updateSport,
    delete: deleteSport,
  },
  hooks: {
    beforeValidate: [noDuplicateRosterPlayers],
    beforeChange: [publishGuard(canPublishSport)],
    afterChange: [auditAfterChange('games')],
    afterDelete: [auditAfterDelete('games')],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      label: { de: 'Slug', en: 'Slug' },
      required: true,
      unique: true,
      index: true,
      admin: {
        description: {
          de: 'z. B. „2027-01-16-deutschland-finnland".',
          en: 'e.g. "2027-01-16-deutschland-finnland".',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'kickoff',
          type: 'date',
          label: { de: 'Anpfiff (UTC)', en: 'Kick-off (UTC)' },
          required: true,
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          // Named gameStatus (not "status") to avoid colliding with Payload's
          // internal `_status` draft/publish enum, which drizzle-kit names
          // after the field name and would otherwise clash with this one.
          name: 'gameStatus',
          type: 'select',
          label: { de: 'Status', en: 'Status' },
          required: true,
          defaultValue: 'scheduled',
          options: [
            { label: { de: 'Angesetzt', en: 'Scheduled' }, value: 'scheduled' },
            { label: { de: 'Live', en: 'Live' }, value: 'live' },
            { label: { de: 'Beendet', en: 'Finished' }, value: 'finished' },
            { label: { de: 'Verlegt', en: 'Postponed' }, value: 'postponed' },
            { label: { de: 'Abgesagt', en: 'Cancelled' }, value: 'cancelled' },
          ],
        },
      ],
    },
    {
      name: 'competition',
      type: 'group',
      label: { de: 'Wettbewerb', en: 'Competition' },
      fields: [
        { name: 'name', type: 'text', label: { de: 'Bezeichnung', en: 'Name' }, required: true },
        {
          name: 'kind',
          type: 'select',
          label: { de: 'Art', en: 'Kind' },
          required: true,
          options: [
            { label: { de: 'Freundschaftsspiel', en: 'Friendly' }, value: 'friendly' },
            { label: { de: 'Turnier', en: 'Tournament' }, value: 'tournament' },
            { label: { de: 'Qualifikation', en: 'Qualifier' }, value: 'qualifier' },
            { label: { de: 'Liga', en: 'League' }, value: 'league' },
          ],
        },
      ],
    },
    { name: 'round', type: 'text', label: { de: 'Runde', en: 'Round' }, localized: true },
    {
      type: 'row',
      fields: [
        {
          name: 'home',
          type: 'relationship',
          relationTo: ['teams', 'opponents'],
          label: { de: 'Heim', en: 'Home' },
          required: true,
        },
        {
          name: 'away',
          type: 'relationship',
          relationTo: ['teams', 'opponents'],
          label: { de: 'Auswärts', en: 'Away' },
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'homeScore', type: 'number', label: { de: 'Tore Heim', en: 'Home score' }, min: 0 },
        { name: 'awayScore', type: 'number', label: { de: 'Tore Auswärts', en: 'Away score' }, min: 0 },
      ],
    },
    {
      name: 'halftime',
      type: 'group',
      label: { de: 'Halbzeitstand', en: 'Halftime score' },
      fields: [
        { name: 'home', type: 'number', label: { de: 'Heim', en: 'Home' } },
        { name: 'away', type: 'number', label: { de: 'Auswärts', en: 'Away' } },
      ],
    },
    {
      name: 'venue',
      type: 'relationship',
      relationTo: 'venues',
      label: { de: 'Spielstätte', en: 'Venue' },
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'isTournamentGame',
          type: 'checkbox',
          label: { de: 'Turnierspiel', en: 'Tournament game' },
          defaultValue: false,
        },
        {
          name: 'tournament',
          type: 'relationship',
          relationTo: 'tournaments',
          label: { de: 'Turnier', en: 'Tournament' },
          validate: (value: unknown, { data }: { data?: { isTournamentGame?: boolean } }) => {
            if (data?.isTournamentGame && !value) {
              return 'Bitte ein Turnier auswählen, wenn „Turnierspiel" aktiviert ist. / Please select a tournament when "Tournament game" is enabled.'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'tournamentDayLabel',
      type: 'text',
      label: { de: 'Turniertag-Überschrift', en: 'Tournament day heading' },
      localized: true,
      admin: {
        description: {
          de: 'Nur für Turnierspiele, z. B. „Samstag · Halbfinals".',
          en: 'Tournament games only, e.g. "Saturday · Semi-finals".',
        },
        condition: (data) => Boolean(data?.isTournamentGame),
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'liveMinute', type: 'number', label: { de: 'Live-Minute', en: 'Live minute' } },
        {
          name: 'postponedTo',
          type: 'date',
          label: { de: 'Neuer Termin', en: 'New date' },
          admin: { condition: (data) => data?.gameStatus === 'postponed' },
        },
      ],
    },
    {
      name: 'cancellationReason',
      type: 'text',
      label: { de: 'Absagegrund', en: 'Cancellation reason' },
      localized: true,
      admin: { condition: (data) => data?.gameStatus === 'cancelled' },
    },
    { name: 'ticketUrl', type: 'text', label: { de: 'Ticket-Link', en: 'Ticket link' } },
    {
      name: 'roster',
      type: 'group',
      label: { de: 'Aufstellung', en: 'Lineup' },
      fields: [
        {
          name: 'submitted',
          type: 'checkbox',
          label: { de: 'Aufstellung gemeldet', en: 'Lineup submitted' },
          defaultValue: false,
        },
        { name: 'home', type: 'group', label: { de: 'Heim', en: 'Home' }, fields: teamRosterFields },
        { name: 'away', type: 'group', label: { de: 'Auswärts', en: 'Away' }, fields: teamRosterFields },
      ],
    },
    {
      name: 'report',
      type: 'group',
      label: { de: 'Spielbericht', en: 'Match report' },
      fields: [
        {
          name: 'paragraphs',
          type: 'array',
          localized: true,
          label: { de: 'Absätze', en: 'Paragraphs' },
          fields: [{ name: 'text', type: 'textarea', required: true }],
        },
        { name: 'pullQuote', type: 'text', localized: true, label: { de: 'Zitat', en: 'Pull quote' } },
      ],
    },
    {
      name: 'events',
      type: 'array',
      label: { de: 'Ticker', en: 'Ticker' },
      fields: [
        { name: 'minute', type: 'number', label: { de: 'Minute', en: 'Minute' }, required: true },
        {
          name: 'type',
          type: 'select',
          label: { de: 'Art', en: 'Type' },
          required: true,
          options: [
            { label: { de: 'Tor', en: 'Goal' }, value: 'goal' },
            { label: { de: 'Strafzeit', en: 'Penalty' }, value: 'penalty' },
            { label: { de: 'Karte', en: 'Card' }, value: 'card' },
            { label: { de: 'Info', en: 'Info' }, value: 'info' },
          ],
        },
        {
          name: 'side',
          type: 'select',
          label: { de: 'Seite', en: 'Side' },
          required: true,
          options: [
            { label: { de: 'Heim', en: 'Home' }, value: 'home' },
            { label: { de: 'Auswärts', en: 'Away' }, value: 'away' },
          ],
        },
        { name: 'title', type: 'text', label: { de: 'Titel', en: 'Title' }, localized: true, required: true },
        {
          type: 'row',
          fields: [
            { name: 'runningHome', type: 'number', label: { de: 'Stand Heim', en: 'Running home' } },
            { name: 'runningAway', type: 'number', label: { de: 'Stand Auswärts', en: 'Running away' } },
          ],
        },
        { name: 'detail', type: 'text', label: { de: 'Detail', en: 'Detail' }, localized: true },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: { de: 'Statistik', en: 'Statistics' },
      fields: [
        { name: 'label', type: 'text', label: { de: 'Bezeichnung', en: 'Label' }, localized: true, required: true },
        { name: 'home', type: 'number', label: { de: 'Heim', en: 'Home' }, required: true },
        { name: 'away', type: 'number', label: { de: 'Auswärts', en: 'Away' }, required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'referee', type: 'text', label: { de: 'Schiedsrichter', en: 'Referee' } },
        { name: 'attendance', type: 'number', label: { de: 'Zuschauer', en: 'Attendance' } },
      ],
    },
    {
      name: 'weatherNote',
      type: 'text',
      label: { de: 'Wetter-Hinweis', en: 'Weather note' },
      localized: true,
    },
    {
      name: 'gallery',
      type: 'array',
      label: { de: 'Galerie', en: 'Gallery' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
  ],
}
