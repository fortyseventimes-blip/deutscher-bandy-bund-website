import type { Locale } from '@/i18n/routing'

/*
 * Coded public routes. This pass uses the German path segments under both
 * locales (so `/spiele` and `/en/spiele`); fully localized EN slugs
 * (`/en/games`) are deferred to the i18n slug work. Centralising the builders
 * here means that later change touches one file.
 */
const p = (locale: Locale, path: string) => (locale === 'en' ? `/en${path}` : path)

export const routes = {
  home: (l: Locale) => (l === 'en' ? '/en' : '/'),
  fixtures: (l: Locale) => p(l, '/spiele'),
  game: (l: Locale, slug: string) => p(l, `/spiele/${slug}`),
  teams: (l: Locale) => p(l, '/teams'),
  team: (l: Locale, slug: string) => p(l, `/teams/${slug}`),
  player: (l: Locale, slug: string) => p(l, `/spieler/${slug}`),
  tournaments: (l: Locale) => p(l, '/turniere'),
  tournament: (l: Locale, slug: string) => p(l, `/turniere/${slug}`),
  news: (l: Locale) => p(l, '/news'),
  newsletter: (l: Locale) => p(l, '/newsletter'),
}
