import type { StatLine } from '@/lib/data/types'

/*
 * StatBars — label with two flex-weighted, two-tone bars (home yellow / away
 * line) meeting in the middle (handoff 4a). Values are tabular.
 */
export function StatBars({ stats }: { stats: StatLine[] }) {
  return (
    <div className="flex flex-col gap-4">
      {stats.map((s) => {
        const total = s.home + s.away || 1
        const homePct = (s.home / total) * 100
        return (
          <div key={s.label}>
            <div className="flex items-center justify-between text-[13px] mb-1">
              <span className="font-heading font-bold tabular">{s.home}</span>
              <span className="uppercase tracking-[0.04em] text-text-muted text-[12px]">{s.label}</span>
              <span className="font-heading font-bold tabular">{s.away}</span>
            </div>
            <div className="flex h-1.5 gap-0.5" role="img" aria-label={`${s.label}: ${s.home} zu ${s.away}`}>
              <div className="rounded-l-pill" style={{ width: `${homePct}%`, background: 'var(--yellow)' }} />
              <div className="flex-1 rounded-r-pill" style={{ background: 'var(--line)' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
