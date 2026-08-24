'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/cn'

type TabKey = 'overview' | 'lineup' | 'ticker' | 'stats' | 'gallery'

/*
 * Match tab bar (handoff 4a) — anchors to the sections stacked on the page, with
 * a 2px red underline on the active tab. Works without JS (plain anchor links);
 * with JS a scrollspy keeps the active tab in sync. Sticky under the header.
 */
export function MatchTabs({ tabs }: { tabs: TabKey[] }) {
  const t = useTranslations('sport.tabs')
  const [active, setActive] = useState<TabKey>(tabs[0])

  useEffect(() => {
    const sections = tabs
      .map((id) => document.getElementById(`match-${id}`))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id.replace('match-', '') as TabKey)
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.5, 1] },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [tabs])

  return (
    <div className="sticky top-16 z-[3] bg-surface border-b border-line -mx-4 px-4">
      <nav className="flex gap-1 overflow-x-auto" aria-label="Spiel-Abschnitte">
        {tabs.map((id) => (
          <a
            key={id}
            href={`#match-${id}`}
            className={cn(
              'shrink-0 min-h-[44px] inline-flex items-center px-3 font-body font-semibold uppercase tracking-[0.04em] text-[14px] border-b-2 transition-colors',
              active === id ? 'border-red text-text' : 'border-transparent text-text-muted hover:text-text',
            )}
          >
            {t(id)}
          </a>
        ))}
      </nav>
    </div>
  )
}
