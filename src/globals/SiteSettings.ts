import type { GlobalConfig } from 'payload'
import { superadminOnly } from '../access'
import { auditGlobalChange } from '../audit/hooks'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { de: 'Website-Einstellungen', en: 'Site settings' },
  admin: { group: { de: 'System', en: 'System' } },
  access: { read: () => true, update: superadminOnly },
  hooks: { afterChange: [auditGlobalChange('site-settings')] },
  fields: [
    {
      name: 'organizationName',
      type: 'text',
      label: { de: 'Name der Organisation', en: 'Organisation name' },
      defaultValue: 'Deutscher Bandy-Bund e. V.',
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: { de: 'Kontakt-E-Mail', en: 'Contact email' },
    },
    {
      name: 'social',
      type: 'array',
      label: { de: 'Soziale Netzwerke', en: 'Social links' },
      fields: [
        {
          name: 'platform',
          type: 'text',
          label: { de: 'Plattform', en: 'Platform' },
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
      ],
    },
  ],
}
