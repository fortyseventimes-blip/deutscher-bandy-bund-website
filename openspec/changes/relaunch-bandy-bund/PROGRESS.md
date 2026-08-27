# Progress — relaunch-bandy-bund

Implementation status of the `relaunch-bandy-bund` change, tracked against `tasks.md` and the
capability impact table in `proposal.md`. Verified against the code in this repository.

Legend: ✅ done · 🟡 partial · ⬜ not started

_Last updated: 2026-08-27 (branch `main`; PRs #2 admin-rbac and #3 public-screens merged)._

## Summary

The Slice 1 skeleton (minus infra/CI and the consent engine) and the entire Slice 2 **presentation**
layer are in place. The public site — home, fixtures & results, match detail, squad, player and
tournament pages — is built and working, driven by a typed **fixtures data layer** (`src/lib/data`)
behind async accessors, so the CMS collections can be swapped in later without touching pages. RBAC,
the audit log, i18n routing, design tokens (dark **and** light) and the legal pages are done. Not yet
started: the real Payload sport collections, editorial/news, SEO surfaces, the AI assistant, and the
CI/deploy pipeline.

## Slice 1 — Skeleton

### Repository & tooling
- ✅ 1.1 Repo: Next.js 16, TypeScript strict, pnpm, Payload 3, Tailwind v4
- ⬜ 1.2 ESLint 9 / Prettier / lefthook / commitlint (Conventional Commits are followed by hand)
- 🟡 1.3 `openspec/` vendored into the repo ✅ · `openspec validate` in CI ⬜
- 🟡 1.4 Docker: dev database compose (`infra/compose.dev.yml`, Postgres only) ✅ · full multi-stage
  `Dockerfile` + `app`/`caddy`/`backup` stack ⬜
- ✅ 1.5 `.env.example` with every variable documented
- ⬜ 1.6 Branch protection on `main` / `production`

### CI/CD
- ⬜ 1.7 `ci.yml` (typecheck, lint, unit, build, e2e, openspec validate)
- ⬜ 1.8 `deploy-staging.yml`
- ⬜ 1.9 `deploy-production.yml`
- ⬜ 1.10 Provision staging VPS, TLS via Caddy, HSTS/CSP headers

### Foundations
- 🟡 1.11 `users` + seven roles + access-control helpers + session expiry + login rate-limit ✅ ·
  **2FA is a `twoFactorEnabled` flag only — no TOTP enrolment/verification yet** 🟡
- ✅ 1.12 `audit-log` collection + create/publish/delete/role-change/settings hooks
- ✅ 1.13 Localization: `de` default (unprefixed), `en` under `/en`; next-intl catalogues
- ✅ 1.14 Design tokens as CSS custom properties (incl. the **complete light-theme palette**),
  typography and spacing scales
- 🟡 1.15 `pages` collection with blocks: `HeroCompact`, `RichText`, `CTABanner`, `Divider` ✅ ·
  `MediaWithText` ⬜ (waits on the media collection)
- ✅ 1.16 `header` / `footer` globals; sticky translucent header; focus-trapped mobile drawer
- ✅ 1.17 `site-settings` and `seo-defaults` globals
- ✅ 1.18 Legal pages (Impressum, Datenschutz, Barrierefreiheit), seeded in both locales with
  `[[TBD]]` markers for board-confirmed register data
- ⬜ 1.19 Consent gate per § 25 TDDDG — only a locked map/video **placeholder component** exists on
  the match/tournament pages; there is no real banner, per-service persistence or footer revoke wiring
- ⬜ 1.20 Cookieless analytics
- ✅ 1.21 404 page and DB-independent 500 (`global-error`)
- 🟡 1.22 `sitemap.xml` / `robots.txt` / `llms.txt` ⬜
- 🟡 1.23 A11y baseline: skip link, focus styles, landmarks ✅ · axe in CI ⬜

## Slice 2 — Sport core

### Model
- ⬜ 2.1–2.7 Payload collections `seasons`/`venues`/`opponents`/`teams`/`players`/`staff`/`games`/
  `tournaments` and their validation are **not created as CMS collections**. By design, the model
  currently lives as TypeScript domain types + static fixtures behind one data-access layer
  (`src/lib/data/{types,fixtures,index}.ts`), so a Payload implementation can replace the accessor
  bodies without changing any page.

### Presentation
- 🟡 2.8 The modules are built as **pages/React components** (`MatchdayHero`, `FixtureRow` + list,
  `StandingsTable`, `MatchRoster`, `MatchTimeline`, `StatBars`, `Scoreboard`, `PlayerCard` grid,
  `HeroMedia`, `Countdown`, filters…) — but **not yet as editor-composable Payload blocks**
- ✅ 2.9 Routes `/teams`, `/teams/{slug}`, `/spieler/{slug}`, `/spiele`, `/spiele/{slug}`,
  `/turniere`, `/turniere/{slug}` (EN served on the same German segments — localized EN slugs
  deferred)
- ✅ 2.10 Squad filtering by position and name/number search, functional without JavaScript
- ✅ 2.11 Countdown with a no-JS date fallback; off-season/summer-break fallback for the hero
- ⬜ 2.12 JSON-LD (`SportsOrganization`, `SportsTeam`, `Person`, `SportsEvent`, `BreadcrumbList`)
- ⬜ 2.13 Per-entity revalidation tags

### Data
- ⬜ 2.14 Media collection (required alt/credit/license, AVIF/WebP derivatives)
- ⬜ 2.15 Player import from card assets
- ⬜ 2.16 Import-report review against the corrected source lists
- 🟡 2.17 Seasons/teams/venues/tournament seeded as **fixtures**, not CMS records

## Slice 3 — Editorial & reach
- ⬜ 3.1–3.16 Not started (the `NewsletterSignup` on the home page is presentational only)

## Slice 4 — Assistant & hardening
- ⬜ 4.1–4.19 Not started (Conventional Commits and the Claude attribution footer are in use)

## Capability status (proposal.md impact table)

| Capability | Status | Note |
| --- | --- | --- |
| content-modeling | 🟡 | `pages`/`users`/`audit-log` done; sport model as fixtures, not CMS |
| page-composition | 🟡 | 4 blocks + shared settings; full module catalogue built as pages |
| team-roster | 🟡 | screens on fixtures; no CMS/import |
| fixtures-results | 🟡 | fixtures list + standings on fixtures |
| tournaments | 🟡 | tournament-without-table screen on fixtures |
| editorial-news | ⬜ | |
| media-library | ⬜ | |
| navigation-static | 🟡 | header/footer/nav/404/500 done; search, redirects, some static pages pending |
| legal-compliance | 🟡 | legal pages + a11y baseline; consent engine + analytics pending |
| seo-discoverability | ⬜ | no JSON-LD / sitemap / feeds yet |
| ai-content-assist | ⬜ | |
| newsletter | ⬜ | presentational form only |
| admin-rbac | ✅ | 2FA TOTP still pending |
| i18n | 🟡 | routing + catalogues done; localized slugs + full EN pending |
| delivery-infra | 🟡 | dev compose done; prod Docker / CI / deploy pending |

## Known live issues
- **Nav 404s:** the header/footer link to `/verband`, `/kontakt`, `/mitgliedschaft`, `/news`,
  `/galerie`, `/newsletter`; none of these are built or seeded yet, so those menu items 404. Fixed by
  building the static/editorial pages (Phase A/C) or trimming the nav.
- **EN localized slugs deferred:** coded routes reuse the German segments under `/en/` (e.g.
  `/en/spiele`); fully localized EN slugs (`/en/games`) are explicitly deferred in `src/lib/routes.ts`.

## Phased plan for the remaining work

- **Phase A — polish:** light-theme toggle in the header + QA (tokens already complete) · static
  pages for Verband/Kontakt/Mitgliedschaft/News so the nav stops 404ing · full EN localized slugs.
- **Phase B — real data (Slice 2):** Payload collections behind the existing data-access layer ·
  media with alt/credit/license · player import · JSON-LD · publish-triggered revalidation.
- **Phase C — editorial & reach (Slice 3):** articles/news, categories/tags, galleries, search,
  newsletter double opt-in, contact form, RSS, iCal, OG images.
- **Phase D — infra & launch (rest of Slice 1 + Slice 4):** consent gate, cookieless analytics,
  sitemap/robots/llms, CI, production Docker + VPS deploy, AI assistant, perf/a11y/security passes,
  backups, monitoring, redirect table.

Recommended order A → B → C → D; the Docker/CI slice of D can be pulled forward if a public URL is
needed sooner.

## Decisions locked
- **Stack:** Payload CMS 3.88+ mounted inside Next.js 16; PostgreSQL 17; Tailwind v4; one repo / one
  image / one deploy on the provided VPS/VDS via Docker Compose + Caddy.
- **Hosting:** plain VPS/VDS; no VPN-only requirement for `/admin`.
- **Locales:** German source (unprefixed), English derived (`/en/`). Localized EN slugs deferred.
- **Scope:** federation with multiple squads (Herren, Damen; room for youth and member clubs later).
- **AI assist:** Claude text only — six fixed actions, no free-form prompt, no image generation,
  draft-only output, human publish gate.
- **Public accounts:** none in v1; newsletter preferences run on signed token links.
- **Primary CTA:** newsletter subscription.
- **Player source data:** corrected by the board (duplicate jersey numbers and men's-squad
  assignment resolved).

## Open before launch
1. Domain/DNS control and the cutover window.
2. Impressum data: Vereinsregister number, Registergericht, board members.
3. Photographer credits and licenses for the existing player-card images.
4. Sender domain for transactional email plus SPF/DKIM/DMARC.
5. Whether AI-assisted articles should carry a visible note.
6. Current board and chairperson — public sources may be stale; do not copy them into the Impressum.
