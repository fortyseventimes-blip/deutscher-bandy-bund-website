import { safeHttpUrl } from '@/lib/url'

/*
 * "Quelle: worldbandy.com ↗" — the official page a game or tournament was
 * transcribed from. Renders nothing for an empty or non-http(s) value.
 */
export function SourceLink({ url, label }: { url?: string; label: string }) {
  const parsed = safeHttpUrl(url)
  if (!parsed) return null
  return (
    <p className="text-[13px] text-text-muted">
      {label}:{' '}
      <a
        href={parsed.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-text"
      >
        {parsed.hostname.replace(/^www\./, '')} ↗
      </a>
    </p>
  )
}
