import { cn } from '@/lib/cn'

export type KV = { label: string; value: React.ReactNode }

/*
 * KeyValuePanel — header + zebra rows (Steckbrief, Spielinfo, Vor Ort). Values
 * are tabular where numeric. Elevation is surface + 1px line, no shadow.
 */
export function KeyValuePanel({ title, rows, className }: { title: string; rows: KV[]; className?: string }) {
  return (
    <div className={cn('rounded-card border border-line overflow-hidden', className)}>
      <div className="bg-surface-card px-4 py-2.5 border-b border-line">
        <h3 className="font-heading font-bold uppercase text-[16px]">{title}</h3>
      </div>
      <dl className="divide-y divide-line">
        {rows.map((row, i) => (
          <div key={i} className={cn('flex items-center justify-between gap-4 px-4 py-2.5', i % 2 === 1 && 'bg-surface-raised')}>
            <dt className="text-[13px] uppercase tracking-[0.04em] text-text-muted">{row.label}</dt>
            <dd className="text-[15px] font-medium text-text tabular text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
