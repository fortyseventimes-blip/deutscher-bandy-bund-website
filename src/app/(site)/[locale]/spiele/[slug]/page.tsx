import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getGame, getNextMatch } from '@/lib/data'
import { Scoreboard } from '@/components/sport/Scoreboard'
import { MatchTabs } from '@/components/sport/MatchTabs'
import { MatchTimeline } from '@/components/sport/MatchTimeline'
import { MatchRoster } from '@/components/sport/MatchRoster'
import { StatBars } from '@/components/sport/StatBars'
import { KeyValuePanel } from '@/components/sport/KeyValuePanel'
import { ConsentPlaceholder } from '@/components/sport/ConsentPlaceholder'
import { ImageSlot } from '@/components/sport/ImageSlot'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { formatDateTime } from '@/lib/format'
import { routes } from '@/lib/routes'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const game = await getGame(slug)
  if (!game) return {}
  return { title: `${game.home.name} – ${game.away.name}` }
}

export default async function MatchPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const game = await getGame(slug)
  if (!game) notFound()

  const t = await getTranslations({ locale, namespace: 'screens.match' })
  const ti = await getTranslations({ locale, namespace: 'sport.info' })
  const tt = await getTranslations({ locale, namespace: 'sport.tabs' })
  const tf = await getTranslations({ locale, namespace: 'screens.fixtures' })
  const nextMatch = await getNextMatch()

  const hasEvents = (game.events?.length ?? 0) > 0
  const hasStats = (game.stats?.length ?? 0) > 0
  const tabs = (['overview', 'lineup', 'ticker', 'stats', 'gallery'] as const).filter((k) => {
    if (k === 'ticker') return hasEvents
    if (k === 'stats') return hasStats
    return true
  })

  const infoRows = [
    { label: ti('competition'), value: game.competition.name },
    { label: ti('venue'), value: `${game.venue.name}, ${game.venue.city}` },
    { label: ti('kickoff'), value: formatDateTime(game.kickoff, locale) },
    ...(game.referee ? [{ label: ti('referee'), value: game.referee }] : []),
    ...(game.attendance ? [{ label: ti('attendance'), value: game.attendance.toLocaleString(locale === 'de' ? 'de-DE' : 'en-GB') }] : []),
  ]

  return (
    <div className="pb-16">
      <div className="container-page pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: routes.home(locale) },
            { label: tf('title'), href: routes.fixtures(locale) },
            { label: `${game.home.shortName}–${game.away.shortName}` },
          ]}
        />
      </div>

      <div className="container-page mt-4">
        <Scoreboard game={game} locale={locale} />
        {game.status === 'scheduled' && game.ticketUrl && (
          <div className="mt-4 flex justify-center">
            <Button href={game.ticketUrl}>{t('buyTickets')}</Button>
          </div>
        )}
      </div>

      <div className="container-page mt-6">
        <MatchTabs tabs={[...tabs]} />
      </div>

      {/* Overview: report + sidebar */}
      <section id="match-overview" className="container-page mt-8 scroll-mt-32">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          <div>
            {game.report ? (
              <div className="prose-measure">
                <h2 className="font-heading font-bold uppercase text-[26px] md:text-[32px] mb-4">{t('report')}</h2>
                {game.report.paragraphs.map((para, i) => (
                  <p key={i} className="text-[17px] leading-7 md:text-[18px] md:leading-[30px] mb-4">{para}</p>
                ))}
                {game.report.pullQuote && (
                  <blockquote className="mt-6 pl-4 text-[20px] leading-8 font-heading font-bold uppercase" style={{ borderLeft: '3px solid var(--red)' }}>
                    „{game.report.pullQuote}"
                  </blockquote>
                )}
              </div>
            ) : (
              <p className="text-text-muted">{tf('kicker')}</p>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            {hasStats && (
              <div id="match-stats" className="rounded-card border border-line p-4 scroll-mt-32">
                <h3 className="font-heading font-bold uppercase text-[16px] mb-4">{tt('stats')}</h3>
                <StatBars stats={game.stats!} />
              </div>
            )}
            <KeyValuePanel title={ti('spielinfo')} rows={infoRows} />
            <ConsentPlaceholder venue={game.venue} />
          </aside>
        </div>
      </section>

      {/* Lineup */}
      <section id="match-lineup" className="container-page mt-12 scroll-mt-32">
        <h2 className="font-heading font-bold uppercase text-[26px] md:text-[32px] mb-4">{t('lineupTitle')}</h2>
        <MatchRoster roster={game.roster} homeName={game.home.name} awayName={game.away.name} />
      </section>

      {/* Ticker (timeline) */}
      {hasEvents && (
        <section id="match-ticker" className="container-page mt-12 scroll-mt-32">
          <h2 className="font-heading font-bold uppercase text-[26px] md:text-[32px] mb-4">{tt('ticker')}</h2>
          <div className="rounded-card border border-line p-4 max-w-2xl">
            <MatchTimeline events={game.events!} />
          </div>
        </section>
      )}

      {/* Gallery */}
      <section id="match-gallery" className="container-page mt-12 scroll-mt-32">
        <h2 className="font-heading font-bold uppercase text-[26px] md:text-[32px] mb-4">{t('galleryTitle')}</h2>
        {game.gallery && game.gallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {game.gallery.slice(0, 8).map((img, i) => (
              <div key={i} className="relative">
                <ImageSlot image={img} />
                {i === 7 && game.gallery!.length > 8 && (
                  <div className="absolute inset-0 grid place-items-center rounded-card bg-black/60 font-heading font-bold text-[28px]">
                    +{game.gallery!.length - 8}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-dashed border-line p-10 text-center text-text-muted">
            {t('galleryEmpty')}
          </div>
        )}
      </section>

      {/* Next match CTA */}
      {nextMatch && nextMatch.slug !== game.slug && (
        <section className="container-page mt-16">
          <a href={routes.game(locale, nextMatch.slug)} className="block rounded-card border border-line bg-surface-raised p-6 text-center hover:bg-surface-card">
            <div className="text-[12px] uppercase tracking-[0.06em] text-text-muted">{t('nextMatchCta')}</div>
            <div className="mt-1 font-heading font-bold uppercase text-[24px]">{nextMatch.home.name} vs {nextMatch.away.name}</div>
            <div className="mt-1 text-[13px] text-text-muted tabular">{formatDateTime(nextMatch.kickoff, locale)}</div>
          </a>
        </section>
      )}
    </div>
  )
}
