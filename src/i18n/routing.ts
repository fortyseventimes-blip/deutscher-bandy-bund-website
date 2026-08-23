import { defineRouting } from 'next-intl/routing'

/**
 * German is the source locale and is served without a path prefix.
 * English is served under `/en`. See openspec/specs/i18n/spec.md.
 */
export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]
