import type { ReactNode } from 'react'
import type { ImageRef } from '@/lib/data/types'
import { ImageSlot } from './ImageSlot'

/*
 * HeroMedia — full-bleed image slot with a left-to-right dark gradient and
 * overlaid content (tournament / feature hero, handoff 7c). Falls back to a
 * labelled image placeholder until real photography is supplied.
 */
export function HeroMedia({
  image,
  kicker,
  title,
  meta,
  children,
}: {
  image?: ImageRef
  kicker?: string
  title: string
  meta?: string
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden rounded-card border border-line">
      <ImageSlot image={image ?? { label: 'Hero 16:9', ratio: '16/9' }} rounded={false} className="!aspect-[21/9]" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(7,9,11,0.92) 0%, rgba(7,9,11,0.55) 55%, transparent 100%)' }} />
      <div className="absolute inset-0 flex items-end">
        <div className="p-6 md:p-10 max-w-2xl">
          {kicker && (
            <p className="font-body font-semibold uppercase text-[13px] tracking-[0.08em] mb-2" style={{ color: 'var(--label-yellow-text)' }}>
              {kicker}
            </p>
          )}
          <h1 className="font-heading font-bold uppercase text-[44px] leading-[44px] md:text-[64px] md:leading-[66px]" style={{ letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          {meta && <p className="mt-3 text-[15px] text-text-muted tabular">{meta}</p>}
          {children && <div className="mt-5 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  )
}
