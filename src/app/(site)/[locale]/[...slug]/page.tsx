import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getPageBySlug } from '@/lib/pages'
import { RenderBlocks } from '@/blocks/RenderBlocks'

// Pages are editor content resolved at request time (revalidation lands in
// Slice 2); render dynamically so a build never needs the database.
export const dynamic = 'force-dynamic'

type Params = { locale: Locale; slug: string[] }

async function resolve(params: Promise<Params>) {
  const { locale, slug } = await params
  return { locale, slugPath: slug.join('/') }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { locale, slugPath } = await resolve(params)
  const page = await getPageBySlug(slugPath, locale)
  if (!page) return {}
  return { title: page.title }
}

export default async function CmsPage({ params }: { params: Promise<Params> }) {
  const { locale, slugPath } = await resolve(params)
  setRequestLocale(locale)

  const page = await getPageBySlug(slugPath, locale)
  if (!page) notFound()

  return <RenderBlocks blocks={page.blocks} />
}
