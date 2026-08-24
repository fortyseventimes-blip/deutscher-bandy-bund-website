import { getTranslations } from 'next-intl/server'
import type { Team } from '@/lib/data/types'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/cn'

export type FixturesQuery = { team?: string; competition?: string; direction?: string }

/*
 * Fixtures filter block (handoff 3a). Chips are LINKS that set the URL query, so
 * a filtered view is linkable and the whole thing works without JavaScript — the
 * server reads searchParams and filters. Active chip = red fill.
 */
function href(base: string, current: FixturesQuery, patch: Partial<FixturesQuery>): string {
  const merged = { ...current, ...patch }
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(merged)) if (v) sp.set(k, v)
  const qs = sp.toString()
  return qs ? `${base}?${qs}` : base
}

function ChipLink({ label, active, to }: { label: string; active: boolean; to: string }) {
  return (
    <a
      href={to}
      className={cn(
        'inline-flex items-center rounded-pill border px-3.5 min-h-[36px] text-[13px] font-semibold uppercase tracking-[0.04em] transition-colors',
        active ? 'bg-red text-white border-red' : 'text-text-muted border-line hover:text-text hover:border-text-muted',
      )}
    >
      {label}
    </a>
  )
}

export async function FixturesFilter({
  base,
  current,
  teams,
  competitions,
  icalHref,
  locale,
}: {
  base: string
  current: FixturesQuery
  teams: Team[]
  competitions: string[]
  icalHref: string
  locale: Locale
}) {
  const t = await getTranslations({ locale, namespace: 'screens.fixtures' })

  return (
    <div className="flex flex-col gap-4">
      {/* Team chips */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
        <ChipLink label={t('allTeams')} active={!current.team} to={href(base, current, { team: undefined })} />
        {teams.map((team) => (
          <ChipLink key={team.slug} label={team.name} active={current.team === team.slug} to={href(base, current, { team: team.slug })} />
        ))}
      </div>

      {/* Competition + direction + iCal */}
      <div className="flex flex-wrap items-center gap-2">
        <ChipLink label={t('allCompetitions')} active={!current.competition} to={href(base, current, { competition: undefined })} />
        {competitions.map((c) => (
          <ChipLink key={c} label={c} active={current.competition === c} to={href(base, current, { competition: c })} />
        ))}
        <span className="mx-1 h-6 w-px bg-line" aria-hidden />
        <ChipLink label={t('onlyResults')} active={current.direction === 'past'} to={href(base, current, { direction: current.direction === 'past' ? undefined : 'past' })} />
        <ChipLink label={t('onlyUpcoming')} active={current.direction === 'upcoming'} to={href(base, current, { direction: current.direction === 'upcoming' ? undefined : 'upcoming' })} />
        <a
          href={icalHref}
          className="ml-auto inline-flex items-center gap-2 rounded-button border border-line px-3 min-h-[36px] text-[13px] font-semibold uppercase tracking-[0.04em] text-text-muted hover:text-text hover:bg-surface-card"
        >
          <span aria-hidden>↓</span> {t('subscribeIcal')}
        </a>
      </div>
    </div>
  )
}
