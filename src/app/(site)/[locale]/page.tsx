import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { HeroCompact } from '@/blocks/HeroCompact/Component'
import { Section } from '@/blocks/shared/Section'

/*
 * Home — FOUNDATION demo route. Renders the HeroCompact block with real copy
 * from the message catalogue so the site is visibly runnable and the tokens are
 * exercised, before the data-driven MatchdayHero/NewsTeaser/etc. land in Slice 2.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })

  return (
    <>
      <HeroCompact
        data={{
          blockType: 'heroCompact',
          kicker: t('home.kicker'),
          title: t('home.title'),
          lead: t('home.lead'),
          cta: { label: t('nav.newsletterCta'), href: locale === 'de' ? '/newsletter' : '/en/newsletter' },
          settings: { spacing: 'l' },
        }}
      />
      <Section settings={{ background: 'muted', spacing: 'm' }}>
        <p className="prose-measure text-text-muted text-[15px] leading-6">
          {t('home.foundationNote')}
        </p>
      </Section>
    </>
  )
}
