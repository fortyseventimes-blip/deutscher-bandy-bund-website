import type { CSSProperties } from 'react'
import type { TimelineEvent } from '@/lib/data/types'
import { cn } from '@/lib/cn'

const markerColor = (e: TimelineEvent) =>
  e.type === 'goal' ? 'var(--status-win)' : e.type === 'penalty' ? 'var(--status-postponed)' : 'var(--accent-ice)'

/*
 * MatchTimeline — minute · square marker · title + running score + detail
 * (handoff 4a grid 64px 20px 1fr). Running score is tabular; the marker colour
 * encodes the event type (goal green, penalty yellow, info ice).
 */
export function MatchTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="flex flex-col">
      {events.map((e, i) => (
        <li key={i} className="grid gap-3 py-3 border-b border-line last:border-0" style={{ gridTemplateColumns: '48px 20px 1fr' } as CSSProperties}>
          <div className="font-heading font-bold tabular text-text-muted text-right">{e.minute}'</div>
          <div className="flex justify-center pt-1">
            <span className={cn('inline-block h-3 w-3 rounded-[3px]')} style={{ background: markerColor(e) }} aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-bold uppercase text-[16px]">{e.title}</span>
              {e.running && (
                <span className="font-heading font-extrabold tabular text-[16px]">
                  {e.running.home}:{e.running.away}
                </span>
              )}
            </div>
            {e.detail && <div className="text-[14px] text-text-muted">{e.detail}</div>}
          </div>
        </li>
      ))}
    </ol>
  )
}
