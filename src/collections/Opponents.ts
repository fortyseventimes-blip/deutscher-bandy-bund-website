import type { CollectionConfig } from 'payload'
import { publicRead, createSport, updateSport, deleteSport } from '../access'
import { auditAfterChange, auditAfterDelete } from '../audit/hooks'

/**
 * A non-DBB side a game can be played against (openspec/specs/content-modeling
 * "Opponents are first-class but lightweight"). Kept intentionally small; the
 * editor creates one inline from the game editor and reuses it thereafter.
 */
export const Opponents: CollectionConfig = {
  slug: 'opponents',
  labels: {
    singular: { de: 'Gegner', en: 'Opponent' },
    plural: { de: 'Gegner', en: 'Opponents' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'shortName', 'country'],
    group: { de: 'Sport', en: 'Sport' },
  },
  access: {
    read: publicRead,
    create: createSport,
    update: updateSport,
    delete: deleteSport,
  },
  hooks: {
    afterChange: [auditAfterChange('opponents')],
    afterDelete: [auditAfterDelete('opponents')],
  },
  fields: [
    { name: 'name', type: 'text', label: { de: 'Name', en: 'Name' }, required: true },
    {
      name: 'shortName',
      type: 'text',
      label: { de: 'Kurzname', en: 'Short name' },
      required: true,
      admin: { description: { de: 'z. B. „Norwegen"', en: 'e.g. "Norway"' } },
    },
    {
      name: 'crestCode',
      type: 'text',
      label: { de: 'Wappen-Kürzel', en: 'Crest code' },
      required: true,
      maxLength: 3,
      admin: {
        description: {
          de: '3 Buchstaben für den Wappen-Platzhalter, z. B. „NOR".',
          en: '3-letter placeholder crest code, e.g. "NOR".',
        },
      },
    },
    { name: 'country', type: 'text', label: { de: 'Land', en: 'Country' } },
    {
      name: 'accent',
      type: 'text',
      label: { de: 'Akzentfarbe', en: 'Accent color' },
      admin: { description: { de: 'Hex-Wert für den Wappenring.', en: 'Hex value for the crest ring.' } },
    },
    { name: 'website', type: 'text', label: 'Website' },
    { name: 'crest', type: 'upload', relationTo: 'media', label: { de: 'Wappen', en: 'Crest' } },
  ],
}
