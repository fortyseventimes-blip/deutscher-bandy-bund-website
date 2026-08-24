import { getTranslations } from 'next-intl/server'
import type { Player } from '@/lib/data/types'
import type { Locale } from '@/i18n/routing'
import { ImageSlot } from './ImageSlot'
import { GhostNumber } from './GhostNumber'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/cn'

/*
 * PlayerCard — 3:4 card with a huge ghost jersey number behind the cut-out
 * portrait; a player without a portrait is a first-class case, shown as the
 * number over a cool radial glow (handoff 2a/2b). Bottom bar: number (red),
 * first name (small grey), surname (condensed), position pill.
 */
export async function PlayerCard({ player, locale }: { player: Player; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'sport' })
  const href = routes.player(locale, player.slug)
  const hasPortrait = player.portrait !== null

  return (
    <a
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface-card"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <div className="absolute inset-0 grid place-items-center">
          <GhostNumber number={player.number} size={150} glow={!hasPortrait} />
        </div>
        {hasPortrait && (
          <div className="absolute inset-0 flex items-end justify-center">
            <ImageSlot image={player.portrait} rounded={false} className="h-full" />
          </div>
        )}
        {player.captain && (
          <span className="absolute top-2 right-2 grid place-items-center h-6 w-6 rounded-pill bg-yellow text-[#0B0D0F] font-heading font-bold text-[13px]">
            {t('event.captain')}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2 border-t border-line bg-surface p-3">
        <div className="min-w-0">
          <div className="font-heading font-extrabold text-[34px] leading-none text-red-light tabular">
            {player.number}
          </div>
          <div className="mt-1 text-[13px] text-text-muted truncate">{player.firstName}</div>
          <div className="font-heading font-bold uppercase text-[24px] leading-6 truncate">{player.lastName}</div>
        </div>
        <span className="shrink-0 rounded-pill border border-line px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-text-muted">
          {player.position}
        </span>
      </div>
    </a>
  )
}
