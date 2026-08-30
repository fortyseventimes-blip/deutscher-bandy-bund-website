import type { CollectionConfig } from 'payload'
import { publicReadPublished, createSport, updateSport, deleteSport } from '../access'
import { canPublishSport } from '../access/predicates'
import { publishGuard } from '../access/publishGuard'
import { auditAfterChange, auditAfterDelete } from '../audit/hooks'

/**
 * A player. Public, permanent, linkable identity per athlete
 * (openspec/specs/team-roster "Player page"). Draft/publish so a player can be
 * prepared (photo rights, bio) before going live. Jersey number lives here as
 * the player's current squad number; per-game numbers are recorded separately
 * on the game's roster entry (openspec/specs/content-modeling: uniqueness is
 * enforced only within a matchday roster, never on the player record).
 * Season-scoped team history lives in `memberships`; `team` is the current
 * assignment the squad pages query by.
 */
export const Players: CollectionConfig = {
  slug: 'players',
  labels: {
    singular: { de: 'Spieler', en: 'Player' },
    plural: { de: 'Spieler', en: 'Players' },
  },
  admin: {
    useAsTitle: 'lastName',
    defaultColumns: ['lastName', 'firstName', 'team', 'number', 'playerStatus'],
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
    afterChange: [auditAfterChange('players')],
    afterDelete: [auditAfterDelete('players')],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', label: { de: 'Vorname', en: 'First name' }, required: true },
        { name: 'lastName', type: 'text', label: { de: 'Nachname', en: 'Last name' }, required: true },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      label: { de: 'Slug', en: 'Slug' },
      localized: true,
      required: true,
      unique: true,
      index: true,
      admin: {
        description: {
          de: 'URL-Pfad, z. B. „jan-kowalski". SOLLTE in beiden Sprachen identisch sein.',
          en: 'URL path, e.g. "jan-kowalski". SHOULD be identical in both locales.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'team',
          type: 'relationship',
          relationTo: 'teams',
          label: { de: 'Team', en: 'Team' },
          required: true,
        },
        {
          name: 'number',
          type: 'number',
          label: { de: 'Rückennummer', en: 'Jersey number' },
          required: true,
          min: 0,
          max: 99,
        },
        {
          name: 'position',
          type: 'select',
          label: { de: 'Position', en: 'Position' },
          required: true,
          options: [
            { label: { de: 'Torwart', en: 'Goalkeeper' }, value: 'TW' },
            { label: { de: 'Verteidigung', en: 'Defence' }, value: 'VER' },
            { label: { de: 'Mittelfeld', en: 'Midfield' }, value: 'MF' },
            { label: { de: 'Sturm', en: 'Forward' }, value: 'ST' },
          ],
        },
      ],
    },
    {
      name: 'memberships',
      type: 'array',
      label: { de: 'Kaderzugehörigkeit (Saisonverlauf)', en: 'Team membership (season history)' },
      admin: {
        description: {
          de: 'Historie der Kaderzugehörigkeit pro Saison. Die aktuelle Zuordnung steht im Feld „Team" oben.',
          en: 'Season-by-season squad history. The current assignment is the "Team" field above.',
        },
      },
      fields: [
        { name: 'season', type: 'relationship', relationTo: 'seasons', required: true },
        { name: 'team', type: 'relationship', relationTo: 'teams', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          // Named playerStatus (not "status") to avoid colliding with
          // Payload's internal `_status` draft/publish enum, which
          // drizzle-kit names after the field name.
          name: 'playerStatus',
          type: 'select',
          label: { de: 'Status', en: 'Status' },
          required: true,
          defaultValue: 'active',
          options: [
            { label: { de: 'Aktiv', en: 'Active' }, value: 'active' },
            { label: { de: 'Verletzt', en: 'Injured' }, value: 'injured' },
            { label: { de: 'Inaktiv', en: 'Inactive' }, value: 'inactive' },
            { label: { de: 'Ehemalig', en: 'Alumni' }, value: 'alumni' },
          ],
        },
        {
          name: 'captain',
          type: 'checkbox',
          label: { de: 'Kapitän', en: 'Captain' },
          defaultValue: false,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'nationality', type: 'text', label: { de: 'Nationalität', en: 'Nationality' }, defaultValue: 'Deutschland' },
        { name: 'birthYear', type: 'number', label: { de: 'Geburtsjahr', en: 'Birth year' } },
        { name: 'joinedYear', type: 'number', label: { de: 'Im Kader seit', en: 'Joined in' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'heightCm', type: 'number', label: { de: 'Größe (cm)', en: 'Height (cm)' } },
        { name: 'weightKg', type: 'number', label: { de: 'Gewicht (kg)', en: 'Weight (kg)' } },
        { name: 'club', type: 'text', label: { de: 'Verein', en: 'Club' } },
      ],
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      label: { de: 'Porträt', en: 'Portrait' },
      admin: {
        description: {
          de: 'Freisteller-Porträt, transparent, 3:4. Ohne Bild erscheint die Rückennummer als Platzhalter.',
          en: 'Cut-out portrait, transparent, 3:4. Without an image the jersey number is shown instead.',
        },
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: { de: 'Biografie', en: 'Biography' },
      localized: true,
      admin: {
        description: {
          de: 'Leer lassen, wenn noch kein Porträttext vorliegt — der Abschnitt wird dann ausgeblendet.',
          en: 'Leave empty if no profile text exists yet — the section is then omitted.',
        },
      },
    },
    {
      name: 'stats',
      type: 'group',
      label: { de: 'Statistik', en: 'Stats' },
      fields: [
        { name: 'caps', type: 'number', label: { de: 'Länderspiele', en: 'Caps' }, defaultValue: 0 },
        { name: 'goals', type: 'number', label: { de: 'Tore', en: 'Goals' }, defaultValue: 0 },
        { name: 'assists', type: 'number', label: { de: 'Vorlagen', en: 'Assists' }, defaultValue: 0 },
      ],
    },
    {
      name: 'aiAssisted',
      type: 'checkbox',
      label: { de: 'KI-unterstützt erstellt', en: 'AI-assisted draft' },
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: {
          de: 'Wird gesetzt, wenn der Biografietext mit dem Redaktionsassistenten erstellt wurde.',
          en: 'Set when the biography text was drafted with the editorial assistant.',
        },
      },
    },
  ],
}
