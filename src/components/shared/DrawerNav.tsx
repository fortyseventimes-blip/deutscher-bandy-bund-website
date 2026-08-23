'use client'

import { useEffect, useRef, useState } from 'react'
import type { NavItem } from '@/lib/nav'
import type { Locale } from '@/i18n/routing'
import { LanguageSwitch } from './LanguageSwitch'
import { cn } from '@/lib/cn'

type Props = {
  items: NavItem[]
  cta?: { label: string; href: string }
  locale: Locale
  labels: { open: string; close: string }
}

/*
 * Mobile drawer navigation. Full-height panel with the complete tree, language
 * switch and the primary CTA. Focus is trapped inside, background scroll is
 * locked, and Escape closes it (openspec/specs/navigation-static "Mobile-first
 * navigation"). Desktop viewports never see the trigger.
 */
export function DrawerNav({ items, cta, locale, labels }: Props) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    // Move focus into the panel.
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="inline-flex items-center justify-center h-11 w-11 text-text"
      >
        <span className="sr-only">{labels.open}</span>
        <span aria-hidden className="text-2xl leading-none">
          ≡
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={labels.open}
        >
          <button
            type="button"
            aria-label={labels.close}
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="absolute inset-y-0 right-0 w-[88%] max-w-sm bg-surface-raised border-l border-line flex flex-col"
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-line">
              <LanguageSwitch locale={locale} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center h-11 w-11 text-text"
              >
                <span className="sr-only">{labels.close}</span>
                <span aria-hidden className="text-xl">
                  ✕
                </span>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="flex flex-col">
                {items.map((item) => (
                  <li key={item.href} className="border-b border-line">
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center min-h-[44px] py-3 font-body font-semibold uppercase tracking-[0.04em] text-[16px] text-text"
                    >
                      {item.label}
                    </a>
                    {item.children && item.children.length > 0 && (
                      <ul className="pb-2">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <a
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="flex items-center min-h-[44px] pl-4 text-[15px] text-text-muted"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {cta && (
              <div className="p-4 border-t border-line">
                <a
                  href={cta.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-center min-h-[44px] w-full rounded-button',
                    'bg-red text-white font-body font-semibold uppercase tracking-[0.04em] text-[15px]',
                  )}
                >
                  {cta.label}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
