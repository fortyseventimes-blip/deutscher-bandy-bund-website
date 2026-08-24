import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getGlobalSafe } from '@/lib/payload'
import { legalHref, homeHref, type NavItem } from '@/lib/nav'
import { Wordmark } from './Wordmark'

type FooterGlobal = {
  columns?: { heading?: string; links?: { label?: string; href?: string }[] }[]
  tagline?: string
}

type Column = { heading: string; links: NavItem[] }

/*
 * SiteFooter — ALWAYS dark, in both themes (handoff: "the footer stays dark in
 * the light theme"). Colours are the dark tokens set locally so a light-theme
 * page keeps a dark footer. Carries the legal links and the consent revoke
 * entry ("Cookie-Einstellungen"), which the consent gate wires up in a later
 * slice (openspec/specs/legal-compliance).
 */
function defaultColumns(locale: Locale, t: (k: string) => string): Column[] {
  const r =
    locale === 'de'
      ? { fixtures: '/spiele', teams: '/teams', tournaments: '/turniere', federation: '/verband', contact: '/kontakt', news: '/news', gallery: '/galerie', newsletter: '/newsletter' }
      : { fixtures: '/en/spiele', teams: '/en/teams', tournaments: '/en/turniere', federation: '/en/verband', contact: '/en/kontakt', news: '/en/news', gallery: '/en/galerie', newsletter: '/en/newsletter' }

  return [
    {
      heading: t('footer.sport'),
      links: [
        { label: t('nav.fixtures'), href: r.fixtures },
        { label: t('nav.teams'), href: r.teams },
        { label: t('nav.tournaments'), href: r.tournaments },
      ],
    },
    {
      heading: t('footer.federation'),
      links: [
        { label: t('nav.federation'), href: r.federation },
        { label: t('nav.news'), href: r.news },
        { label: t('nav.contact'), href: r.contact },
      ],
    },
    {
      heading: t('footer.service'),
      links: [
        { label: t('footer.newsletter'), href: r.newsletter },
        { label: t('nav.gallery'), href: r.gallery },
      ],
    },
    {
      heading: t('footer.legal'),
      links: [
        { label: t('footer.imprint'), href: legalHref(locale, 'imprint') },
        { label: t('footer.privacy'), href: legalHref(locale, 'privacy') },
        { label: t('footer.accessibility'), href: legalHref(locale, 'accessibility') },
      ],
    },
  ]
}

function toColumns(global: FooterGlobal | null): Column[] | null {
  const cols = global?.columns
  if (!cols || cols.length === 0) return null
  const mapped = cols
    .filter((c): c is { heading: string; links?: { label?: string; href?: string }[] } => Boolean(c.heading))
    .map((c) => ({
      heading: c.heading,
      links: (c.links ?? [])
        .filter((l): l is { label: string; href: string } => Boolean(l.label && l.href))
        .map((l) => ({ label: l.label, href: l.href })),
    }))
  return mapped.length > 0 ? mapped : null
}

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale })
  const global = await getGlobalSafe<FooterGlobal>('footer', locale)
  const columns = toColumns(global) ?? defaultColumns(locale, t)
  const tagline = global?.tagline || t('footer.tagline')
  const year = new Date().getFullYear()

  return (
    <footer
      className="mt-auto"
      style={{ background: '#0b0d0f', color: '#f4f7f9', borderTop: '1px solid #2a323a' }}
    >
      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <a href={homeHref(locale)} aria-label={t('footer.brandLine')} className="inline-flex">
              <Wordmark />
            </a>
            <p className="mt-4 text-[15px] leading-6" style={{ color: '#98a3ad' }}>
              {tagline}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h2 className="font-heading font-bold uppercase text-[15px] tracking-[0.02em]">
                {col.heading}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex min-h-[36px] items-center text-[15px] hover:underline"
                      style={{ color: '#98a3ad' }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: '1px solid #2a323a' }}
        >
          <p className="text-[13px]" style={{ color: '#98a3ad' }}>
            © {year} {t('footer.copyright')}
          </p>
          <button
            type="button"
            data-consent-open
            className="text-[13px] font-semibold uppercase tracking-[0.04em] min-h-[44px] inline-flex items-center hover:underline"
            style={{ color: '#98a3ad' }}
          >
            {t('footer.cookieSettings')}
          </button>
        </div>
      </div>
    </footer>
  )
}
