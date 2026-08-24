import { getTranslations } from 'next-intl/server'
import type { CSSProperties } from 'react'
import type { Standings, StandingsRow } from '@/lib/data/types'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/cn'

const zoneColor = (zone?: StandingsRow['zone']) =>
  zone === 'qualify' ? 'var(--status-win)' : zone === 'relegate' ? 'var(--status-postponed)' : 'transparent'

function diffProps(row: StandingsRow): { text: string; color: string } {
  const diff = row.goalsFor - row.goalsAgainst
  const color = diff > 0 ? 'var(--status-win)' : diff < 0 ? 'var(--status-loss)' : 'var(--text-muted)'
  return { text: diff > 0 ? `+${diff}` : String(diff), color }
}

/*
 * StandingsTable — full (desktop) + compact (mobile). Germany's row is
 * highlighted with a gold text tint on the live-row background; a 3px zone bar
 * left of the position marks qualification (green) or relegation (yellow); goal
 * difference is coloured. Renders a pre-season all-zeros variant with a note
 * (handoff 3a/3c). Proper <th scope> for accessibility.
 */
export async function StandingsTable({ standings, locale }: { standings: Standings; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'screens.fixtures' })

  return (
    <div>
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto rounded-card border border-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-card text-text-muted">
              <Th className="w-16 text-center">{t('th.rank')}</Th>
              <Th>{t('th.team')}</Th>
              <Th className="w-[72px] text-center">{t('th.played')}</Th>
              <Th className="w-[72px] text-center">{t('th.win')}</Th>
              <Th className="w-[72px] text-center">{t('th.draw')}</Th>
              <Th className="w-[72px] text-center">{t('th.loss')}</Th>
              <Th className="w-[120px] text-center">{t('th.goals')}</Th>
              <Th className="w-24 text-center">{t('th.diff')}</Th>
              <Th className="w-[88px] text-center">{t('th.points')}</Th>
            </tr>
          </thead>
          <tbody>
            {standings.rows.map((row) => {
              const diff = diffProps(row)
              return (
                <tr
                  key={row.rank}
                  className="border-t border-line"
                  style={row.isGermany ? ({ background: 'var(--live-row-bg)' } as CSSProperties) : undefined}
                >
                  <td className="relative text-center tabular py-2.5">
                    <span
                      aria-hidden
                      className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r"
                      style={{ background: zoneColor(row.zone) }}
                    />
                    <span className={cn('font-heading font-bold', row.isGermany && 'text-yellow')}>{row.rank}</span>
                  </td>
                  <th scope="row" className="py-2.5 pr-2 font-heading font-bold uppercase text-[16px]">
                    <span className={cn(row.isGermany && 'text-yellow')}>{row.teamName}</span>
                  </th>
                  <Td>{row.played}</Td>
                  <Td>{row.win}</Td>
                  <Td>{row.draw}</Td>
                  <Td>{row.loss}</Td>
                  <Td>{row.goalsFor}:{row.goalsAgainst}</Td>
                  <td className="text-center tabular font-semibold" style={{ color: diff.color }}>{diff.text}</td>
                  <td className="text-center tabular font-heading font-extrabold text-[18px]">{row.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile compact */}
      <div className="md:hidden rounded-card border border-line overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-card text-text-muted">
              <Th className="w-[34px] text-center">{t('th.rank')}</Th>
              <Th>{t('th.team')}</Th>
              <Th className="w-10 text-center">{t('th.played')}</Th>
              <Th className="w-14 text-center">{t('th.diff')}</Th>
              <Th className="w-12 text-center">{t('th.points')}</Th>
            </tr>
          </thead>
          <tbody>
            {standings.rows.map((row) => {
              const diff = diffProps(row)
              return (
                <tr key={row.rank} className="border-t border-line" style={row.isGermany ? ({ background: 'var(--live-row-bg)' } as CSSProperties) : undefined}>
                  <td className="relative text-center tabular py-2">
                    <span aria-hidden className="absolute left-0 top-1 bottom-1 w-[3px]" style={{ background: zoneColor(row.zone) }} />
                    <span className={cn('font-heading font-bold', row.isGermany && 'text-yellow')}>{row.rank}</span>
                  </td>
                  <th scope="row" className={cn('py-2 pr-2 font-heading font-bold uppercase text-[14px]', row.isGermany && 'text-yellow')}>{row.teamName}</th>
                  <Td>{row.played}</Td>
                  <td className="text-center tabular font-semibold" style={{ color: diff.color }}>{diff.text}</td>
                  <td className="text-center tabular font-heading font-extrabold">{row.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Legend / note */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-text-muted">
        <LegendDot color="var(--status-win)" label={t('zoneQualify')} />
        <LegendDot color="var(--status-postponed)" label={t('zoneRelegate')} />
      </div>
      {standings.preseason && (
        <p className="mt-2 text-[13px] text-text-muted">{standings.note ?? t('preseasonNote')}</p>
      )}
    </div>
  )
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th scope="col" className={cn('px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em]', className)}>
      {children}
    </th>
  )
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="text-center tabular py-2.5">{children}</td>
}
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block h-2.5 w-1 rounded" style={{ background: color }} aria-hidden />
      {label}
    </span>
  )
}
