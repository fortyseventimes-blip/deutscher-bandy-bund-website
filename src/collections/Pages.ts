import type { CollectionConfig } from 'payload'
import { HeroCompact } from '../blocks/HeroCompact/config'
import { RichTextBlock } from '../blocks/RichText/config'
import { CTABanner } from '../blocks/CTABanner/config'
import { Divider } from '../blocks/Divider/config'

/**
 * Editor-composed pages. Every page is an ordered array of blocks — no hardcoded
 * page templates (openspec/specs/page-composition). Draft/publish + versions are
 * on; the full scheduled-publish and RBAC wiring arrive in later slices.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: { de: 'Seite', en: 'Page' },
    plural: { de: 'Seiten', en: 'Pages' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: { de: 'Website', en: 'Website' },
  },
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 25,
  },
  access: {
    // Public site reads published docs only; the site loader also filters by
    // status. Authenticated admin users get the full set.
    read: () => true,
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
      name: 'slug',
      type: 'text',
      label: { de: 'Slug', en: 'Slug' },
      localized: true,
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: {
          de: 'URL-Pfad ohne Sprachpräfix, z. B. „impressum". Pro Sprache eigener Slug.',
          en: 'URL path without the locale prefix, e.g. "imprint". Localized per language.',
        },
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: { de: 'Module', en: 'Blocks' },
      blocks: [HeroCompact, RichTextBlock, CTABanner, Divider],
    },
  ],
}
