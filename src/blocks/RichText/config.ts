import type { Block } from 'payload'
import { blockSettings } from '../shared/blockSettings'

/** Freely-editable prose (Lexical). Body copy is capped to ~66ch at render. */
export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: {
    singular: { de: 'Fließtext', en: 'Rich text' },
    plural: { de: 'Fließtexte', en: 'Rich texts' },
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: { de: 'Inhalt', en: 'Content' },
      localized: true,
      required: true,
    },
    blockSettings,
  ],
}
