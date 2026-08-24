import { defineRouting } from 'next-intl/routing'

/**
 * German is the source locale and is served without a path prefix.
 * English is served under `/en`. See openspec/specs/i18n/spec.md.
 */
export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'as-needed',
  // German is the source locale and `/` always opens in German; visitors choose
  // English via the language switch rather than being auto-redirected by their
  // browser's Accept-Language (openspec/specs/i18n: English is a manual variant).
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]
