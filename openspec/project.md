# Project: bandy-bund.de Relaunch

## Purpose

Public website of the **Deutscher Bandy-Bund e.V. (DBB)** — the German national governing body
for bandy and rink bandy, founded June 2013, seated in Frankfurt am Main, member of the
Federation of International Bandy (FIB).

The site exists to serve five jobs, in priority order:

1. **Represent the federation and its squads** (Herren, Damen, future youth squads).
2. **Represent players** — a public, permanent, linkable identity per athlete.
3. **Represent games and tournaments** — the living calendar: what is next, what happened.
4. **Publish news and blog content** with a low-friction editorial workflow.
5. **Serve legally required and informational static pages.**

The primary conversion goal is **newsletter subscription**. There is no e-commerce, no ticketing
checkout, no member self-service in v1.

## Non-goals (v1)

- Online shop, ticket sales, payment processing.
- Public user accounts, logins, or profiles.
- Live match ticker / real-time score push.
- Automated result ingestion from FIB or third-party feeds (manual entry in v1).
- AI-generated imagery. Claude produces text only; all photography is real and human-supplied.
- Native mobile apps.

## Audience

| Audience | Primary need | Where they land |
| --- | --- | --- |
| Fans & local public (DE) | Next game, results, squad | `/`, `/spiele` |
| Players & their families | Player page, roster for a game | `/spieler/…`, `/spiele/…` |
| International federations, FIB, foreign clubs (EN) | Contacts, calendar, results | `/en/`, `/en/games` |
| Press | Match reports, media, contacts, logos | `/news`, `/presse` |
| Prospective members & sponsors | Who we are, how to join, partner info | `/verband`, `/mitgliedschaft` |
| Search engines & AI assistants | Structured, canonical, machine-readable facts | JSON-LD, sitemaps, `.ics`, `llms.txt` |

## Tech stack (decided)

- **Next.js 16** (App Router, React 19, Server Components) + **TypeScript strict** + **pnpm**
- **Payload CMS 3.88+** mounted in the same Next.js app at `/admin` — one repo, one image, one deploy
- **PostgreSQL 17** via `@payloadcms/db-postgres`
- **Tailwind CSS v4** with CSS custom properties as design tokens; Radix primitives for a11y
- **Lexical** rich text (Payload default)
- **Claude API (Anthropic Messages API)** behind a server-only route for editorial assistance
- **Docker Compose** on a single VPS/VDS: `app`, `postgres`, `caddy` (auto-TLS), `backup`
- **GitHub Actions** → GHCR image → SSH deploy; staging and production stacks
- Locales: **`de` (default, unprefixed)** and **`en` (`/en/…`)**

## Project conventions

- German is the source-of-truth locale. English is a derived translation.
- All public URLs use **German slugs** on `de` and **English slugs** on `en`. Slugs are localized
  fields, never derived at render time.
- Times are stored in **UTC**, displayed in **Europe/Berlin**, and exposed in ISO 8601 in JSON-LD.
- Every user-facing string lives in the CMS or in the i18n message catalog — never hardcoded in JSX.
- Every layout is composed from **blocks** (modules). A page template that cannot be re-composed by
  an editor is a bug, not a feature.
- Conventional Commits. Every PR title references an OpenSpec change id.
- No content type ships without: SEO fields, JSON-LD, a draft/publish state, and both locales.

## Glossary (bandy domain, DE ⇄ EN)

| DE | EN | Note |
| --- | --- | --- |
| Bandy | bandy | 11 v 11, football-pitch-sized ice, ball, 2 × 45 min |
| Rinkbandy | rink bandy | 6 v 6 on an ice-hockey-sized rink |
| Mannschaft / Auswahl | team / squad | e.g. Herren, Damen |
| Kader | roster / squad list | the pool of players for a season |
| Aufgebot | matchday roster | the selected players for one game |
| Spiel | game / match | |
| Spieltag | matchday | |
| Turnier / Wettbewerb | tournament / competition | |
| Freundschaftsspiel | friendly | `is_tournament_game = false` |
| Spielstätte | venue | |
| Torwart | goalkeeper | position code `TW` / `GK` |
| Verteidiger | defender | `VER` / `D` |
| Mittelfeldspieler | midfielder | `MF` / `M` |
| Stürmer | forward | `ST` / `F` |
| Rückennummer | jersey number | |
| Tore / Vorlagen | goals / assists | |
| Strafzeit | penalty time | |
| Deutscher Rinkbandy-Pokal | German Rink Bandy Cup | national competition run by the DBB |

## Facts to verify before launch

These are carried from public sources and **must be confirmed by the board**, not trusted:

- Current chairperson and board composition (Wikipedia lists Mikhail Entaltsev; may be stale).
- Registered address, Vereinsregister number and Registergericht for the Impressum.
- Photographer credit and licence for every existing player card image.

**Settled 23 August 2026:** hosting is a plain VPS/VDS — there is no VPN-only requirement for
`/admin`; the network restriction in `delivery-infra` stays available as an option, not an
obligation. The supplied player lists have been corrected by the board: the duplicate jersey
numbers and the squad assignment in the men's list are resolved. The import still reports every
ambiguity it finds rather than guessing — that requirement is about the importer's behaviour, not
about the current state of the data.
