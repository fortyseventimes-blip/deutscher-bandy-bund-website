import type { GlobalConfig } from 'payload'
import { superadminOnly } from '../access'
import { auditGlobalChange } from '../audit/hooks'

export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: { de: 'SEO-Standardwerte', en: 'SEO defaults' },
  admin: { group: { de: 'System', en: 'System' } },
  access: { read: () => true, update: superadminOnly },
  hooks: { afterChange: [auditGlobalChange('seo-defaults')] },
  fields: [
    {
      name: 'titleTemplate',
      type: 'text',
      label: { de: 'Titel-Vorlage', en: 'Title template' },
      defaultValue: '%s — Deutscher Bandy-Bund',
      admin: {
        description: {
          de: '%s wird durch den Seitentitel ersetzt.',
          en: '%s is replaced by the page title.',
        },
      },
    },
    {
      name: 'defaultDescription',
      type: 'textarea',
      label: { de: 'Standard-Beschreibung', en: 'Default description' },
      localized: true,
    },
  ],
}
