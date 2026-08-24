import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getFixtures, getNewsTeasers, getSquad, getTournaments, getTeams } from '@/lib/data'
import { deriveHeroState, parseHeroOverride } from '@/lib/heroState'
import { MatchdayHero } from '@/components/sport/MatchdayHero'
import { NewsCard } from '@/components/sport/NewsCard'
import { PlayerCard } from '@/components/sport/PlayerCard'
import { HeroMedia } from '@/components/sport/HeroMedia'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/format'
import { routes } from '@/lib/routes'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ hero?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { hero } = await searchParams
  const t = await getTranslations({ locale, namespace: 'screens.home' })
  const tt = await getTranslations({ locale, namespace: 'screens.tournament' })

  const [games, teams, news, squad, tournaments] = await Promise.all([
    getFixtures(),
    getTeams(),
    getNewsTeasers(4),
    getSquad('herren'),
    getTournaments(),
  ])

  const derived = deriveHeroState(games)
  const override = parseHeroOverride(hero)
  // For a preview override, pick a representative game for that state.
  const overrideGame =
    override === 'live' ? games.find((g) => g.status === 'live')
    : override === 'finished' ? [...games].reverse().find((g) => g.status === 'finished')
    : override === 'postponed' ? games.find((g) => g.status === 'postponed')
    : override === 'upcoming' ? games.find((g) => g.status === 'scheduled')
    : undefined
  const state = override ?? derived.state
  const heroGame = override ? overrideGame : derived.game

  const tournament = tournaments[0]

  return (
    <div className="pb-16">
      <MatchdayHero state={state} game={heroGame} locale={locale} />

      {/* News */}
      <section className="container-page py-12 md:py-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-heading font-bold uppercase text-[26px] md:text-[40px]">{t('newsTitle')}</h2>
          <a href={routes.news(locale)} className="text-[14px] font-semibold uppercase tracking-[0.04em] text-text-muted hover:text-text">{t('newsAll')} ›</a>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {news.map((item) => (
            <NewsCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
      </section>

      {/* Squad teaser */}
      <section className="py-12 md:py-16" style={{ background: 'var(--surface-raised)' }}>
        <div className="container-page">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold uppercase text-[26px] md:text-[40px]">{t('squadTitle')}</h2>
              <p className="text-text-muted mt-1">{t('squadBody')}</p>
            </div>
            <Button href={routes.team(locale, 'herren')} variant="secondary">{t('squadCta')}</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {squad.slice(0, 6).map((p) => (
              <PlayerCard key={p.id} player={p} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* Tournament teaser */}
      {tournament && (
        <section className="container-page py-12 md:py-16">
          <h2 className="font-heading font-bold uppercase text-[26px] md:text-[40px] mb-6">{t('tournamentTitle')}</h2>
          <HeroMedia
            image={tournament.hero}
            kicker={tournament.format}
            title={tournament.name}
            meta={`${formatDate(tournament.startDate, locale)} – ${formatDate(tournament.endDate, locale)} · ${tournament.venue.city}`}
          >
            <Button href={routes.tournament(locale, tournament.slug)}>{tt('schedule')}</Button>
          </HeroMedia>
        </section>
      )}

      {/* Stats */}
      <section className="py-12" style={{ background: 'var(--surface-raised)' }}>
        <div className="container-page">
          <h2 className="font-heading font-bold uppercase text-[26px] md:text-[40px] mb-6">{t('statsTitle')}</h2>
          <div className="grid grid-cols-3 gap-4">
            <Stat value={String(teams.length)} label={t('statTeams')} />
            <Stat value={String(squad.length)} label={t('statPlayers')} />
            <Stat value="2013" label={t('statFounded')} />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-page py-12 md:py-16">
        <div className="rounded-card border border-line p-8 md:p-10 text-center" style={{ borderLeft: '3px solid var(--red)' }}>
          <h2 className="font-heading font-bold uppercase text-[26px] md:text-[40px]">{t('newsletterTitle')}</h2>
          <p className="mt-3 text-text-muted max-w-xl mx-auto">{t('newsletterBody')}</p>
          <form action={routes.newsletter(locale)} method="post" className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              name="email"
              required
              placeholder={t('newsletterPlaceholder')}
              aria-label={t('newsletterPlaceholder')}
              className="flex-1 min-h-[44px] rounded-button border border-line bg-surface px-4 text-[15px] text-text placeholder:text-text-muted"
            />
            <button type="submit" className="min-h-[44px] rounded-button bg-red text-white px-5 font-semibold uppercase tracking-[0.04em] text-[15px]">
              {t('newsletterCta')}
            </button>
          </form>
          <p className="mt-3 text-[12px] text-text-muted">{t('newsletterNote')}</p>
        </div>
      </section>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-card border border-line bg-surface p-6 text-center">
      <div className="font-heading font-extrabold text-[40px] md:text-[64px] leading-none tabular text-red">{value}</div>
      <div className="mt-2 text-[13px] uppercase tracking-[0.06em] text-text-muted">{label}</div>
    </div>
  )
}
