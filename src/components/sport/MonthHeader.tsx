import { cn } from '@/lib/cn'

/*
 * Sticky month header for the fixtures list. Sticks just under the site header
 * (top-16). Barlow Condensed 800, uppercase, with a bottom border (handoff 3a).
 */
export function MonthHeader({ label, count, className }: { label: string; count?: number; className?: string }) {
  return (
    <div
      className={cn(
        'sticky top-16 z-[2] flex items-baseline justify-between gap-3',
        'bg-surface border-b border-line px-4 py-2',
        className,
      )}
    >
      <h2 className="font-heading font-extrabold uppercase text-[20px] leading-6 md:text-[26px] md:leading-7 tracking-[0.02em]">
        {label}
      </h2>
      {count != null && <span className="text-[13px] text-text-muted tabular">{count}</span>}
    </div>
  )
}
