'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/cn'

type Theme = 'dark' | 'light'

/*
 * Theme toggle. The server stamps `data-theme` from the `theme` cookie so there
 * is no flash; visitors who never chose follow their system preference (handled
 * in tokens.css). This control flips between light and dark, persists the choice
 * in a cookie and applies it immediately — no reload.
 */
function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  const explicit = document.documentElement.dataset.theme
  if (explicit === 'light' || explicit === 'dark') return explicit
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations('common')
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTheme(currentTheme())
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = next
    // One year, site-wide. Lax is enough — this is a display preference.
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`
    setTheme(next)
  }

  const label = theme === 'light' ? t('themeToDark') : t('themeToLight')

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center h-11 w-11 rounded-button',
        'text-text-muted hover:text-text hover:bg-surface-card transition-colors',
        className,
      )}
    >
      {/* Before hydration the icon would be a guess — render a stable neutral
          glyph so the markup matches on the server and the client. */}
      <span aria-hidden className="text-[18px] leading-none">
        {!mounted ? '◐' : theme === 'light' ? '☾' : '☀'}
      </span>
    </button>
  )
}
