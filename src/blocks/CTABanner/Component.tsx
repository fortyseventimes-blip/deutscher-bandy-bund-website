import { Section, type BlockSettings } from '../shared/Section'
import { Button } from '@/components/ui/Button'

type ButtonData = {
  label: string
  href: string
  variant?: 'primary' | 'secondary' | 'ghost' | null
}

export type CTABannerData = {
  blockType: 'ctaBanner'
  title: string
  lead?: string | null
  buttons?: ButtonData[] | null
  settings?: BlockSettings
}

/* CTABanner — headline + text + up to two buttons, centered. */
export function CTABanner({ data }: { data: CTABannerData }) {
  return (
    <Section settings={{ background: 'muted', ...data.settings }}>
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-[26px] leading-8 md:text-[40px] md:leading-[44px] font-bold">
          {data.title}
        </h2>
        {data.lead && <p className="mt-4 text-text-muted text-[17px] leading-7">{data.lead}</p>}
        {data.buttons && data.buttons.length > 0 && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {data.buttons.map((b, i) => (
              <Button key={`${b.href}-${i}`} href={b.href} variant={b.variant ?? 'primary'}>
                {b.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
