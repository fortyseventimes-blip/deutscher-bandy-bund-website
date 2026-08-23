import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Payload runs in the same process; keep server components lean.
  reactStrictMode: true,
  // Self-host Google Fonts in production; allow remote patterns for media later.
  images: {
    remotePatterns: [],
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
