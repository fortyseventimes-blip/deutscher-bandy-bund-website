import type { Block } from 'payload'
import { blockSettings } from '../shared/blockSettings'

/**
 * Compact hero: kicker + title + lead + optional CTA. Text-only in this slice;
 * the media/right-hand-callout variants arrive with the media collection.
 */
export const HeroCompact: Block = {
  slug: 'heroCompact',
  interfaceName: 'HeroCompactBlock',
  labels: {
    singular: { de: 'Hero (kompakt)', en: 'Hero (compact)' },
    plural: { de: 'Heroes (kompakt)', en: 'Heroes (compact)' },
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      label: { de: 'Kicker', en: 'Kicker' },
      localized: true,
    },
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
      label: { de: 'Einleitung', en: 'Lead' },
      localized: true,
    },
    {
      name: 'cta',
      type: 'group',
      label: { de: 'Call to Action', en: 'Call to action' },
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
          label: { de: 'Ziel (URL)', en: 'Target (URL)' },
        },
      ],
    },
    blockSettings,
  ],
}
