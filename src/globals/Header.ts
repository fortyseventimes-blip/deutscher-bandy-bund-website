import type { GlobalConfig } from 'payload'
import { navTree } from './navFields'
import { superadminOnly } from '../access'
import { auditGlobalChange } from '../audit/hooks'

export const Header: GlobalConfig = {
  slug: 'header',
  label: { de: 'Kopfzeile', en: 'Header' },
  admin: { group: { de: 'Website', en: 'Website' } },
  access: { read: () => true, update: superadminOnly },
  hooks: { afterChange: [auditGlobalChange('header')] },
  fields: [
    navTree('nav'),
    {
      name: 'cta',
      type: 'group',
      label: { de: 'Aktion (Newsletter)', en: 'Call to action (newsletter)' },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: { de: 'Beschriftung', en: 'Label' },
          localized: true,
        },
        {
          name: 'href',
          type: 'text',
          label: { de: 'Ziel', en: 'Target' },
          localized: true,
        },
      ],
    },
  ],
}
