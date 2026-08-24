import type { GlobalConfig } from 'payload'
import { navTree } from './navFields'
import { superadminOnly } from '../access'
import { auditGlobalChange } from '../audit/hooks'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: { de: 'Fußzeile', en: 'Footer' },
  admin: { group: { de: 'Website', en: 'Website' } },
  access: { read: () => true, update: superadminOnly },
  hooks: { afterChange: [auditGlobalChange('footer')] },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: { de: 'Spalten', en: 'Columns' },
      maxRows: 4,
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: { de: 'Überschrift', en: 'Heading' },
          localized: true,
          required: true,
        },
        navTree('links'),
      ],
    },
    {
      name: 'tagline',
      type: 'textarea',
      label: { de: 'Kurzbeschreibung', en: 'Tagline' },
      localized: true,
    },
  ],
}
