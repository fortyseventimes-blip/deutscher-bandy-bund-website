export type DividerData = {
  blockType: 'divider'
  variant?: 'line' | 'space' | null
}

/* Divider — a 1px rule or an empty spacer. Elevation is never a shadow. */
export function Divider({ data }: { data: DividerData }) {
  if (data.variant === 'space') {
    return <div className="h-10 md:h-16" aria-hidden />
  }
  return (
    <div className="container-page">
      <hr className="border-0 border-t border-line" />
    </div>
  )
}
