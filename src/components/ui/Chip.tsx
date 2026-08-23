import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ChipState = 'rest' | 'active' | 'secondary-active' | 'zero-results'

/*
 * Chip — filter toggle. States from Komponentenblatt 5b: rest, active
 * (red fill), secondary-active (ice outline), zero-results (yellow outline
 * with a `· 0` count). Optional trailing count suffix. Uppercase Inter 600.
 */
const base =
  'inline-flex items-center gap-1.5 rounded-pill font-body font-semibold uppercase ' +
  'tracking-[0.04em] text-[13px] leading-4 px-3.5 min-h-[36px] border transition-colors ' +
  'disabled:opacity-40 disabled:pointer-events-none'

const states: Record<ChipState, string> = {
  rest: 'bg-transparent text-text-muted border-line hover:text-text hover:border-text-muted',
  active: 'bg-red text-white border-red',
  'secondary-active': 'bg-surface-card text-accent-ice border-accent-ice',
  'zero-results': 'bg-transparent text-yellow border-yellow',
}

type Props = {
  state?: ChipState
  count?: number
  children: ReactNode
  className?: string
} & Omit<ComponentProps<'button'>, 'className' | 'children'>

export function Chip({ state = 'rest', count, children, className, ...rest }: Props) {
  return (
    <button className={cn(base, states[state], className)} {...rest}>
      <span>{children}</span>
      {count !== undefined && (
        <span aria-hidden className="opacity-70 tabular">
          · {count}
        </span>
      )}
    </button>
  )
}
