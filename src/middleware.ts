import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  /**
   * Run locale routing on the public site only. Exclude the Payload admin panel
   * (`/admin`), all API routes (`/api`, `/next`), machine surfaces served from
   * the root (sitemap, robots, feeds, ics), Next internals and any file with an
   * extension.
   */
  matcher: [
    '/((?!admin|api|next|_next|_vercel|sitemap\\.xml|robots\\.txt|llms\\.txt|feed\\.xml|.*\\..*).*)',
  ],
}
