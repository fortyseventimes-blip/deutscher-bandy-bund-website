import type { Field } from 'payload'

/**
 * One navigation entry: a label plus a link, optionally with children (depth 2).
 * Links may point to an internal path, an external URL or an in-page anchor —
 * see openspec/specs/navigation-static "Editor-managed navigation".
 */
const linkFields: Field[] = [
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
    label: { de: 'Ziel (Pfad, URL oder #Anker)', en: 'Target (path, URL or #anchor)' },
    localized: true,
    required: true,
  },
]

/** A navigation tree field with a maximum depth of two. */
export const navTree = (name: string): Field => ({
  name,
  type: 'array',
  label: { de: 'Navigation', en: 'Navigation' },
  labels: { singular: { de: 'Eintrag', en: 'Item' }, plural: { de: 'Einträge', en: 'Items' } },
  fields: [
    ...linkFields,
    {
      name: 'children',
      type: 'array',
      label: { de: 'Untereinträge', en: 'Sub-items' },
      fields: linkFields,
    },
  ],
})
