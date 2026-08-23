import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from '@/i18n/routing'

/**
 * A single cached Payload instance for the running process. Server-only — never
 * import this from a client component. All content access goes through this
 * layer so fixtures/CMS/API can sit behind it (see CLAUDE_CODE_PROMPT step 3).
 */
export async function getPayloadClient() {
  return getPayload({ config })
}

/** Read a global by slug for a locale, tolerating an unseeded database. */
export async function getGlobalSafe<T = Record<string, unknown>>(
  slug: 'header' | 'footer' | 'site-settings' | 'seo-defaults',
  locale: Locale,
): Promise<T | null> {
  try {
    const payload = await getPayloadClient()
    const data = (await payload.findGlobal({ slug, locale, fallbackLocale: 'de' })) as T
    return data
  } catch {
    // Database unavailable or not migrated yet — the caller renders a fallback.
    return null
  }
}
