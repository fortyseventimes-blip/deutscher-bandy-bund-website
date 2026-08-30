import type { CollectionConfig } from 'payload'
import { publicRead, createSport, updateSport, deleteSport } from '../access'
import { auditAfterChange, auditAfterDelete } from '../audit/hooks'

/**
 * A DBB squad (Herren, Damen, Nachwuchs, …). Reference data with no
 * draft/publish lifecycle — a team is either in the system or not
 * (openspec/specs/team-roster "Multiple squads").
 */
export const Teams: CollectionConfig = {
  slug: 'teams',
  labels: {
    singular: { de: 'Team', en: 'Team' },
    plural: { de: 'Teams', en: 'Teams' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'gender', 'ageGroup'],
    group: { de: 'Sport', en: 'Sport' },
  },
  access: {
    read: publicRead,
    create: createSport,
    update: updateSport,
    delete: deleteSport,
  },
  hooks: {
    afterChange: [auditAfterChange('teams')],
    afterDelete: [auditAfterDelete('teams')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { de: 'Name', en: 'Name' },
      localized: true,
      required: true,
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
          de: 'URL-Pfad, z. B. „herren". Pro Sprache eigener Slug.',
          en: 'URL path, e.g. "herren". Localized per language.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'gender',
          type: 'select',
          label: { de: 'Kategorie', en: 'Category' },
          required: true,
          options: [
            { label: { de: 'Herren', en: 'Men' }, value: 'herren' },
            { label: { de: 'Damen', en: 'Women' }, value: 'damen' },
            { label: { de: 'Nachwuchs', en: 'Youth' }, value: 'nachwuchs' },
          ],
        },
        { name: 'ageGroup', type: 'text', label: { de: 'Altersklasse', en: 'Age group' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'crestCode',
          type: 'text',
          label: { de: 'Wappen-Kürzel', en: 'Crest code' },
          required: true,
          maxLength: 3,
          defaultValue: 'DEU',
        },
        {
          name: 'shortName',
          type: 'text',
          label: { de: 'Kurzname', en: 'Short name' },
          required: true,
          maxLength: 3,
          defaultValue: 'GER',
        },
        {
          name: 'accent',
          type: 'text',
          label: { de: 'Akzentfarbe', en: 'Accent color' },
          admin: { description: { de: 'Hex-Wert.', en: 'Hex value.' } },
        },
      ],
    },
    { name: 'crest', type: 'upload', relationTo: 'media', label: { de: 'Wappen', en: 'Crest' } },
    {
      name: 'coach',
      type: 'text',
      label: { de: 'Trainer', en: 'Coach' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: { de: 'Beschreibung', en: 'Description' },
      localized: true,
    },
  ],
}
