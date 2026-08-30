import type { CollectionConfig } from 'payload'
import { publicReadPublished, createSport, updateSport, deleteSport } from '../access'
import { canPublishSport } from '../access/predicates'
import { publishGuard } from '../access/publishGuard'
import { auditAfterChange, auditAfterDelete } from '../audit/hooks'

/**
 * A tournament or grouped competition (openspec/specs/tournaments). Games
 * relate back to a tournament via `games.tournament`; this collection does not
 * embed games. Standings are editor-maintained, never computed
 * (openspec/specs/tournaments "Standings are editor-maintained"), and are
 * optional — a knockout cup renders with no standings section at all, not an
 * empty one.
 */
export const Tournaments: CollectionConfig = {
  slug: 'tournaments',
  labels: {
    singular: { de: 'Turnier', en: 'Tournament' },
    plural: { de: 'Turniere', en: 'Tournaments' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'startDate'],
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
    beforeChange: [publishGuard(canPublishSport)],
    afterChange: [auditAfterChange('tournaments')],
    afterDelete: [auditAfterDelete('tournaments')],
  },
  fields: [
    { name: 'name', type: 'text', label: { de: 'Name', en: 'Name' }, localized: true, required: true },
    {
      name: 'slug',
      type: 'text',
      label: { de: 'Slug', en: 'Slug' },
      localized: true,
      required: true,
      unique: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          label: { de: 'Typ', en: 'Type' },
          required: true,
          options: [
            { label: { de: 'Weltmeisterschaft', en: 'World Championship' }, value: 'weltmeisterschaft' },
            { label: { de: 'Pokal', en: 'Cup' }, value: 'pokal' },
            { label: { de: 'Liga', en: 'League' }, value: 'liga' },
            { label: { de: 'Qualifikation', en: 'Qualifier' }, value: 'qualifikation' },
            { label: { de: 'Turnier', en: 'Tournament' }, value: 'turnier' },
            { label: { de: 'Sonstiges', en: 'Other' }, value: 'sonstiges' },
          ],
        },
        { name: 'format', type: 'text', label: { de: 'Format', en: 'Format' }, localized: true, required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', label: { de: 'Beginn', en: 'Start' }, required: true },
        { name: 'endDate', type: 'date', label: { de: 'Ende', en: 'End' }, required: true },
      ],
    },
    {
      name: 'venue',
      type: 'relationship',
      relationTo: 'venues',
      label: { de: 'Spielstätte', en: 'Venue' },
      required: true,
    },
    { name: 'hero', type: 'upload', relationTo: 'media', label: { de: 'Hero-Bild', en: 'Hero image' } },
    {
      name: 'participants',
      type: 'array',
      label: { de: 'Teilnehmer', en: 'Participants' },
      fields: [
        { name: 'name', type: 'text', label: { de: 'Name', en: 'Name' }, required: true },
        { name: 'host', type: 'checkbox', label: { de: 'Gastgeber', en: 'Host' }, defaultValue: false },
        {
          name: 'resolved',
          type: 'checkbox',
          label: { de: 'Feststehend', en: 'Resolved' },
          defaultValue: true,
          admin: {
            description: {
              de: 'Deaktivieren, wenn der Teilnehmer noch offen ist (z. B. „Sieger HF1").',
              en: 'Disable while the participant is still open (e.g. "Winner SF1").',
            },
          },
        },
      ],
    },
    { name: 'rules', type: 'text', hasMany: true, localized: true, label: { de: 'Regeln', en: 'Rules' } },
    {
      name: 'weatherNote',
      type: 'text',
      localized: true,
      label: { de: 'Wetter-Hinweis', en: 'Weather note' },
    },
    {
      name: 'placement',
      type: 'text',
      localized: true,
      label: { de: 'Platzierung DBB', en: 'DBB placement' },
      admin: {
        description: {
          de: 'Für die Turnier-Historie und die Zeitleiste auf /verband.',
          en: 'For the tournament archive and the timeline on /federation.',
        },
      },
    },
    {
      name: 'featuredStandings',
      type: 'checkbox',
      label: { de: 'Tabelle auf /spiele anzeigen', en: 'Show table on /spiele' },
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: {
          de: 'Genau ein Turnier kann seine Tabelle auf der Spielplan-Seite zeigen.',
          en: 'Exactly one tournament can show its table on the fixtures page.',
        },
      },
    },
    {
      name: 'standings',
      type: 'group',
      label: { de: 'Tabelle', en: 'Standings' },
      admin: {
        description: {
          de: 'Leer lassen, wenn es für dieses Turnier keine Tabelle gibt (z. B. K.-o.-Turnier).',
          en: 'Leave empty when this tournament has no table (e.g. a knockout cup).',
        },
      },
      fields: [
        {
          name: 'preseason',
          type: 'checkbox',
          label: { de: 'Vorsaison (alle Werte 0)', en: 'Pre-season (all zeros)' },
          defaultValue: false,
        },
        { name: 'note', type: 'text', localized: true, label: { de: 'Hinweis', en: 'Note' } },
        {
          name: 'rows',
          type: 'array',
          label: { de: 'Zeilen', en: 'Rows' },
          fields: [
            { name: 'rank', type: 'number', label: { de: 'Platz', en: 'Rank' }, required: true },
            { name: 'teamName', type: 'text', label: { de: 'Mannschaft', en: 'Team' }, required: true },
            { name: 'isGermany', type: 'checkbox', label: { de: 'Deutschland', en: 'Germany' }, defaultValue: false },
            {
              type: 'row',
              fields: [
                { name: 'played', type: 'number', label: { de: 'Sp', en: 'P' }, required: true, defaultValue: 0 },
                { name: 'win', type: 'number', label: { de: 'S', en: 'W' }, required: true, defaultValue: 0 },
                { name: 'draw', type: 'number', label: { de: 'U', en: 'D' }, required: true, defaultValue: 0 },
                { name: 'loss', type: 'number', label: { de: 'N', en: 'L' }, required: true, defaultValue: 0 },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'goalsFor', type: 'number', label: { de: 'Tore', en: 'Goals for' }, required: true, defaultValue: 0 },
                { name: 'goalsAgainst', type: 'number', label: { de: 'Gegentore', en: 'Goals against' }, required: true, defaultValue: 0 },
                { name: 'points', type: 'number', label: { de: 'Punkte', en: 'Points' }, required: true, defaultValue: 0 },
              ],
            },
            {
              name: 'zone',
              type: 'select',
              label: { de: 'Zone', en: 'Zone' },
              options: [
                { label: { de: 'Qualifikation', en: 'Qualification' }, value: 'qualify' },
                { label: { de: 'Abstieg', en: 'Relegation' }, value: 'relegate' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
