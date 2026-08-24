'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { CSSProperties } from 'react'
import type { MatchRoster as MatchRosterType, TeamRoster, RosterEntry, Position, EventTag } from '@/lib/data/types'
import { cn } from '@/lib/cn'

const POSITION_ORDER: Position[] = ['TW', 'VER', 'MF', 'ST']
const tagColor: Record<EventTag, string> = {
  goal: 'var(--status-win)',
  assist: 'var(--accent-ice)',
  penalty: 'var(--yellow)',
}

/*
 * MatchRoster — two team panels side by side (desktop) or a segmented switcher
 * over a single panel (mobile). Each panel: 3px top accent (gold home, ice
 * away), header (name, coach, formation), position groups, player rows with the
 * captain mark and event tags; bench as one line. Renders the "line-up not yet
 * submitted" empty state when absent (handoff 4a/4c).
 */
export function MatchRoster({
  roster,
  homeName,
  awayName,
}: {
  roster?: MatchRosterType
  homeName: string
  awayName: string
}) {
  const t = useTranslations('sport')
  const [side, setSide] = useState<'home' | 'away'>('home')

  if (!roster || !roster.submitted) {
    return (
      <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center">
        <p className="font-heading font-bold uppercase text-[20px]">{t('roster.notSubmitted')}</p>
        <p className="mt-2 text-[14px] text-text-muted">{t('roster.notSubmittedHint')}</p>
      </div>
    )
  }

  return (
    <div>
      <Legend />
      {/* Desktop: two panels */}
      <div className="hidden md:grid grid-cols-2 gap-6 mt-4">
        {roster.home && <Panel team={roster.home} name={homeName} accent="var(--yellow)" />}
        {roster.away && <Panel team={roster.away} name={awayName} accent="var(--accent-ice)" />}
      </div>

      {/* Mobile: switcher + one panel */}
      <div className="md:hidden mt-4">
        <div className="grid grid-cols-2 rounded-button border border-line overflow-hidden mb-4">
          {(['home', 'away'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className={cn(
                'min-h-[44px] font-heading font-bold uppercase text-[15px]',
                side === s ? 'bg-surface-card text-text' : 'text-text-muted',
              )}
            >
              {s === 'home' ? homeName : awayName}
            </button>
          ))}
        </div>
        {side === 'home' && roster.home && <Panel team={roster.home} name={homeName} accent="var(--yellow)" />}
        {side === 'away' && roster.away && <Panel team={roster.away} name={awayName} accent="var(--accent-ice)" />}
      </div>
    </div>
  )
}

function Legend() {
  const t = useTranslations('sport')
  return (
    <div className="flex flex-wrap items-center gap-4 text-[12px] text-text-muted">
      {(['goal', 'assist', 'penalty'] as EventTag[]).map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: tagColor[tag] }} aria-hidden />
          {t(`event.${tag}`)}
        </span>
      ))}
    </div>
  )
}

function Panel({ team, name, accent }: { team: TeamRoster; name: string; accent: string }) {
  const t = useTranslations('sport')
  const groups = POSITION_ORDER.map((pos) => ({
    pos,
    players: team.players.filter((p) => p.position === pos),
  })).filter((g) => g.players.length > 0)

  return (
    <div className="rounded-card border border-line overflow-hidden" style={{ borderTop: `3px solid ${accent}`, borderRadius: '0 0 12px 12px' } as CSSProperties}>
      <div className="px-4 py-3 border-b border-line">
        <h3 className="font-heading font-bold uppercase text-[20px]">{name}</h3>
        <p className="text-[13px] text-text-muted">
          {team.coach && <>{t('roster.coach')}: {team.coach}</>}
          {team.coach && team.formation && <span className="text-line"> · </span>}
          {team.formation && <>{t('roster.formation')}: {team.formation}</>}
        </p>
      </div>
      {groups.map((g) => (
        <div key={g.pos}>
          <div className="bg-surface-raised px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            {t(`position.${g.pos}`)}
          </div>
          <ul>
            {g.players.map((p, i) => (
              <PlayerRow key={i} p={p} />
            ))}
          </ul>
        </div>
      ))}
      {team.bench.length > 0 && (
        <div className="px-4 py-3 border-t border-line text-[13px] text-text-muted">
          <span className="font-semibold uppercase tracking-[0.04em]">{t('roster.bench')}: </span>
          {team.bench.join(', ')}
        </div>
      )}
    </div>
  )
}

function PlayerRow({ p }: { p: RosterEntry }) {
  const t = useTranslations('sport')
  const hasTag = (p.events?.length ?? 0) > 0
  return (
    <li
      className={cn('grid items-center gap-3 px-4 py-2 border-b border-line last:border-0', hasTag && 'bg-surface-card')}
      style={{ gridTemplateColumns: '44px 1fr auto' } as CSSProperties}
    >
      <span className="font-heading font-bold tabular text-right text-red-light">{p.number}</span>
      <span className="min-w-0 truncate">
        <span className="text-text-muted">{p.firstName} </span>
        <span className="font-medium">{p.lastName}</span>
        {p.captain && <span className="ml-1.5 font-heading font-bold text-yellow">{t('event.captain')}</span>}
      </span>
      <span className="flex items-center gap-1">
        {p.events?.map((tag, i) => (
          <span
            key={i}
            className="px-1.5 py-0.5 rounded-tag text-[10px] font-semibold uppercase"
            style={{ background: tagColor[tag], color: '#0B0D0F' }}
          >
            {t(`event.${tag}`)}
          </span>
        ))}
      </span>
    </li>
  )
}
