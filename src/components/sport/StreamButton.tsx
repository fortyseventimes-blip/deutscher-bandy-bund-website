import { Button } from '@/components/ui/Button'
import { safeHttpUrl } from '@/lib/url'
import { STREAM_PROVIDER_NAMES, type StreamProvider } from '@/lib/streams'

/*
 * "Livestream ansehen · FIB TV" — opens the game's stream on the provider's
 * site in a new tab. Renders nothing without a valid http(s) link, so games
 * that are not streamed simply show no button.
 */
export function StreamButton({
  url,
  provider,
  label,
  variant = 'primary',
}: {
  url?: string
  provider?: StreamProvider
  label: string
  variant?: 'primary' | 'secondary'
}) {
  const parsed = safeHttpUrl(url)
  if (!parsed) return null
  const providerName = provider ? STREAM_PROVIDER_NAMES[provider] : ''
  return (
    <Button href={parsed.href} external variant={variant}>
      <span aria-hidden>▶</span>
      {label}
      {providerName && <span className="font-medium normal-case tracking-normal opacity-80">· {providerName}</span>}
    </Button>
  )
}
