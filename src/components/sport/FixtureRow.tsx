import { getTranslations } from 'next-intl/server'
import type { CSSProperties } from 'react'
import type { Game } from '@/lib/data/types'
import type { Locale } from '@/i18n/routing'
import { Badge } from '@/components/ui/Badge'
import { StatusTag } from '@/components/ui/StatusTag'
import { displayStatus, scorePair } from '@/lib/gameDisplay'
import { dateBlock, formatTime } from '@/lib/format'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/cn'

const accentColor: Record<string, string> = {
  win: 'var(--status-win)',
  draw: 'var(--status-draw)',
  loss: 'var(--status-loss)',
  scheduled: 'var(--status-scheduled)',
  live: 'var(--status-live)',
  postponed: 'var(--status-postponed)',
  cancelled: 'var(--status-postponed)',
}

/*
 * FixtureRow — one game in the fixtures list. Desktop: a 6-column grid
 * (date · competition · teams+score · status · venue · chevron) with a 3px left
 * status accent; mobile: stacked with the score to the right. A live row gets
 * the highlighted background and a live pill (handoff 3a/3b).
 */
export async function FixtureRow({ game, locale }: { game: Game; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'sport' })
  const status = displayStatus(game)
  const score = scorePair(game)
  const isLive = game.status === 'live'
  const muted = game.status === 'postponed' || game.status === 'cancelled'
  const { day, mon, weekday } = dateBlock(game.kickoff, locale)
  const href = routes.game(locale, game.slug)

  const statusLabel =
    game.status === 'finished'
      ? t(`status.${status}`)
      : t(`status.${game.status}` as 'status.scheduled')

  const teamName = (name: string) =>
    cn('font-heading font-bold uppercase text-[20px] leading-6 lg:text-[26px] lg:leading-[30px]', muted && 'text-text-muted')

  return (
    <a
      href={href}
      className={cn(
        'group block border-b border-line',
        isLive ? 'bg-[color:var(--live-row-bg)]' : 'hover:bg-surface-raised',
      )}
      style={{ borderLeft: `3px solid ${accentColor[status]}` } as CSSProperties}
    >
      {/* Desktop grid */}
      <div className="hidden lg:grid items-center gap-4 px-4 py-3" style={{ gridTemplateColumns: '96px 150px 1fr 150px 220px 24px' }}>
        <div className="text-center">
          <div className="font-heading font-extrabold text-[26px] leading-none tabular">{day}</div>
          <div className="text-[11px] uppercase tracking-[0.06em] text-text-muted">{mon} · {weekday}</div>
        </div>
        <div><Badge kind="competition">{game.competition.name}</Badge></div>
        <div className="min-w-0 flex items-center gap-3">
          <span className={cn(teamName(game.home.name), 'truncate')}>{game.home.name}</span>
          <ScoreOrTime score={score} home muted={muted} time={formatTime(game.kickoff, locale)} scheduled={game.status === 'scheduled'} />
          <span className={cn(teamName(game.away.name), 'truncate')}>{game.away.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {isLive && <Badge kind="live">{t('scoreboard.minute', { min: game.liveMinute ?? 0 })}</Badge>}
          <StatusTag status={status} label={statusLabel} />
        </div>
        <div className="text-[13px] text-text-muted truncate">
          {game.venue.name}<span className="text-line"> · </span>{game.venue.city}
        </div>
        <div aria-hidden className="text-text-muted text-lg text-center group-hover:text-text">›</div>
      </div>

      {/* Mobile stacked */}
      <div className="lg:hidden px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Badge kind="competition">{game.competition.name}</Badge>
          <div className="flex items-center gap-2">
            {isLive && <Badge kind="live">{t('scoreboard.minute', { min: game.liveMinute ?? 0 })}</Badge>}
            <StatusTag status={status} label={statusLabel} />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="min-w-0 flex flex-col gap-1">
            <span className={cn(teamName(game.home.name), 'truncate')}>{game.home.name}</span>
            <span className={cn(teamName(game.away.name), 'truncate')}>{game.away.name}</span>
          </div>
          <div className="shrink-0 text-right">
            {score ? (
              <div className="font-heading font-extrabold text-[26px] leading-7 tabular">
                <div>{score.home}</div>
                <div>{score.away}</div>
              </div>
            ) : (
              <div className="font-heading font-bold text-[20px] tabular text-text-muted">
                {game.status === 'scheduled' ? formatTime(game.kickoff, locale) : '—'}
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 text-[12px] text-text-muted">
          {day}. {mon} · {game.venue.name}, {game.venue.city}
        </div>
      </div>
    </a>
  )
}

function ScoreOrTime({
  score,
  time,
  scheduled,
  muted,
}: {
  score: { home: number; away: number } | null
  home?: boolean
  time: string
  scheduled: boolean
  muted: boolean
}) {
  if (score) {
    return (
      <span className="shrink-0 font-heading font-extrabold text-[26px] leading-none tabular px-2">
        {score.home}<span className="text-text-muted">:</span>{score.away}
      </span>
    )
  }
  return (
    <span className={cn('shrink-0 font-heading font-bold text-[20px] tabular px-2', muted ? 'text-text-muted' : 'text-text')}>
      {scheduled ? time : '—'}
    </span>
  )
}
