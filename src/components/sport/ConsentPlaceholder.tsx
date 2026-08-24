'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Venue } from '@/lib/data/types'

/*
 * Blocked map placeholder (handoff 6c / legal-compliance). Nothing third-party
 * loads before consent: the blocked state shows the address as text and an
 * external "open in maps app" link, plus a "Karte laden" button. Here loading
 * reveals a labelled placeholder (no real embed yet — the full consent engine
 * with per-service persistence is a later slice).
 */
export function ConsentPlaceholder({ venue }: { venue: Venue }) {
  const t = useTranslations('sport.consent')
  const [loaded, setLoaded] = useState(false)
  const mapsHref = `https://www.openstreetmap.org/search?query=${encodeURIComponent(venue.mapQuery ?? `${venue.name} ${venue.city}`)}`

  if (loaded) {
    return (
      <div
        role="img"
        aria-label={`Karte: ${venue.name}, ${venue.city}`}
        className="w-full aspect-video grid place-items-center rounded-card border border-line bg-surface-card text-text-muted"
      >
        <span className="text-[11px] uppercase tracking-[0.06em] font-semibold">Karte · {venue.city}</span>
      </div>
    )
  }

  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <p className="font-heading font-bold uppercase text-[16px]">{t('mapBlockedTitle')}</p>
      <p className="mt-1 text-[14px] text-text-muted">{t('mapBlockedBody')}</p>
      <dl className="mt-3 text-[14px]">
        <dt className="text-[12px] uppercase tracking-[0.04em] text-text-muted">{t('address')}</dt>
        <dd className="font-medium">{venue.name}{venue.address ? `, ${venue.address}` : `, ${venue.city}`}</dd>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="inline-flex items-center min-h-[44px] rounded-button bg-red text-white px-4 font-semibold uppercase tracking-[0.04em] text-[14px]"
        >
          {t('loadMap')}
        </button>
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center min-h-[44px] rounded-button border border-line px-4 font-semibold uppercase tracking-[0.04em] text-[14px] text-text hover:bg-surface-card"
        >
          {t('openInMaps')}
        </a>
      </div>
    </div>
  )
}
