import type { NewsTeaser } from '@/lib/data/types'
import type { Locale } from '@/i18n/routing'
import { ImageSlot } from './ImageSlot'
import { formatDate } from '@/lib/format'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/cn'

/*
 * NewsCard — with image (16:9) or text-only (handoff Komponentenblatt 5d).
 * Category kicker in yellow, date meta, title in condensed uppercase.
 */
export function NewsCard({ item, locale, className }: { item: NewsTeaser; locale: Locale; className?: string }) {
  const href = `${routes.news(locale)}/${item.slug}`
  return (
    <a
      href={href}
      className={cn(
        'group flex flex-col rounded-card border border-line bg-surface overflow-hidden hover:bg-surface-raised transition-colors',
        className,
      )}
    >
      {item.image !== null && <ImageSlot image={item.image} rounded={false} />}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--label-yellow-text)' }}>
            {item.category}
          </span>
          <span className="text-line">·</span>
          <time dateTime={item.date} className="text-text-muted tabular">{formatDate(item.date, locale)}</time>
        </div>
        <h3 className="font-heading font-bold uppercase text-[20px] leading-6 group-hover:text-red transition-colors">
          {item.title}
        </h3>
        <p className="text-[15px] leading-6 text-text-muted">{item.excerpt}</p>
      </div>
    </a>
  )
}
