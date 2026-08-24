import type { ImageRef } from '@/lib/data/types'
import { cn } from '@/lib/cn'

const ratioClass: Record<NonNullable<ImageRef['ratio']>, string> = {
  '16/9': 'aspect-video',
  '3/4': 'aspect-[3/4]',
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
}

/*
 * Labelled image drop-slot. No real photography is supplied yet, so every image
 * area renders a placeholder naming what belongs there (handoff "Assets"). When
 * `src` is provided later it renders the real image instead. Elevation is a 1px
 * line, never a shadow.
 */
export function ImageSlot({
  image,
  className,
  rounded = true,
}: {
  image?: ImageRef | null
  className?: string
  rounded?: boolean
}) {
  const ratio = image?.ratio ?? '16/9'
  if (image?.src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={image.src}
        alt={image.alt ?? ''}
        className={cn('w-full object-cover', ratioClass[ratio], rounded && 'rounded-card', className)}
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={image?.label ?? 'Bildplatzhalter'}
      className={cn(
        'w-full grid place-items-center bg-surface-card border border-line text-text-muted',
        ratioClass[ratio],
        rounded && 'rounded-card',
        className,
      )}
    >
      <span className="text-[11px] uppercase tracking-[0.06em] font-semibold px-3 text-center">
        {image?.label ?? 'Bild folgt'}
      </span>
    </div>
  )
}
