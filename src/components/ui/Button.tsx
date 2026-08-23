import type { ComponentProps, ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'sm'

/*
 * Button — primary / secondary / ghost, each with rest / hover / focus /
 * disabled states (see Komponentenblatt 5b). Renders as an <a>/<Link> when
 * `href` is given, otherwise a <button>. Uppercase Inter 600, 44px min height.
 */
const base =
  'inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-[0.04em] ' +
  'rounded-button transition-colors select-none disabled:opacity-40 disabled:pointer-events-none ' +
  'min-h-[44px]'

const sizes: Record<Size, string> = {
  md: 'text-[15px] leading-5 px-5 py-3',
  sm: 'text-[13px] leading-4 px-4 py-2 min-h-[40px]',
}

const variants: Record<Variant, string> = {
  primary: 'bg-red text-white hover:bg-[#b80000]',
  secondary:
    'bg-transparent text-text border border-line hover:bg-surface-card',
  ghost: 'bg-transparent text-text-muted hover:text-text hover:bg-surface-card',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<'button'>, 'className' | 'children'> & { href?: undefined }

type ButtonAsLink = CommonProps & {
  href: string
  external?: boolean
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', size = 'md', children, className } = props
  const classes = cn(base, sizes[size], variants[variant], className)

  if ('href' in props && props.href !== undefined) {
    const { href, external } = props
    if (external) {
      return (
        <a href={href} className={classes} rel="noopener noreferrer" target="_blank">
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  const { variant: _v, size: _s, children: _c, className: _cn, ...rest } =
    props as ButtonAsButton
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
