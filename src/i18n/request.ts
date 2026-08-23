import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

/**
 * Loads the interface message catalogue for the active request locale and pins
 * the display timezone to Europe/Berlin (times are stored in UTC — see
 * openspec/specs/i18n/spec.md).
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    timeZone: 'Europe/Berlin',
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
