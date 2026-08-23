import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Node =
  | { kind: 'p'; text: string }
  | { kind: 'h'; level: 2 | 3; text: string }

function textNode(text: string) {
  return {
    type: 'text',
    version: 1,
    text,
    format: 0,
    style: '',
    mode: 'normal',
    detail: 0,
  }
}

/**
 * Build a minimal valid Lexical editor state from a list of paragraphs and
 * subheadings — enough to seed legal-page prose without hand-writing JSON.
 */
export function lexical(nodes: Node[]): SerializedEditorState {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: nodes.map((n) => {
        if (n.kind === 'h') {
          return {
            type: 'heading',
            tag: `h${n.level}`,
            version: 1,
            format: '',
            indent: 0,
            direction: 'ltr',
            children: [textNode(n.text)],
          }
        }
        return {
          type: 'paragraph',
          version: 1,
          format: '',
          indent: 0,
          direction: 'ltr',
          textFormat: 0,
          children: [textNode(n.text)],
        }
      }),
    },
  } as unknown as SerializedEditorState
}

export const p = (text: string): Node => ({ kind: 'p', text })
export const h2 = (text: string): Node => ({ kind: 'h', level: 2, text })
export const h3 = (text: string): Node => ({ kind: 'h', level: 3, text })
