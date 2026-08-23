import { Barlow_Condensed, Inter } from 'next/font/google'

/**
 * Barlow Condensed (headings, scores, numbers) and Inter (body, UI).
 * Loaded via next/font so they are self-hosted and privacy-friendly in
 * production — no runtime request to Google. Weights per the handoff.
 */
export const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})
