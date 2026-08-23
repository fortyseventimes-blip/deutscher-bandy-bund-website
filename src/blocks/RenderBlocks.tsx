import { HeroCompact, type HeroCompactData } from './HeroCompact/Component'
import { RichTextBlock, type RichTextData } from './RichText/Component'
import { CTABanner, type CTABannerData } from './CTABanner/Component'
import { Divider, type DividerData } from './Divider/Component'

export type AnyBlock = (HeroCompactData | RichTextData | CTABannerData | DividerData) & {
  id?: string | null
}

/*
 * Maps a page's ordered block array to React components. A block type with no
 * renderer is skipped rather than throwing, so a newly-added CMS block can never
 * take down a live page.
 */
export function RenderBlocks({ blocks }: { blocks?: AnyBlock[] | null }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <>
      {blocks.map((block, i) => {
        const key = block.id || `${block.blockType}-${i}`
        switch (block.blockType) {
          case 'heroCompact':
            return <HeroCompact key={key} data={block} />
          case 'richText':
            return <RichTextBlock key={key} data={block} />
          case 'ctaBanner':
            return <CTABanner key={key} data={block} />
          case 'divider':
            return <Divider key={key} data={block} />
          default:
            return null
        }
      })}
    </>
  )
}
