import { cn } from '@/lib/cn'

/*
 * Federation wordmark — placeholder per the handoff: a `DBB` monogram in a
 * bordered circle with a red dot, next to the name. Replace the circle with the
 * real mark when supplied. The ring uses the ice accent.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden
        className="relative grid place-items-center h-9 w-9 rounded-pill border border-accent-ice font-heading font-bold text-[13px] text-text"
      >
        DBB
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-pill bg-red" />
      </span>
      <span className="font-heading font-bold uppercase tracking-[-0.01em] text-[20px] leading-none text-text">
        Bandy-Bund
      </span>
    </span>
  )
}
