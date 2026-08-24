import { getTranslations } from 'next-intl/server'
import type { CSSProperties } from 'react'
import type { Game } from '@/lib/data/types'
import type { Locale } from '@/i18n/routing'
import { CrestCircle } from './CrestCircle'
import { Badge } from '@/components/ui/Badge'
import { scorePair, daysUntil } from '@/lib/gameDisplay'
import { formatTime, formatDate } from '@/lib/format'
import { cn } from '@/lib/cn'

/*
 * Scoreboard band (handoff 4a/4c). Surface-raised with a red radial glow from
 * the top; three columns: home (right-aligned) · score · away, each side a 72px
 * crest placeholder. States: result / live (red top accent + live pill) /
 * preview (kick-off time + "Anpfiff in N Tagen") / postponed (grey names, "—").
 */
export async function Scoreboard({ game, locale }: { game: Game; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'sport' })
  const score = scorePair(game)
  const isLive = game.status === 'live'
  const muted = game.status === 'postponed' || game.status === 'cancelled'

  const statusLine =
    game.status === 'finished'
      ? t('scoreboard.endstand')
      : isLive
        ? t('scoreboard.minute', { min: game.liveMinute ?? 0 })
        : game.status === 'scheduled'
          ? t('scoreboard.kickoffLocal')
          : game.status === 'postponed'
            ? `${t('scoreboard.postponedTo')}: ${game.postponedTo ? formatDate(game.postponedTo, locale) : '—'}`
            : t('scoreboard.cancelled')

  return (
    <section
      className="relative overflow-hidden rounded-card border border-line"
      style={{ background: 'var(--surface-raised)' } as CSSProperties}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{ background: 'radial-gradient(60% 100% at 50% 0%, rgba(221,0,0,0.20), transparent 70%)' }}
      />
      {isLive && <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-red" />}

      <div className="relative px-4 py-8 md:py-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Badge kind="competition">{game.competition.name}</Badge>
          {game.round && <span className="text-[12px] text-text-muted">{game.round}</span>}
        </div>

        <div className="grid grid-cols-3 items-center gap-3 md:gap-6 max-w-3xl mx-auto">
          <SideCol name={game.home.name} code={game.home.crestCode} accent={game.home.accent} align="right" muted={muted} />

          <div className="flex flex-col items-center">
            {isLive && <Badge kind="live" className="mb-2">Live</Badge>}
            {score ? (
              <div className="font-heading font-extrabold leading-none tabular text-[44px] md:text-[88px]">
                {score.home}<span className="text-text-muted px-1 md:px-2">:</span>{score.away}
              </div>
            ) : (
              <div className={cn('font-heading font-extrabold leading-none tabular text-[36px] md:text-[64px]', muted && 'text-text-muted')}>
                {game.status === 'scheduled' ? formatTime(game.kickoff, locale) : '—'}
              </div>
            )}
            <div className="mt-2 text-[13px] uppercase tracking-[0.04em] text-text-muted text-center">{statusLine}</div>
            {game.halftime && (score || isLive) && (
              <div className="mt-1 text-[12px] text-text-muted tabular">
                ({t('scoreboard.halftime')} {game.halftime.home}:{game.halftime.away})
              </div>
            )}
            {game.status === 'scheduled' && (
              <div className="mt-1 text-[12px] text-accent-ice tabular">
                {t('scoreboard.kickoffIn', { days: daysUntil(game.kickoff) })}
              </div>
            )}
          </div>

          <SideCol name={game.away.name} code={game.away.crestCode} accent={game.away.accent} align="left" muted={muted} />
        </div>
      </div>
    </section>
  )
}

function SideCol({
  name,
  code,
  accent,
  align,
  muted,
}: {
  name: string
  code: string
  accent?: string
  align: 'left' | 'right'
  muted: boolean
}) {
  return (
    <div className={cn('flex flex-col items-center gap-3 md:flex-row', align === 'right' ? 'md:flex-row-reverse md:text-right' : 'md:text-left')}>
      <CrestCircle code={code} accent={accent} size={56} className="md:!w-[72px] md:!h-[72px]" />
      <span className={cn('font-heading font-bold uppercase text-[18px] md:text-[26px] leading-tight text-center', muted && 'text-text-muted')}>
        {name}
      </span>
    </div>
  )
}
