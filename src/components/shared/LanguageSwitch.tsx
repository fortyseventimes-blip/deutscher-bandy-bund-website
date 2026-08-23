'use client'

import { usePathname } from 'next/navigation'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/cn'

/*
 * Language switch. Keeps the visitor on the equivalent path by swapping only the
 * locale prefix. Full slug-aware switching (e.g. /spieler/x → /en/players/x)
 * lands with localized entity routing in Slice 2; here it maps the `/en` prefix
 * on and off, which is correct for the coded pages.
 */
function pathForLocale(pathname: string, target: Locale): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  if (target === 'en') return stripped === '/' ? '/en' : `/en${stripped}`
  return stripped
}

const LOCALES: { code: Locale; label: string; hrefLang: string }[] = [
  { code: 'de', label: 'DE', hrefLang: 'de' },
  { code: 'en', label: 'EN', hrefLang: 'en' },
]

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.04em]">
      {LOCALES.map((l, i) => {
        const active = l.code === locale
        return (
          <span key={l.code} className="flex items-center gap-1">
            {i > 0 && (
              <span aria-hidden className="text-line">
                /
              </span>
            )}
            {active ? (
              <span className="text-text px-1" aria-current="true">
                {l.label}
              </span>
            ) : (
              <a
                href={pathForLocale(pathname, l.code)}
                hrefLang={l.hrefLang}
                className="min-h-[44px] inline-flex items-center px-1 text-text-muted hover:text-text"
              >
                {l.label}
              </a>
            )}
          </span>
        )
      })}
    </div>
  )
}
