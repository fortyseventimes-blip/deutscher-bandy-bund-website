import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { HeroCompact } from '../blocks/HeroCompact/config'
import { RichTextBlock } from '../blocks/RichText/config'
import { CTABanner } from '../blocks/CTABanner/config'
import { Divider } from '../blocks/Divider/config'
import {
  publicReadPublished,
  createContent,
  updateContent,
  deleteContent,
} from '../access'
import { canPublishContent } from '../access/predicates'
import { auditAfterChange, auditAfterDelete } from '../audit/hooks'

/**
 * Editor-composed pages (openspec/specs/page-composition). RBAC: editors write
 * anything, authors only their own drafts, and only publishers may set the
 * published state (openspec/specs/admin-rbac). Every change is audited.
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
    drafts: { autosave: false },
    maxPerDoc: 25,
  },
  access: {
    read: publicReadPublished,
    create: createContent,
    update: updateContent,
    delete: deleteContent,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation, originalDoc }) => {
        // Stamp ownership so authors can be scoped to their own drafts.
        if (operation === 'create' && req.user && !data.createdBy) {
          data.createdBy = req.user.id
        }
        // Only publishers may move a document into the published state. This
        // guards authenticated non-publishers (e.g. authors); trusted local-API
        // / seed writes have no req.user and are allowed, since the collection
        // access rules already gate who can reach this operation at all.
        const becomingPublished =
          data._status === 'published' && originalDoc?._status !== 'published'
        if (becomingPublished && req.user && !canPublishContent(req.user)) {
          throw new APIError(
            'Sie sind nicht berechtigt, Inhalte zu veröffentlichen.',
            403,
            undefined,
            true,
          )
        }
        return data
      },
    ],
    afterChange: [auditAfterChange('pages')],
    afterDelete: [auditAfterDelete('pages')],
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
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', readOnly: true },
      access: {
        // Ownership is system-managed; never editable in the UI.
        update: () => false,
      },
    },
  ],
}
