/**
 * Where a game is streamed. FIB TV (Staylive) is the official platform for
 * every FIB tournament; Bandyplay carries the same streams for viewers in
 * Sweden, Norway and Finland. Provider names are brands, so they are not
 * translated.
 */
export const STREAM_PROVIDER_NAMES = {
  'fib-tv': 'FIB TV',
  bandyplay: 'Bandyplay',
  youtube: 'YouTube',
  other: '',
} as const

export type StreamProvider = keyof typeof STREAM_PROVIDER_NAMES

export const STREAM_PROVIDERS = [
  { label: 'FIB TV', value: 'fib-tv' },
  { label: 'Bandyplay', value: 'bandyplay' },
  { label: 'YouTube', value: 'youtube' },
  { label: { de: 'Anderer', en: 'Other' }, value: 'other' },
]
