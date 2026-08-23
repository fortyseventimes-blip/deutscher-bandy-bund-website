import type { Block } from 'payload'

/** A 1px rule (or invisible spacer) between blocks. Elevation is never a shadow. */
export const Divider: Block = {
  slug: 'divider',
  interfaceName: 'DividerBlock',
  labels: {
    singular: { de: 'Trenner', en: 'Divider' },
    plural: { de: 'Trenner', en: 'Dividers' },
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: { de: 'Stil', en: 'Variant' },
      defaultValue: 'line',
      options: [
        { label: { de: 'Linie', en: 'Line' }, value: 'line' },
        { label: { de: 'Leerraum', en: 'Space' }, value: 'space' },
      ],
    },
  ],
}
