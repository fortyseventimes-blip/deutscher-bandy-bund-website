import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import type { Page } from '../payload-types'
import { headerNav, headerCta, legalPages } from './content'

type PageBlocks = Page['blocks']

/**
 * Idempotent seed for the foundation: an initial admin user, the header/footer
 * globals in both locales, and the three legal pages with localized slugs.
 * Safe to re-run — it upserts by slug. Run with `pnpm seed`.
 */
async function run() {
  const payload = await getPayload({ config })

  // --- Admin user -----------------------------------------------------------
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@bandy-bund.de'
  const password = process.env.SEED_ADMIN_PASSWORD || 'changeme-admin-123'
  const existingUsers = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (existingUsers.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: { email, password, name: 'Administrator', roles: ['superadmin'] },
    })
    payload.logger.info(`Created admin user ${email}`)
  } else {
    payload.logger.info(`Admin user ${email} already exists`)
  }

  // --- Header global (both locales) ----------------------------------------
  await payload.updateGlobal({
    slug: 'header',
    locale: 'de',
    data: { nav: headerNav.de, cta: headerCta.de },
  })
  await payload.updateGlobal({
    slug: 'header',
    locale: 'en',
    data: { nav: headerNav.en, cta: headerCta.en },
  })

  // --- Footer global (tagline both locales) --------------------------------
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'de',
    data: {
      tagline:
        'Deutscher Bandy-Bund e. V. — der nationale Verband für Bandy und Rinkbandy in Deutschland.',
    },
  })
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'en',
    data: {
      tagline:
        'Deutscher Bandy-Bund e. V. — the national governing body for bandy and rink bandy in Germany.',
    },
  })

  // --- Site settings --------------------------------------------------------
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { organizationName: 'Deutscher Bandy-Bund e. V.', contactEmail: 'info@bandy-bund.de' },
  })

  // --- Legal pages ----------------------------------------------------------
  for (const page of legalPages) {
    const heroDe = {
      blockType: 'heroCompact' as const,
      kicker: page.kicker.de,
      title: page.title.de,
      lead: page.lead.de,
    }
    const richDe = { blockType: 'richText' as const, content: page.body.de }
    const deBlocks = [heroDe, richDe] as unknown as PageBlocks

    // Upsert by German slug.
    const existing = await payload.find({
      collection: 'pages',
      locale: 'de',
      where: { slug: { equals: page.slug.de } },
      limit: 1,
    })

    let id: string | number
    if (existing.docs.length > 0) {
      id = existing.docs[0].id
      await payload.update({
        collection: 'pages',
        id,
        locale: 'de',
        data: { title: page.title.de, slug: page.slug.de, _status: 'published', blocks: deBlocks },
      })
    } else {
      const created = await payload.create({
        collection: 'pages',
        locale: 'de',
        data: { title: page.title.de, slug: page.slug.de, _status: 'published', blocks: deBlocks },
      })
      id = created.id
    }

    // Read back to get the generated block ids, then write the English locale
    // onto the same rows (the blocks array is non-localized; only the inner
    // title/lead/content fields differ per locale).
    const deDoc = await payload.findByID({ collection: 'pages', id, locale: 'de' })
    const rows = (deDoc.blocks ?? []) as Array<{ id?: string; blockType: string }>
    const enBlocks = rows.map((row) => {
      if (row.blockType === 'heroCompact') {
        return {
          id: row.id,
          blockType: 'heroCompact' as const,
          kicker: page.kicker.en,
          title: page.title.en,
          lead: page.lead.en,
        }
      }
      return { id: row.id, blockType: 'richText' as const, content: page.body.en }
    })

    await payload.update({
      collection: 'pages',
      id,
      locale: 'en',
      data: {
        title: page.title.en,
        slug: page.slug.en,
        _status: 'published',
        blocks: enBlocks as unknown as PageBlocks,
      },
    })

    payload.logger.info(`Seeded legal page /${page.slug.de} (/en/${page.slug.en})`)
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
