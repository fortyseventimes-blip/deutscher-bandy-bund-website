import type { CollectionConfig } from 'payload'
import { publicRead, createSport, updateSport, deleteSport } from '../access'
import { auditAfterChange, auditAfterDelete } from '../audit/hooks'

/**
 * A competitive season (e.g. "2026/27"). Reference data — no draft/publish
 * lifecycle of its own. Player team membership is season-scoped through
 * `players.memberships` (openspec/specs/team-roster).
 */
export const Seasons: CollectionConfig = {
  slug: 'seasons',
  labels: {
    singular: { de: 'Saison', en: 'Season' },
    plural: { de: 'Saisons', en: 'Seasons' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isCurrent'],
    group: { de: 'Sport', en: 'Sport' },
  },
  access: {
    read: publicRead,
    create: createSport,
    update: updateSport,
    delete: deleteSport,
  },
  hooks: {
    afterChange: [auditAfterChange('seasons')],
    afterDelete: [auditAfterDelete('seasons')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { de: 'Bezeichnung', en: 'Name' },
      required: true,
      unique: true,
      admin: { description: { de: 'z. B. „2026/27"', en: 'e.g. "2026/27"' } },
    },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', label: { de: 'Beginn', en: 'Start' } },
        { name: 'endDate', type: 'date', label: { de: 'Ende', en: 'End' } },
      ],
    },
    {
      name: 'isCurrent',
      type: 'checkbox',
      label: { de: 'Aktuelle Saison', en: 'Current season' },
      defaultValue: false,
    },
  ],
}
