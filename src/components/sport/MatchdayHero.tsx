import { getTranslations } from 'next-intl/server'
import type { CSSProperties } from 'react'
import type { Game, HeroState } from '@/lib/data/types'
import type { Locale } from '@/i18n/routing'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CrestCircle } from './CrestCircle'
import { Countdown } from './Countdown'
import { scorePair } from '@/lib/gameDisplay'
import { formatDateTime, formatDate } from '@/lib/format'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/cn'

const accentByState: Record<HeroState, string> = {
  upcoming: 'var(--red)',
  live: 'var(--red)',
  finished: 'var(--status-win)',
  postponed: 'var(--status-postponed)',
  'summer-break': 'var(--accent-ice)',
}

/*
 * MatchdayHero — the home marquee, driven by the derived hero state (handoff
 * "Hero state machine"): upcoming (countdown) · live (score + minute) · finished
 * (result) · postponed · summer-break. The left accent colour and CTA set change
 * per state. Countdown degrades to a plain date without JavaScript.
 */
export async function MatchdayHero({
  state,
  game,
  locale,
}: {
  state: HeroState
  game?: Game
  locale: Locale
}) {
  const t = await getTranslations({ locale, namespace: 'sport' })
  const th = await getTranslations({ locale, namespace: 'screens.home' })
  const tf = await getTranslations({ locale, namespace: 'screens.fixtures' })
  const accent = accentByState[state]
  const score = game ? scorePair(game) : null

  const kicker =
    state === 'live' ? t('status.live')
    : state === 'finished' ? t('scoreboard.endstand')
    : state === 'postponed' ? t('status.postponed')
    : state === 'summer-break' ? tf('kicker')
    : tf('nextMatch')

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'var(--surface-raised)', borderLeft: `3px solid ${accent}` } as CSSProperties}
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-48 pointer-events-none" style={{ background: `radial-gradient(60% 100% at 50% 0%, ${accent}22, transparent 70%)` }} />
      <div className="container-page relative py-12 md:py-20">
        <div className="flex items-center gap-3">
          <span className="font-body font-semibold uppercase text-[13px] tracking-[0.08em]" style={{ color: state === 'summer-break' ? 'var(--accent-ice)' : 'var(--label-yellow-text)' }}>
            {kicker}
          </span>
          {state === 'live' && game && <Badge kind="live">{t('scoreboard.minute', { min: game.liveMinute ?? 0 })}</Badge>}
        </div>

        {state === 'summer-break' || !game ? (
          <div className="mt-4 max-w-2xl">
            <h1 className="font-heading font-bold uppercase text-[32px] leading-9 md:text-[56px] md:leading-[60px]">
              {th('squadTitle')}
            </h1>
            <p className="mt-4 text-text-muted text-[17px] leading-7 prose-measure">{th('squadBody')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={routes.fixtures(locale)}>{tf('title')}</Button>
              <Button href={routes.teams(locale)} variant="secondary">{th('squadCta')}</Button>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-2">
              <Badge kind="competition">{game.competition.name}</Badge>
              {game.round && <span className="text-[12px] text-text-muted">{game.round}</span>}
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-8">
              <TeamBlock name={game.home.name} code={game.home.crestCode} accent={game.home.accent} />
              <div className="flex flex-col items-center">
                {score ? (
                  <div className="font-heading font-extrabold leading-none tabular text-[44px] md:text-[72px]">
                    {score.home}<span className="text-text-muted px-2">:</span>{score.away}
                  </div>
                ) : (
                  <span className="font-heading font-bold uppercase text-[20px] text-text-muted">vs</span>
                )}
              </div>
              <TeamBlock name={game.away.name} code={game.away.crestCode} accent={game.away.accent} />
            </div>

            <div className="mt-6">
              {state === 'upcoming' && (
                <Countdown
                  targetIso={game.kickoff}
                  fallback={formatDateTime(game.kickoff, locale)}
                  labels={{ days: t('countdown.days'), hours: t('countdown.hours'), minutes: t('countdown.minutes'), seconds: t('countdown.seconds'), running: t('countdown.running') }}
                />
              )}
              {state === 'postponed' && (
                <p className="text-[15px] text-text-muted">
                  {t('scoreboard.postponedTo')}: <span className="text-text tabular">{game.postponedTo ? formatDate(game.postponedTo, locale) : '—'}</span>
                </p>
              )}
              <p className="mt-3 text-[14px] text-text-muted tabular">
                {formatDateTime(game.kickoff, locale)} · {game.venue.name}, {game.venue.city}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={routes.game(locale, game.slug)}>
                {state === 'finished' ? t('scoreboard.endstand') : state === 'live' ? t('status.live') : tf('nextMatch')}
              </Button>
              {game.ticketUrl && state === 'upcoming' && (
                <Button href={game.ticketUrl} variant="secondary">{th('newsletterCta')}</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function TeamBlock({ name, code, accent }: { name: string; code: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3">
      <CrestCircle code={code} accent={accent} size={56} />
      <span className={cn('font-heading font-bold uppercase text-[24px] md:text-[40px] leading-none')}>{name}</span>
    </div>
  )
}
