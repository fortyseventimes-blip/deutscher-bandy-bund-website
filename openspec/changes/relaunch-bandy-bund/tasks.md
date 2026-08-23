# Tasks: relaunch-bandy-bund

Ordered. Each slice ends in a deployable state. Tick items as they land; a merged PR that leaves a
box unticked or a spec stale is a defect.

## Slice 1 — Skeleton

### Repository and tooling
- [ ] 1.1 Initialize repo: Next.js 16, TypeScript strict, pnpm, Payload 3, Tailwind v4
- [ ] 1.2 Add ESLint 9, Prettier, lefthook, commitlint with Conventional Commits
- [ ] 1.3 Add `openspec/` to the repo and wire `openspec validate --strict` into CI
- [ ] 1.4 Docker: multi-stage `Dockerfile`, `compose.yml` (app, postgres, caddy, backup)
- [ ] 1.5 `.env.example` with every variable documented; secrets never committed
- [ ] 1.6 Branch protection on `main` and `production`; required checks

### CI/CD
- [ ] 1.7 `ci.yml`: typecheck, lint, unit, build, e2e with Postgres service, openspec validate
- [ ] 1.8 `deploy-staging.yml`: build → GHCR (SHA tag) → SSH → compose pull/up → migrate → smoke
- [ ] 1.9 `deploy-production.yml`: on `v*` tag → manual approval → backup → retag → migrate →
      smoke → auto-rollback on failure
- [ ] 1.10 Provision staging stack on the VPS, TLS via Caddy, verify HSTS and CSP headers

### Foundations
- [ ] 1.11 `users` collection with the seven roles; access control helpers; 2FA for
      `superadmin` and `editor`; session and rate-limit config
- [ ] 1.12 `audit-log` collection with hooks on create/publish/delete/role change
- [ ] 1.13 Localization config: `de` default unprefixed, `en` under `/en`; next-intl catalogues
- [ ] 1.14 Design tokens as CSS custom properties; base typography and spacing scale
- [ ] 1.15 `pages` collection with block field; blocks: `HeroCompact`, `RichText`, `MediaWithText`,
      `CTABanner`, `Divider`
- [ ] 1.16 `header` and `footer` globals with locale-aware nav trees; sticky header, mobile drawer
- [ ] 1.17 `site-settings` and `seo-defaults` globals
- [ ] 1.18 Legal pages as `pages`: Impressum, Datenschutz, Barrierefreiheitserklärung
- [ ] 1.19 Consent gate per § 25 TDDDG with equal-weight reject; revocation link in footer
- [ ] 1.20 Cookieless analytics deployed and verified to set no client-side identifier
- [ ] 1.21 404 and DB-independent 500 pages
- [ ] 1.22 `sitemap.xml`, `robots.txt` with editable crawler list, `llms.txt`
- [ ] 1.23 Accessibility baseline: skip link, focus styles, landmark structure; axe in CI

## Slice 2 — Sport core

### Model
- [ ] 2.1 `seasons`, `venues`, `opponents` collections
- [ ] 2.2 `teams` collection with gender, age group, crest, description
- [ ] 2.3 `players` collection with memberships array, positions, status, portrait, bio, aiAssisted
- [ ] 2.4 `staff` collection
- [ ] 2.5 `games` collection: UTC kickoff, status, polymorphic sides, venue, `isTournamentGame`,
      tournament relation with conditional validation, scores, roster array, report, media
- [ ] 2.6 `tournaments` collection with type, dates, participants, standings rows, placement,
      documents
- [ ] 2.7 Validation: no duplicate player within a roster; tournament required when flagged;
      score only editable when status is `finished`

### Presentation
- [ ] 2.8 Blocks: `MatchdayHero`, `NextMatches`, `LastResults`, `ResultsTicker`, `FixtureList`,
      `PlayerGrid`, `PlayerCarousel`, `PlayerSpotlight`, `StaffGrid`, `TournamentTeaser`,
      `StandingsTable`, `MatchRoster`, `MatchReport`, `Stats`, `Timeline`
- [ ] 2.9 Routes: `/teams`, `/teams/{slug}`, `/spieler/{slug}`, `/spiele`, `/spiele/{slug}`,
      `/turniere`, `/turniere/{slug}` and EN equivalents
