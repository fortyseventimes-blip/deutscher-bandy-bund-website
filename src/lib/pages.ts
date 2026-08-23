import 'server-only'
import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from './payload'
import type { AnyBlock } from '@/blocks/RenderBlocks'

export type PageDoc = {
  title: string
  slug: string
  blocks?: AnyBlock[] | null
}

/**
 * Fetch a published page by its localized slug. Returns null on a miss or when
 * the database is unavailable, so routes render their 404 rather than crashing.
 * `_status` filtering enforces the draft/publish rule from content-modeling.
 */
export async function getPageBySlug(slug: string, locale: Locale): Promise<PageDoc | null> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      locale,
      fallbackLocale: 'de',
      where: {
        and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
      },
      limit: 1,
      depth: 2,
    })
    const doc = result.docs[0]
    if (!doc) return null
    return {
      title: doc.title as string,
      slug: doc.slug as string,
      blocks: (doc.blocks as AnyBlock[]) ?? [],
    }
  } catch {
    return null
  }
}
