import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type BadgeKind = 'competition' | 'number' | 'role' | 'live'

/*
 * Badge — small uppercase label (Komponentenblatt 5b). Kinds:
 *  competition (ice), number (red), role (gold), live (red + pulsing dot).
 * The live dot is suppressed under prefers-reduced-motion via the base rules.
 */
const base =
  'inline-flex items-center gap-1.5 rounded-tag font-body font-semibold uppercase ' +
  'tracking-[0.06em] text-[11px] leading-[14px] px-2 py-1'

const kinds: Record<BadgeKind, string> = {
  competition: 'bg-surface-card text-accent-ice',
  number: 'bg-transparent text-red-light',
  role: 'bg-transparent text-yellow',
  live: 'bg-red text-white',
}

export function Badge({
  kind = 'competition',
  children,
  className,
}: {
  kind?: BadgeKind
  children: ReactNode
  className?: string
}) {
  return (
    <span className={cn(base, kinds[kind], className)}>
      {kind === 'live' && (
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-pill bg-white animate-pulse"
        />
      )}
      {children}
    </span>
  )
}