- [ ] 2.10 Squad filtering by position and search, working without JavaScript
- [ ] 2.11 Countdown with no-JS fallback; off-season fallback for `MatchdayHero`
- [ ] 2.12 JSON-LD: `SportsOrganization`, `SportsTeam`, `Person`, `SportsEvent`, `BreadcrumbList`
- [ ] 2.13 Revalidation tags per entity; verify a published result updates the home page

### Data
- [ ] 2.14 Media collection with required alt/credit/license, focal point, AVIF/WebP derivatives
- [ ] 2.15 Player import from `{gender}-{number}-{first}-{last}` card assets → drafts + report
- [ ] 2.16 Review the import report against the corrected source lists; confirm any remaining
      ambiguity with the board before publishing a player record
- [ ] 2.17 Seed seasons, teams, venues; enter the historic tournament record

## Slice 3 — Editorial and reach

- [ ] 3.1 `articles` collection with types, categories, tags, relations, SEO tab, aiAssisted
- [ ] 3.2 `/news` listing with type/category/tag filters and crawlable filter URLs
- [ ] 3.3 Author review gate: `author` can submit but not publish
- [ ] 3.4 Scheduled publishing job (`publishAt`)
- [ ] 3.5 `galleries` and `documents`; blocks `Gallery`, `DocumentList`, `VideoEmbed` (consent-gated),
      `MapBlock` (consent-gated), `Quote`, `Accordion`, `TableBlock`, `LogoWall`, `SocialLinks`
- [ ] 3.6 `partners` collection and sponsor rendering
- [ ] 3.7 Site search across articles, players, games, tournaments, pages, grouped by type
- [ ] 3.8 RSS/Atom per locale; iCalendar `/spiele.ics`, per-team feeds, per-game download
- [ ] 3.9 Public JSON endpoints: fixtures, results, squads
- [ ] 3.10 OG image generation: game score cards, player portrait cards, article cards
- [ ] 3.11 `subscribers` collection, double opt-in flow, consent evidence, token management,
      one-click unsubscribe with `List-Unsubscribe` headers
- [ ] 3.12 `NewsletterSignup` block in inline, footer and slide-in variants; honeypot and challenge
- [ ] 3.13 Contact form via form builder; submissions collection; notification email
- [ ] 3.14 Transactional email: sender domain, SPF, DKIM, DMARC verified
- [ ] 3.15 Complete EN locale for all interface strings and legal pages; hreflang; outdated-locale
      indicator in the admin
- [ ] 3.16 Live preview wired for pages, articles, games, players

## Slice 4 — Assistant and hardening

- [ ] 4.1 `/api/ai/[action]` route with session + `ai:use` authorization
- [ ] 4.2 Versioned prompt templates for the six actions; fact-block builders with field allowlists
- [ ] 4.3 `<untrusted_content>` fencing for all user-supplied text
- [ ] 4.4 Zod schemas, sanitization, length caps, link allowlist, single retry
- [ ] 4.5 Draft-only write path with `reviewState: needs_review` and `aiAssisted: true`, enforced in
      access control
- [ ] 4.6 Quotas: per-user daily, per-org monthly, per-action `max_tokens`, monthly spend ceiling
- [ ] 4.7 `AI_ASSIST_ENABLED` kill switch hiding the panel and returning 503
- [ ] 4.8 `ai-generations` audit collection and the admin usage view
- [ ] 4.9 Admin assistant panel UI with the six fixed actions, async and non-blocking
- [ ] 4.10 Adversarial tests: injected instructions in drafts, missing-fact placeholders, oversize
      output, unknown action, anonymous call, PII exclusion
- [ ] 4.11 Redirect table populated from the old site's URLs; verify top inbound links return 301
- [ ] 4.12 Performance pass against budgets on `/`, `/spiele`, a game page, a player page
- [ ] 4.13 Accessibility pass: manual keyboard and screen-reader run; contrast audit
- [ ] 4.14 Security pass: CSP without `unsafe-inline`, dependency audit, admin rate limits,
      optional network restriction on `/admin`
- [ ] 4.15 Backup restore drill into a scratch environment; record elapsed time
- [ ] 4.16 Monitoring and alerting live: errors, uptime on three endpoints, disk and container metrics
- [ ] 4.17 Editor manual (DE) and one training session; two editors publish unaided
- [ ] 4.18 Production cutover: DNS, TLS, redirects verified, analytics verified, announcement post
- [ ] 4.19 Archive this change: `/opsx:archive`
