# Proposal: relaunch-bandy-bund

## Why

The current bandy-bund.de does not serve the federation's five jobs. Content cannot be updated by
non-technical volunteers, the calendar and squads are not represented as structured data, the site
is not built mobile-first, and neither search engines nor AI assistants can extract who plays, when
the next game is, or what happened in the last one. There is no newsletter capture, so the
federation has no owned audience channel.

A relaunch is justified rather than an incremental fix: the required content model (teams, players,
games, rosters, tournaments) does not exist today in any form that can be migrated.

## What changes

- A new Next.js 16 + Payload 3 application replacing the existing site at the same domain.
- A modular block system so editors compose pages without developers.
- A complete sport content model: teams, seasons, players, staff, opponents, venues, games with
  optional per-game rosters, and tournaments with the `isTournamentGame` relation.
- An admin panel in German with drafts, versions, live preview, scheduled publishing and RBAC.
- A bounded Claude-powered editorial assistant for drafting, rewriting, translating and metadata —
  text only, never publishing on its own.
- Full DE/EN localization with localized slugs and hreflang.
- SEO and AI discoverability: server-rendered HTML, JSON-LD per entity, sitemaps, RSS, iCalendar
  feeds, public JSON endpoints, `llms.txt`.
- Legal compliance for a German e.V.: Impressum per § 5 DDG, privacy notice, consent gate per
  § 25 TDDDG, cookieless analytics, image credits, WCAG 2.2 AA.
- Newsletter capture with double opt-in as the primary call to action.
- Docker Compose deployment on the provided VPS/VDS with GitHub Actions CI/CD, backups and
  monitoring.

## Impact

| Capability | State |
| --- | --- |
| content-modeling | ADDED |
| page-composition | ADDED |
| team-roster | ADDED |
| fixtures-results | ADDED |
| tournaments | ADDED |
| editorial-news | ADDED |
| media-library | ADDED |
| navigation-static | ADDED |
| legal-compliance | ADDED |
| seo-discoverability | ADDED |
| ai-content-assist | ADDED |
| newsletter | ADDED |
| admin-rbac | ADDED |
| i18n | ADDED |
| delivery-infra | ADDED |

Everything is `ADDED`: this is a greenfield application replacing a site with no reusable model.
The only migration surface is URLs, handled by the redirect table in `navigation-static`.

## Release slices

The change is delivered in four slices, each independently deployable and each leaving the site in
a shippable state.

**Slice 1 — Skeleton (weeks 1–2).** Repo, CI, staging deploy, Payload with users and RBAC, pages
with five blocks, header/footer, legal pages, 404, sitemap, robots, analytics. Outcome: a real site
with real legal pages, live on staging.

**Slice 2 — Sport core (weeks 3–5).** Teams, seasons, players, staff, opponents, venues, games,
rosters, tournaments. Squad grid, player pages, fixture list, game pages, tournament pages.
Player import from the supplied card assets. JSON-LD for all sport entities. Outcome: the
federation's actual sporting content is live.

**Slice 3 — Editorial and reach (weeks 6–7).** Articles, categories, tags, galleries, documents,
search, RSS, iCalendar feeds, OG image generation, newsletter with double opt-in, contact form,
remaining blocks, EN locale. Outcome: the site can be run by volunteers and grows an audience.

**Slice 4 — Assistant and hardening (weeks 8–9).** Claude assistant with the six actions, quotas,
audit log and kill switch. Performance and accessibility passes, redirect table from the old site,
restore drill, production cutover. Outcome: launch.

## Risks and open questions

| Risk | Mitigation |
| --- | --- |
| Volunteer editors abandon the admin panel | German UI, live preview, a 6-page manual, one training session, and defaults that make an empty field impossible to publish badly |
| Player data drifts again as squads change | Import creates drafts and reports every ambiguity rather than guessing; jersey numbers are scoped to the matchday roster so normal squad churn never trips a constraint |
| Photo rights unclear for existing images | Credit and license fields are mandatory; publication is blocked without them |
| AI assistant invents facts | Grounding, `[[TBD]]` placeholders, schema-validated output, human publish gate, audit log |
| Single VPS is a single point of failure | Daily off-site backups, quarterly restore drills, documented rebuild procedure; scale-out is not needed at this traffic |
| Content readiness lags the build | Slice 2 needs real squads, Slice 3 needs real articles. Content collection starts in week 1, in parallel, not after the software is done |

## Settled

- **Hosting is a plain VPS/VDS.** No VPN-only requirement for `/admin`. The network restriction in
  `delivery-infra` remains an available option, not an obligation.
- **Player source data is corrected.** Duplicate jersey numbers and the men's-squad assignment are
  resolved by the board. The importer's ambiguity reporting stays specified regardless — it is about
  the importer's behaviour, not about today's data.

## Decisions still needed from the product owner

1. Domain and DNS control, and the cutover window.
2. Confirmed Impressum data (register number, court, board members).
3. Photographer credits and licenses for the existing player card images.
4. Transactional email sender domain and SPF/DKIM/DMARC ownership.
5. Whether match reports should carry a visible "mit KI-Unterstützung erstellt" note.
