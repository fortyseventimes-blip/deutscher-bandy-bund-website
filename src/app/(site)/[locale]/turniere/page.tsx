import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getTournaments } from '@/lib/data'
import { ImageSlot } from '@/components/sport/ImageSlot'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { formatDate } from '@/lib/format'
import { routes } from '@/lib/routes'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return { title: t('tournaments') }
}

export default async function TournamentsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'nav' })
  const tournaments = await getTournaments()

  return (
    <div className="pb-16">
      <section className="border-b border-line" style={{ background: 'var(--surface-raised)' }}>
        <div className="container-page py-10 md:py-14">
          <Breadcrumbs items={[{ label: 'Home', href: routes.home(locale) }, { label: t('tournaments') }]} className="mb-4" />
          <h1 className="font-heading font-bold uppercase text-[32px] leading-9 md:text-[56px] md:leading-[60px]">{t('tournaments')}</h1>
        </div>
      </section>

      <div className="container-page py-8 grid gap-6 md:grid-cols-2">
        {tournaments.map((trn) => (
          <a key={trn.slug} href={routes.tournament(locale, trn.slug)} className="group rounded-card border border-line overflow-hidden hover:bg-surface-raised transition-colors">
            <ImageSlot image={trn.hero ?? { label: 'Turnier 16:9', ratio: '16/9' }} rounded={false} />
            <div className="p-5">
              <p className="text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--label-yellow-text)' }}>{trn.format}</p>
              <h2 className="mt-1 font-heading font-bold uppercase text-[24px] leading-7 group-hover:text-red transition-colors">{trn.name}</h2>
              <p className="mt-2 text-[13px] text-text-muted tabular">{formatDate(trn.startDate, locale)} – {formatDate(trn.endDate, locale)} · {trn.venue.city}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
