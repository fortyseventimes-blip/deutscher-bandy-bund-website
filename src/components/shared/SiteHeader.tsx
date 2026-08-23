import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getGlobalSafe } from '@/lib/payload'
import { defaultHeaderNav, homeHref, type NavItem } from '@/lib/nav'
import { Wordmark } from './Wordmark'
import { LanguageSwitch } from './LanguageSwitch'
import { DrawerNav } from './DrawerNav'

type HeaderGlobal = {
  nav?: { label?: string; href?: string; children?: { label?: string; href?: string }[] }[]
  cta?: { label?: string; href?: string }
}

function toNavItems(nav: HeaderGlobal['nav']): NavItem[] | null {
  if (!nav || nav.length === 0) return null
  const items = nav
    .filter((n): n is { label: string; href: string; children?: { label?: string; href?: string }[] } =>
      Boolean(n.label && n.href),
    )
    .map((n) => ({
      label: n.label,
      href: n.href,
      children: (n.children ?? [])
        .filter((c): c is { label: string; href: string } => Boolean(c.label && c.href))
        .map((c) => ({ label: c.label, href: c.href })),
    }))
  return items.length > 0 ? items : null
}

/*
 * SiteHeader — sticky, translucent bar (--header-bg) so it reads over content.
 * Editor-managed nav from the `header` global, falling back to sensible
 * defaults until it is seeded. Desktop nav collapses to the DrawerNav below the
 * lg breakpoint (~1024px); the English variant's tighter spacing is handled by
 * the responsive gap.
 */
export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale })
  const global = await getGlobalSafe<HeaderGlobal>('header', locale)

  const items =
    toNavItems(global?.nav) ??
    defaultHeaderNav(locale, {
      fixtures: t('nav.fixtures'),
      teams: t('nav.teams'),
      news: t('nav.news'),
      tournaments: t('nav.tournaments'),
      federation: t('nav.federation'),
      gallery: t('nav.gallery'),
      contact: t('nav.contact'),
      newsletterCta: t('nav.newsletterCta'),
    })

  const cta = {
    label: global?.cta?.label || t('nav.newsletterCta'),
    href: global?.cta?.href || (locale === 'de' ? '/newsletter' : '/en/newsletter'),
  }

  return (
    <header
      className="sticky top-0 z-40 border-b border-line backdrop-blur"
      style={{ background: 'var(--header-bg)' }}
    >
      <div className="container-page flex items-center justify-between h-16 gap-4">
        <a href={homeHref(locale)} className="flex items-center" aria-label={t('footer.brandLine')}>
          <Wordmark />
        </a>

        {/* Desktop navigation */}
        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-7">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="font-body font-semibold uppercase tracking-[0.04em] text-[15px] text-text-muted hover:text-text transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={locale === 'de' ? '/suche' : '/en/search'}
            className="hidden sm:inline-flex items-center justify-center h-11 w-11 text-text-muted hover:text-text"
            aria-label={t('common.search')}
          >
            <span aria-hidden className="text-lg">
              ⌕
            </span>
          </a>
          <div className="hidden lg:block">
            <LanguageSwitch locale={locale} />
          </div>
          <a
            href={cta.href}
            className="hidden lg:inline-flex items-center justify-center min-h-[44px] rounded-button bg-red text-white px-4 font-body font-semibold uppercase tracking-[0.04em] text-[15px] hover:bg-[#b80000]"
          >
            {cta.label}
          </a>
          <DrawerNav
            items={items}
            cta={cta}
            locale={locale}
            labels={{ open: t('common.openMenu'), close: t('common.closeMenu') }}
          />
        </div>
      </div>
    </header>
  )
}
