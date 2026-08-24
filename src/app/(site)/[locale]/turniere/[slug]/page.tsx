import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { Game } from '@/lib/data/types'
import { getTournament } from '@/lib/data'
import { HeroMedia } from '@/components/sport/HeroMedia'
import { CrestCircle } from '@/components/sport/CrestCircle'
import { KeyValuePanel } from '@/components/sport/KeyValuePanel'
import { ConsentPlaceholder } from '@/components/sport/ConsentPlaceholder'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { formatDate, formatTime } from '@/lib/format'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/cn'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const trn = await getTournament(slug)
  return { title: trn?.name ?? 'Turnier' }
}

export default async function TournamentPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const trn = await getTournament(slug)
  if (!trn) notFound()

  const t = await getTranslations({ locale, namespace: 'screens.tournament' })
  const ti = await getTranslations({ locale, namespace: 'sport.info' })

  return (
    <div className="pb-16">
      <div className="container-page pt-6">
        <Breadcrumbs items={[{ label: 'Home', href: routes.home(locale) }, { label: t('backToTournaments'), href: routes.tournaments(locale) }, { label: trn.name }]} />
      </div>

      {/* Media hero */}
      <div className="container-page mt-4">
        <HeroMedia
          image={trn.hero}
          kicker={trn.format}
          title={trn.name}
          meta={`${formatDate(trn.startDate, locale)} – ${formatDate(trn.endDate, locale)} · ${trn.venue.name}, ${trn.venue.city}`}
        />
      </div>

      <div className="container-page mt-10 grid lg:grid-cols-[1fr_340px] gap-8">
        {/* Schedule + format */}
        <div>
          <h2 className="font-heading font-bold uppercase text-[26px] md:text-[40px] mb-4">{t('schedule')}</h2>
          <div className="flex flex-col gap-6">
            {trn.days.map((day) => (
              <div key={day.label}>
                <div className="sticky top-16 z-[2] bg-surface border-b border-line py-2">
                  <h3 className="font-heading font-extrabold uppercase text-[20px] md:text-[26px]">{day.label}</h3>
                </div>
                <div className="rounded-card border border-line overflow-hidden mt-2">
                  {day.games.map((game) => (
                    <ScheduleRow key={game.id} game={game} locale={locale} openLabel={t('openParticipant')} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Format explainer */}
          {trn.rules && trn.rules.length > 0 && (
            <div className="mt-10">
              <h2 className="font-heading font-bold uppercase text-[26px] md:text-[32px] mb-4">{t('format')}</h2>
              <div className="flex flex-wrap gap-2">
                {trn.rules.map((rule) => (
                  <span key={rule} className="rounded-pill border border-line px-3 py-1.5 text-[13px] text-text-muted">{rule}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: participants, on-site, weather */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-card border border-line overflow-hidden">
            <div className="bg-surface-card px-4 py-2.5 border-b border-line">
              <h3 className="font-heading font-bold uppercase text-[16px]">{t('participants')}</h3>
            </div>
            <ul className="divide-y divide-line">
              {trn.participants.map((p, i) => (
                <li key={i} className={cn('flex items-center justify-between gap-3 px-4 py-2.5', p.host && 'bg-[color:var(--live-row-bg)]')}>
                  <span className="font-medium">{p.name}</span>
                  {p.host && <span className="text-[11px] uppercase tracking-[0.04em] text-yellow font-semibold">{t('host')}</span>}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold uppercase text-[16px] mb-3">{t('onSite')}</h3>
            <ConsentPlaceholder venue={trn.venue} />
          </div>

          {trn.weatherNote && (
            <div className="rounded-card border border-line p-4" style={{ borderLeft: '3px solid var(--yellow)' }}>
              <p className="text-[12px] uppercase tracking-[0.06em] font-semibold" style={{ color: 'var(--label-yellow-text)' }}>{t('weather')}</p>
              <p className="mt-1 text-[14px] text-text-muted">{trn.weatherNote}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function ScheduleRow({ game, locale, openLabel }: { game: Game; locale: Locale; openLabel: string }) {
  const open = game.round === 'Teilnehmer offen'
  return (
    <div className="grid items-center gap-3 px-4 py-3 border-b border-line last:border-0" style={{ gridTemplateColumns: '64px 1fr auto' }}>
      <div className="text-[13px] text-text-muted tabular">{formatTime(game.kickoff, locale)}</div>
      <div className="min-w-0 flex items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <CrestCircle code={game.home.crestCode} accent={game.home.accent} size={28} />
          <span className={cn('font-heading font-bold uppercase text-[16px] truncate', open && 'text-text-muted')}>{game.home.name}</span>
        </div>
        <span className="text-text-muted text-[13px]">–</span>
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn('font-heading font-bold uppercase text-[16px] truncate', open && 'text-text-muted')}>{game.away.name}</span>
          <CrestCircle code={game.away.crestCode} accent={game.away.accent} size={28} />
        </div>
      </div>
      <div className="text-right">
        {open ? (
          <span className="rounded-tag border border-yellow px-2 py-0.5 text-[11px] uppercase tracking-[0.04em] text-yellow">{openLabel}</span>
        ) : (
          <span className="text-[12px] text-text-muted">{game.competition.name}</span>
        )}
      </div>
    </div>
  )
}
