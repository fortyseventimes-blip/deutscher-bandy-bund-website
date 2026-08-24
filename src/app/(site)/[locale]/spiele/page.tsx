import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getFixtures, getTeams, getCompetitions, getStandings, getNextMatch } from '@/lib/data'
import { FixturesFilter } from '@/components/sport/FixturesFilter'
import { FixtureRow } from '@/components/sport/FixtureRow'
import { MonthHeader } from '@/components/sport/MonthHeader'
import { StandingsTable } from '@/components/sport/StandingsTable'
import { StatusTag } from '@/components/ui/StatusTag'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { monthGroup, formatDateTime } from '@/lib/format'
import { routes } from '@/lib/routes'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'screens.fixtures' })
  return { title: t('title') }
}

type Search = { team?: string; competition?: string; direction?: string }

export default async function FixturesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<Search>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const sp = await searchParams
  const t = await getTranslations({ locale, namespace: 'screens.fixtures' })
  const ts = await getTranslations({ locale, namespace: 'sport.status' })

  const [fixtures, teams, competitions, standings, nextMatch] = await Promise.all([
    getFixtures({ team: sp.team, competition: sp.competition, direction: sp.direction as 'upcoming' | 'past' | 'all' | undefined }),
    getTeams(),
    getCompetitions(),
    getStandings(),
    getNextMatch(),
  ])

  // Group by month for sticky headers.
  const groups: { key: string; label: string; games: typeof fixtures }[] = []
  for (const game of fixtures) {
    const { key, label } = monthGroup(game.kickoff, locale)
    let group = groups.find((g) => g.key === key)
    if (!group) {
      group = { key, label, games: [] }
      groups.push(group)
    }
    group.games.push(game)
  }

  const hasFilters = Boolean(sp.team || sp.competition || sp.direction)

  return (
    <div className="pb-16">
      {/* Hero + next-match callout */}
      <section className="border-b border-line" style={{ background: 'var(--surface-raised)' }}>
        <div className="container-page py-10 md:py-14">
          <Breadcrumbs items={[{ label: 'Home', href: routes.home(locale) }, { label: t('title') }]} className="mb-4" />
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="font-body font-semibold uppercase text-[13px] tracking-[0.08em]" style={{ color: 'var(--label-yellow-text)' }}>{t('kicker')}</p>
              <h1 className="mt-2 font-heading font-bold uppercase text-[32px] leading-9 md:text-[56px] md:leading-[60px]">{t('title')}</h1>
            </div>
            {nextMatch && (
              <a href={routes.game(locale, nextMatch.slug)} className="block rounded-card border border-line bg-surface p-4 lg:min-w-[320px]" style={{ borderLeft: '3px solid var(--red)' }}>
                <div className="text-[12px] uppercase tracking-[0.06em] text-text-muted">{t('nextMatch')}</div>
                <div className="mt-1 font-heading font-bold uppercase text-[20px] leading-6">{nextMatch.home.name} vs {nextMatch.away.name}</div>
                <div className="mt-1 text-[13px] text-text-muted tabular">{formatDateTime(nextMatch.kickoff, locale)}</div>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="container-page py-6">
        <FixturesFilter base={routes.fixtures(locale)} current={sp} teams={teams} competitions={competitions} icalHref="/spiele.ics" locale={locale} />
      </div>

      {/* Fixture list grouped by month */}
      <div className="container-page">
        {fixtures.length === 0 ? (
          <ZeroResults title={t('noResultsTitle')} body={t('noResultsBody')} resetLabel={t('reset')} resetHref={routes.fixtures(locale)} />
        ) : (
          <div className="rounded-card border border-line overflow-hidden">
            {groups.map((group) => (
              <div key={group.key}>
                <MonthHeader label={group.label} count={group.games.length} />
                <div>
                  {group.games.map((game) => (
                    <FixtureRow key={game.id} game={game} locale={locale} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {(['win', 'draw', 'loss', 'scheduled', 'live', 'postponed'] as const).map((s) => (
            <StatusTag key={s} status={s} label={ts(s)} />
          ))}
        </div>
      </div>

      {/* Standings */}
      {standings && (
        <div className="container-page mt-12">
          <h2 className="font-heading font-bold uppercase text-[26px] md:text-[40px] mb-4">{t('standingsTitle')}</h2>
          <p className="text-[13px] text-text-muted mb-3">{standings.competition}</p>
          <StandingsTable standings={standings} locale={locale} />
        </div>
      )}
    </div>
  )
}

function ZeroResults({ title, body, resetLabel, resetHref }: { title: string; body: string; resetLabel: string; resetHref: string }) {
  return (
    <div className="rounded-card border border-dashed border-line p-10 text-center">
      <h2 className="font-heading font-bold uppercase text-[24px]">{title}</h2>
      <p className="mt-2 text-text-muted">{body}</p>
      <div className="mt-5 flex justify-center">
        <Button href={resetHref} variant="secondary">{resetLabel}</Button>
      </div>
    </div>
  )
}
