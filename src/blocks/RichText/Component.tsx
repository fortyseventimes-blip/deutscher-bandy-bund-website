import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { Section, type BlockSettings } from '../shared/Section'

export type RichTextData = {
  blockType: 'richText'
  content: SerializedEditorState
  settings?: BlockSettings
}

/* RichTextBlock — Lexical prose, capped to ~66ch for readability. */
export function RichTextBlock({ data }: { data: RichTextData }) {
  return (
    <Section settings={data.settings}>
      <div className="prose-measure text-[17px] leading-7 md:text-[18px] md:leading-[30px]">
        <LexicalRichText data={data.content} />
      </div>
    </Section>
  )
}
