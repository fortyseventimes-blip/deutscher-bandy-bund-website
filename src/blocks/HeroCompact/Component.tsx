import { Section, type BlockSettings } from '../shared/Section'
import { Button } from '@/components/ui/Button'

export type HeroCompactData = {
  blockType: 'heroCompact'
  kicker?: string | null
  title: string
  lead?: string | null
  cta?: { label?: string | null; href?: string | null } | null
  settings?: BlockSettings
}

/*
 * HeroCompact — kicker (yellow, uppercase, tracked) + big condensed title +
 * lead + optional CTA. Text-only variant; the media/right-callout variants
 * arrive with the media collection.
 */
export function HeroCompact({ data }: { data: HeroCompactData }) {
  return (
    <Section settings={data.settings}>
      <div className="max-w-3xl">
        {data.kicker && (
          <p
            className="font-body font-semibold uppercase text-[13px] tracking-[0.08em] mb-3"
            style={{ color: 'var(--label-yellow-text)' }}
          >
            {data.kicker}
          </p>
        )}
        <h1 className="text-[32px] leading-9 md:text-[56px] md:leading-[60px] font-bold">
          {data.title}
        </h1>
        {data.lead && (
          <p className="prose-measure mt-5 text-[17px] leading-7 md:text-[18px] md:leading-[30px] text-text-muted">
            {data.lead}
          </p>
        )}
        {data.cta?.label && data.cta?.href && (
          <div className="mt-7">
            <Button href={data.cta.href}>{data.cta.label}</Button>
          </div>
        )}
      </div>
    </Section>
  )
}
