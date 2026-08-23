import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type BlockSettings = {
  background?: 'default' | 'muted' | 'inverted' | 'accent'
  spacing?: 'none' | 's' | 'm' | 'l'
  anchorId?: string
}

const spacingClass: Record<NonNullable<BlockSettings['spacing']>, string> = {
  none: 'py-0',
  s: 'py-8',
  m: 'py-12 md:py-16',
  l: 'py-16 md:py-24',
}

/*
 * The wrapper every block renders inside. Applies the shared block settings —
 * background variant, vertical spacing and anchor id (openspec/specs/
 * page-composition "Shared block settings"). Background uses tokens so it stays
 * theme-reactive; "inverted" flips to the raised surface.
 */
const backgroundStyle: Record<NonNullable<BlockSettings['background']>, CSSProperties> = {
  default: { background: 'var(--surface)', color: 'var(--text)' },
  muted: { background: 'var(--surface-raised)', color: 'var(--text)' },
  inverted: { background: 'var(--surface-card)', color: 'var(--text)' },
  accent: { background: 'var(--live-row-bg)', color: 'var(--text)' },
}

export function Section({
  settings,
  className,
  children,
}: {
  settings?: BlockSettings
  className?: string
  children: ReactNode
}) {
  const spacing = settings?.spacing ?? 'm'
  const background = settings?.background ?? 'default'
  return (
    <section
      id={settings?.anchorId || undefined}
      className={cn('scroll-mt-20', spacingClass[spacing], className)}
      style={backgroundStyle[background]}
    >
      <div className="container-page">{children}</div>
    </section>
  )
}
