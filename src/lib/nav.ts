import type { Locale } from '@/i18n/routing'

export type NavItem = { label: string; href: string; children?: NavItem[] }

/**
 * Default header/footer navigation used until an editor customises the trees in
 * the admin (openspec/specs/navigation-static). Hrefs are FULL paths that
 * already carry the `/en` prefix and the localized slugs (DE unprefixed, EN
 * under /en) per the URL scheme in the design doc, so they are rendered with a
 * plain <a> and never double-prefixed.
 */
type Labels = {
  fixtures: string
  teams: string
  news: string
  tournaments: string
  federation: string
  gallery: string
  contact: string
  newsletterCta: string
}

const routes: Record<Locale, Record<keyof Omit<Labels, 'newsletterCta'>, string>> = {
  de: {
    fixtures: '/spiele',
    teams: '/teams',
    news: '/news',
    tournaments: '/turniere',
    federation: '/verband',
    gallery: '/galerie',
    contact: '/kontakt',
  },
  en: {
    // This pass serves both locales on the German path segments; fully
    // localized EN slugs are deferred to the i18n slug work.
    fixtures: '/en/spiele',
    teams: '/en/teams',
    news: '/en/news',
    tournaments: '/en/turniere',
    federation: '/en/verband',
    gallery: '/en/galerie',
    contact: '/en/kontakt',
  },
}

export function homeHref(locale: Locale): string {
  return locale === 'de' ? '/' : '/en'
}

export function defaultHeaderNav(locale: Locale, labels: Labels): NavItem[] {
  const r = routes[locale]
  return [
    { label: labels.fixtures, href: r.fixtures },
    { label: labels.teams, href: r.teams },
    { label: labels.news, href: r.news },
    { label: labels.tournaments, href: r.tournaments },
    { label: labels.federation, href: r.federation },
  ]
}

export function legalHref(
  locale: Locale,
  which: 'imprint' | 'privacy' | 'accessibility',
): string {
  const de = { imprint: '/impressum', privacy: '/datenschutz', accessibility: '/barrierefreiheit' }
  const en = { imprint: '/en/imprint', privacy: '/en/privacy', accessibility: '/en/accessibility' }
  return locale === 'de' ? de[which] : en[which]
}
