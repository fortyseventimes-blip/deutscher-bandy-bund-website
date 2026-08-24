import { getTranslations } from 'next-intl/server'
import type { Team, Position } from '@/lib/data/types'
import type { Locale } from '@/i18n/routing'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/cn'

const POSITIONS: (Position | 'ALL')[] = ['ALL', 'TW', 'VER', 'MF', 'ST']

/*
 * Squad filter (handoff 2a). Team-switch chips (links to each squad), position
 * filter chips with counts (links setting ?position=), and a name/number search
 * as a GET form — all functional without JavaScript. A zero-count active filter
 * is shown by the page's zero-results panel.
 */
export async function SquadFilter({
  teams,
  activeTeam,
  activePosition,
  query,
  counts,
  locale,
}: {
  teams: Team[]
  activeTeam: string
  activePosition: Position | 'ALL'
  query: string
  counts: Record<string, number>
  locale: Locale
}) {
  const t = await getTranslations({ locale, namespace: 'screens.teams' })
  const tp = await getTranslations({ locale, namespace: 'sport.position' })
  const base = routes.team(locale, activeTeam)

  const posHref = (pos: Position | 'ALL') => {
    const sp = new URLSearchParams()
    if (pos !== 'ALL') sp.set('position', pos)
    if (query) sp.set('q', query)
    const qs = sp.toString()
    return qs ? `${base}?${qs}` : base
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Team switch */}
      <div className="flex flex-wrap gap-2 overflow-x-auto">
        {teams.map((team) => (
          <a
            key={team.slug}
            href={routes.team(locale, team.slug)}
            className={cn(
              'inline-flex items-center rounded-pill border px-3.5 min-h-[36px] text-[13px] font-semibold uppercase tracking-[0.04em]',
              team.slug === activeTeam ? 'bg-red text-white border-red' : 'text-text-muted border-line hover:text-text',
            )}
          >
            {team.name}
          </a>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Position chips with counts */}
        {POSITIONS.map((pos) => {
          const count = counts[pos] ?? 0
          const active = activePosition === pos
          const zero = active && count === 0
          return (
            <a
              key={pos}
              href={posHref(pos)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-pill border px-3.5 min-h-[36px] text-[13px] font-semibold uppercase tracking-[0.04em]',
                zero
                  ? 'text-yellow border-yellow'
                  : active
                    ? 'bg-red text-white border-red'
                    : 'text-text-muted border-line hover:text-text',
              )}
            >
              {pos === 'ALL' ? tp('all') : tp(pos)}
              <span className="opacity-70 tabular">· {count}</span>
            </a>
          )
        })}

        {/* Search (GET form, no JS needed) */}
        <form action={base} method="get" className="ml-auto flex items-center gap-2">
          {activePosition !== 'ALL' && <input type="hidden" name="position" value={activePosition} />}
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="min-h-[40px] rounded-button border border-line bg-surface px-3 text-[14px] text-text placeholder:text-text-muted"
          />
        </form>
      </div>

      <p className="text-[12px] text-text-muted">{t('sortNote')}</p>
    </div>
  )
}
