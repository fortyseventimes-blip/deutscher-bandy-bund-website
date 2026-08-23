import { Fragment } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

export type Crumb = { label: string; href?: string }

/*
 * Breadcrumbs — red `·` separators, mobile truncation to `…` (Komponentenblatt
 * 5b). The last crumb is the current page and is not a link. On narrow
 * viewports the intermediate crumbs collapse to a single ellipsis between the
 * first and last crumb.
 */
function Separator() {
  return (
    <span aria-hidden className="text-red">
      ·
    </span>
  )
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const hasMiddle = items.length > 2

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('text-[13px] leading-[18px] text-text-muted', className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          const isMiddle = i > 0 && !isLast
          return (
            <Fragment key={`${item.label}-${i}`}>
              {i > 0 && <li className={cn('flex', isMiddle && 'hidden sm:flex')}><Separator /></li>}
              <li className={cn('flex items-center', isMiddle && 'hidden sm:flex')}>
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-text">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(isLast && 'text-text')}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {/* Mobile-only ellipsis, shown once between first and last. */}
              {hasMiddle && i === 0 && (
                <li aria-hidden className="flex items-center gap-1.5 sm:hidden">
                  <Separator />
                  <span>…</span>
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
