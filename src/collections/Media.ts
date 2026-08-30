import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'
import { publicRead, createSport, updateSport, deleteSport } from '../access'
import { auditAfterChange, auditAfterDelete } from '../audit/hooks'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Media library. Every image on the site (portraits, crests, gallery photos)
 * is optional at the point of use — an empty relationship renders the
 * designed fallback (ghost number, labelled drop-slot) rather than breaking a
 * page. This is a minimal, functional stand-in: required alt text is enforced
 * now; the full task (credit/license required, focal point, AVIF/WebP
 * derivatives — openspec task 2.14) is still open and tightens this later.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { de: 'Medium', en: 'Media' },
    plural: { de: 'Medien', en: 'Media' },
  },
  admin: {
    useAsTitle: 'alt',
    group: { de: 'Website', en: 'Website' },
  },
  access: {
    read: publicRead,
    create: createSport,
    update: updateSport,
    delete: deleteSport,
  },
  hooks: {
    afterChange: [auditAfterChange('media')],
    afterDelete: [auditAfterDelete('media')],
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 800 },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: { de: 'Alt-Text', en: 'Alt text' },
      localized: true,
      required: true,
    },
    {
      name: 'credit',
      type: 'text',
      label: { de: 'Bildnachweis', en: 'Credit' },
      admin: {
        description: {
          de: 'Fotograf oder Quelle. Vor Veröffentlichung von Spielerfotos verpflichtend.',
          en: 'Photographer or source. Mandatory before publishing player photos.',
        },
      },
    },
    {
      name: 'license',
      type: 'text',
      label: { de: 'Lizenz', en: 'License' },
    },
  ],
}
