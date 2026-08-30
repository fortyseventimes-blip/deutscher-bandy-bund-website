import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'

/*
 * Oversized "ghost" jersey number sitting behind a portrait, or standing in for
 * a missing portrait over a cool radial glow (handoff: players without a portrait
 * are a first-class case). Decorative — hidden from assistive tech.
 */
export function GhostNumber({
  number,
  size = 150,
  glow = false,
  className,
}: {
  number: number
  size?: number
  glow?: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none select-none font-heading font-extrabold leading-none',
        className,
      )}
      style={
        {
          fontSize: size,
          color: 'var(--ghost-number)',
          fontVariantNumeric: 'tabular-nums',
          ...(glow
            ? {
                background:
                  'radial-gradient(circle at 50% 45%, var(--ghost-glow), transparent 60%)',
              }
            : {}),
        } as CSSProperties
      }
    >
      {number}
    </span>
  )
}
