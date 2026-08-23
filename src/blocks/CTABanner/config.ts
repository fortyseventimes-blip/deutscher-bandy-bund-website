import type { Block } from 'payload'
import { blockSettings } from '../shared/blockSettings'

/** Full-width call-to-action band with a headline and one or two buttons. */
export const CTABanner: Block = {
  slug: 'ctaBanner',
  interfaceName: 'CTABannerBlock',
  labels: {
    singular: { de: 'CTA-Banner', en: 'CTA banner' },
    plural: { de: 'CTA-Banner', en: 'CTA banners' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { de: 'Titel', en: 'Title' },
      localized: true,
      required: true,
    },
    {
      name: 'lead',
      type: 'textarea',
      label: { de: 'Text', en: 'Text' },
      localized: true,
    },
    {
      name: 'buttons',
      type: 'array',
      label: { de: 'Buttons', en: 'Buttons' },
      maxRows: 2,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: { de: 'Beschriftung', en: 'Label' },
          localized: true,
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          label: { de: 'Ziel (URL)', en: 'Target (URL)' },
          required: true,
        },
        {
          name: 'variant',
          type: 'select',
          label: { de: 'Stil', en: 'Variant' },
          defaultValue: 'primary',
          options: [
            { label: { de: 'Primär', en: 'Primary' }, value: 'primary' },
            { label: { de: 'Sekundär', en: 'Secondary' }, value: 'secondary' },
            { label: { de: 'Ghost', en: 'Ghost' }, value: 'ghost' },
          ],
        },
      ],
    },
    blockSettings,
  ],
}
