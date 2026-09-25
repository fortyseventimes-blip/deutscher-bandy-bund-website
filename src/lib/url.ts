/**
 * Editor-entered links (stream, source) end up in `href`s on public pages, so
 * only absolute http(s) URLs are accepted — never `javascript:` or relative
 * paths an editor typed by mistake.
 */
export function safeHttpUrl(value: string | null | undefined): URL | null {
  if (!value) return null
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null
  } catch {
    return null
  }
}

/** Payload field validator: empty is fine, anything else must be http(s). */
export function validateHttpUrl(value: unknown): true | string {
  if (value == null || value === '') return true
  return typeof value === 'string' && safeHttpUrl(value)
    ? true
    : 'Bitte einen vollständigen Link mit https:// eingeben.'
}
