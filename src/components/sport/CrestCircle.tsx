import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'

/*
 * Crest placeholder: a bordered circle with a 3-letter code, ringed in the team
 * accent (handoff — real marks replace these). Sizes: 72px scoreboard, 40px row.
 */
export function CrestCircle({
  code,
  accent,
  size = 72,
  className,
}: {
  code: string
  accent?: string
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-grid place-items-center rounded-pill bg-surface-card font-heading font-bold uppercase text-text',
        className,
      )}
      style={
        {
          width: size,
          height: size,
          border: `2px solid ${accent ?? 'var(--line)'}`,
          fontSize: Math.round(size / 3.2),
        } as CSSProperties
      }
      aria-hidden
    >
      {code}
    </span>
  )
}
