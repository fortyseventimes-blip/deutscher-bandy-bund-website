import type { Field } from 'payload'

/**
 * The settings group every block exposes — see openspec/specs/page-composition
 * "Shared block settings". Kept in a collapsed sidebar-style group so the block's
 * content fields stay front and centre for editors.
 */
export const blockSettings: Field = {
  name: 'settings',
  type: 'group',
  label: { de: 'Einstellungen', en: 'Settings' },
  admin: {
    description: {
      de: 'Anker, Hintergrund, Abstand und Sichtbarkeit für dieses Modul.',
      en: 'Anchor, background, spacing and visibility for this block.',
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'background',
          type: 'select',
          label: { de: 'Hintergrund', en: 'Background' },
          defaultValue: 'default',
          options: [
            { label: { de: 'Standard', en: 'Default' }, value: 'default' },
            { label: { de: 'Gedämpft', en: 'Muted' }, value: 'muted' },
            { label: { de: 'Invertiert', en: 'Inverted' }, value: 'inverted' },
            { label: { de: 'Akzent', en: 'Accent' }, value: 'accent' },
          ],
        },
        {
          name: 'spacing',
          type: 'select',
          label: { de: 'Vertikaler Abstand', en: 'Vertical spacing' },
          defaultValue: 'm',
          options: [
            { label: { de: 'Kein', en: 'None' }, value: 'none' },
            { label: 'S', value: 's' },
            { label: 'M', value: 'm' },
            { label: 'L', value: 'l' },
          ],
        },
      ],
    },
    {
      name: 'anchorId',
      type: 'text',
      label: { de: 'Anker-ID', en: 'Anchor id' },
      admin: {
        description: {
          de: 'Erlaubt Sprungmarken wie /verband#kader.',
          en: 'Enables in-page anchors such as /federation#squad.',
        },
      },
    },
  ],
}
