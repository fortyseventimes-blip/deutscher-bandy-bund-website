import type { Locale } from '@/i18n/routing'

/**
 * Date/number formatting. Times are stored in UTC and displayed in Europe/Berlin
 * (openspec/specs/i18n): DE `16.01.2027, 15:00 Uhr`, EN `16 Jan 2027, 3:00 PM`.
 */
const TZ = 'Europe/Berlin'
const intlLocale: Record<Locale, string> = { de: 'de-DE', en: 'en-GB' }

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: '2-digit',
    month: locale === 'de' ? '2-digit' : 'short',
    year: 'numeric',
    timeZone: TZ,
  }).format(new Date(iso))
}

export function formatTime(iso: string, locale: Locale): string {
  const t = new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    hour: locale === 'de' ? '2-digit' : 'numeric',
    minute: '2-digit',
    hour12: locale === 'en',
    timeZone: TZ,
  }).format(new Date(iso))
  return locale === 'de' ? `${t} Uhr` : t
}

export function formatDateTime(iso: string, locale: Locale): string {
  return `${formatDate(iso, locale)}, ${formatTime(iso, locale)}`
}

export function formatWeekday(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], { weekday: 'short', timeZone: TZ }).format(
    new Date(iso),
  )
}

/** Stable key + label for grouping fixtures by month (sticky month headers). */
export function monthGroup(iso: string, locale: Locale): { key: string; label: string } {
  const d = new Date(iso)
  const key = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', timeZone: TZ }).format(d)
  const label = new Intl.DateTimeFormat(intlLocale[locale], {
    month: 'long',
    year: 'numeric',
    timeZone: TZ,
  }).format(d)
  return { key, label }
}

/** A short date block for fixture rows: `{ day: "16", mon: "JAN" }`. */
export function dateBlock(iso: string, locale: Locale): { day: string; mon: string; weekday: string } {
  const d = new Date(iso)
  const day = new Intl.DateTimeFormat(intlLocale[locale], { day: '2-digit', timeZone: TZ }).format(d)
  const mon = new Intl.DateTimeFormat(intlLocale[locale], { month: 'short', timeZone: TZ })
    .format(d)
    .replace('.', '')
    .toUpperCase()
  const weekday = formatWeekday(iso, locale)
  return { day, mon, weekday }
}
