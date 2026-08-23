import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'

export type MatchStatus =
  | 'win'
  | 'draw'
  | 'loss'
  | 'scheduled'
  | 'live'
  | 'postponed'

/*
 * StatusTag — the shared status vocabulary for fixture rows, timelines and
 * tables (handoff "Status color mapping"). The label text is ALWAYS present so
 * status is readable without colour (accessibility requirement). Colour comes
 * from the --status-* tokens, which the light theme darkens for contrast.
 */
const statusVar: Record<MatchStatus, string> = {
  win: 'var(--status-win)',
  draw: 'var(--status-draw)',
  loss: 'var(--status-loss)',
  scheduled: 'var(--status-scheduled)',
  live: 'var(--status-live)',
  postponed: 'var(--status-postponed)',
}

export function StatusTag({
  status,
  label,
  className,
}: {
  status: MatchStatus
  label: string
  className?: string
}) {
  const color = statusVar[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-body font-semibold uppercase',
        'tracking-[0.04em] text-[13px] leading-4',
        className,
      )}
      style={{ color } as CSSProperties}
    >
      <span
        aria-hidden
        className={cn('inline-block h-2 w-2 rounded-pill', status === 'live' && 'animate-pulse')}
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  )
}
