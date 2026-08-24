'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

type Labels = { days: string; hours: string; minutes: string; seconds: string; running: string }

/*
 * Countdown to kick-off. Server-renders the plain date (`fallback`) so it works
 * with JavaScript disabled; on hydrate it ticks down, and at zero it switches to
 * the "läuft" state without a page error (handoff / fixtures-results spec). The
 * pulse/seconds motion is inert under prefers-reduced-motion via the base rules.
 */
export function Countdown({
  targetIso,
  labels,
  fallback,
  className,
}: {
  targetIso: string
  labels: Labels
  fallback: string
  className?: string
}) {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // Pre-hydration / no-JS: show the plain date.
  if (!mounted) {
    return (
      <time dateTime={targetIso} className={cn('font-heading font-bold uppercase', className)}>
        {fallback}
      </time>
    )
  }

  const diff = new Date(targetIso).getTime() - now
  if (diff <= 0) {
    return (
      <span className={cn('font-heading font-extrabold uppercase text-red', className)}>
        {labels.running}
      </span>
    )
  }

  const s = Math.floor(diff / 1000)
  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = s % 60

  const cell = (value: number, label: string) => (
    <div className="flex flex-col items-center">
      <span className="font-heading font-extrabold text-[32px] md:text-[44px] leading-none tabular">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[11px] uppercase tracking-[0.06em] text-text-muted">{label}</span>
    </div>
  )

  return (
    <div className={cn('flex items-start gap-4 md:gap-6', className)}>
      {cell(days, labels.days)}
      <Sep />
      {cell(hours, labels.hours)}
      <Sep />
      {cell(minutes, labels.minutes)}
      <Sep />
      {cell(seconds, labels.seconds)}
    </div>
  )
}

function Sep() {
  return <span aria-hidden className="font-heading font-extrabold text-[32px] md:text-[44px] leading-none text-line">:</span>
}
