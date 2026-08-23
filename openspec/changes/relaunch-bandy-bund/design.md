# Design: relaunch-bandy-bund

## Architecture

One Next.js 16 application. Payload 3 is mounted inside it, so the admin panel, the content API and
the public site are the same process, the same repository, the same Docker image and the same
deployment. There is no separate CMS service to keep in sync, no CORS layer, and no second set of
credentials.

```
┌──────────────────────────── VPS / VDS ────────────────────────────┐
│                                                                    │
│  caddy  ──TLS, HSTS, CSP, rate limit──┐                            │
│                                       │                            │
│                             ┌─────────▼─────────┐                  │
│                             │  app (Next.js 16) │                  │
│                             │  ├── /            │  public site     │
│                             │  ├── /admin       │  Payload panel   │
│                             │  ├── /api/…       │  Payload REST    │
│                             │  └── /api/ai/…    │  Claude proxy    │
│                             └────┬─────────┬────┘                  │
│                                  │         │                       │
│                        ┌─────────▼──┐  ┌───▼──────────┐            │
│                        │ postgres 17│  │ media volume │            │
│                        └─────────┬──┘  └───┬──────────┘            │
│                                  │         │                       │
│                             ┌────▼─────────▼────┐                  │
│                             │ backup (restic)   │ ──► off-site     │
│                             └───────────────────┘                  │
│                                                                    │
│  plausible (cookieless analytics)   uptime-kuma                    │
└────────────────────────────────────────────────────────────────────┘
                     │
                     └──► api.anthropic.com   (server-side only, egress)
```

## Key decisions

### D1 — Payload 3 over Directus, Strapi or WordPress

Payload's block field maps one-to-one onto the modular requirement: an editor's page is literally a
typed array of blocks, and each block is a React component in the same codebase. Drafts, versions,
live preview, localization and field-level access control are core, not plugins. One deploy target
matters more than feature breadth for a volunteer-run federation on a single VPS.

Rejected: Directus (excellent admin GUI, but page composition and live preview become custom work);
Strapi (two services, i18n and versioning partly commercial); WordPress headless (weakest typed
module story, largest maintenance surface).

### D2 — German is the source locale, English is derived

Localized fields including slugs. English falls back to German with `noindex` when a translation is
missing, rather than showing an empty page or a machine translation nobody reviewed.

### D3 — Games reference sides polymorphically

A game's home and away side each reference either a `teams` document (a DBB squad) or an
`opponents` document (everyone else). This keeps the model honest for neutral-venue tournament
games where the federation is the away side, and avoids a fake "our team" boolean.

`isTournamentGame` is a stored boolean rather than derived from the presence of a tournament
relation, because the brief treats it as an editorial decision and because a game can belong to a
tournament's schedule without counting toward it.

### D4 — Roster is a per-game array, not a join table

The matchday roster lives as an array field on the game: player reference, jersey number for that
game, position, starter flag, captain flag, plus optional goals and assists. Jersey number is stored
per roster entry, not read from the player, because numbers change between seasons and the player
list already contains repeats. Uniqueness is enforced within one roster only.

### D5 — Season-scoped team membership

Players relate to teams through a `memberships` array (team, season, from, to) rather than a single
team field. The squad page for a season is a query over memberships. Alumni keep their pages.

### D6 — The AI assistant is a proxy with a closed action catalogue

`/api/ai/[action]` is a server route. The browser sends an action id, an entity id and a short
brief. The server assembles the system prompt, the fact block and the fenced untrusted content,
calls the Anthropic Messages API with a pinned model, validates the response against a Zod schema,
and writes it into a draft. There is no path from the browser to the model.

```
admin UI ──{action, entityId, brief, tone}──► /api/ai/[action]
                                                 │ authz: session + ai:use
                                                 │ quota + budget check
                                                 │ build system prompt (versioned template)
                                                 │ build fact JSON from allowlisted fields
                                                 │ fence user text in <untrusted_content>
                                                 ▼
                                          Anthropic Messages API (pinned model)
                                                 │
                                                 ▼
                                          Zod validate → sanitize → cap
                                                 │
                                                 ▼
                                    draft version, reviewState=needs_review,
                                    aiAssisted=true, row in ai-generations
```

Prompt templates are versioned files in the repo (`ai/prompts/<action>.v1.ts`). Changing a prompt is
a pull request, and the version is recorded in the audit row so any output can be traced to the
exact instructions that produced it.

### D7 — Revalidation over rebuilds

Pages are statically rendered where possible and revalidated by tag. Payload `afterChange` hooks
call `revalidateTag` for the affected entity and its listings. Publishing a result updates the home
page within seconds without a deployment and without server-rendering every request.

### D8 — Cookieless analytics to keep the consent banner honest

A self-hosted, cookieless, IP-anonymizing analytics service means the banner is only about embeds
and maps. Rejecting consent then costs the federation nothing, which is what makes a genuinely
equal "Ablehnen" button politically possible.

### D9 — Manual results, no feed ingestion

Bandy result feeds are not reliably machine-readable. Manual entry with a fast editor form is
cheaper and more accurate than a scraper that silently breaks. Revisit if FIB publishes an API.

## Data model

```
seasons ──┐
          ├──< memberships >── players ──< rosterEntries >── games
teams ────┘                                                    │
   │                                                           ├── venues
   │                                                           ├── tournaments
   └──< games (home/away polymorphic) >── opponents            └── galleries

pages ──< blocks >                articles ──< blocks >
media ── galleries, documents     partners, subscribers, form-submissions
users ── roles                    ai-generations, audit-log, redirects
globals: site-settings, header, footer, seo-defaults
```

### Field notes worth arguing about now, not later

- `players.slug` is localized but SHOULD be identical in both locales for people's names.
- `games.kickoff` is a UTC timestamp. Never store a local time.
- `games.status` drives everything visible: no score is rendered unless `finished`.
- `media.credit` and `media.license` are required. This is the cheapest possible insurance.
- `articles.aiAssisted` and `players.aiAssisted` exist so the board can audit what was drafted with
  the assistant, independent of the AI usage log.

## URL scheme

| DE | EN | Entity |
| --- | --- | --- |
| `/` | `/en` | home |
| `/news`, `/news/{slug}` | `/en/news/{slug}` | articles |
| `/news/kategorie/{slug}` | `/en/news/category/{slug}` | category archive |
| `/teams`, `/teams/{slug}` | `/en/teams/{slug}` | teams |
| `/spieler/{slug}` | `/en/players/{slug}` | players |
| `/spiele` | `/en/games` | fixtures + results |
| `/spiele/{yyyy-mm-dd}-{home}-{away}` | `/en/games/{…}` | game |
| `/turniere`, `/turniere/{slug}` | `/en/tournaments/{slug}` | tournaments |
| `/verband`, `/mitgliedschaft`, `/kontakt` | `/en/federation`, `/en/membership`, `/en/contact` | pages |
| `/galerie`, `/galerie/{slug}` | `/en/gallery/{slug}` | galleries |
| `/impressum`, `/datenschutz`, `/barrierefreiheit` | `/en/imprint`, `/en/privacy`, `/en/accessibility` | legal |
| `/suche` | `/en/search` | search |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/feed.xml`, `/spiele.ics` | — | machine surfaces |

## Testing strategy

- **Unit (Vitest)** — slug generation, roster validation, iCal serialization, JSON-LD builders,
  AI response schemas, quota accounting.
- **Integration** — Payload access control per role against a real Postgres, in a matrix: for each
  role × each collection × each operation, assert allow or 403.
- **End-to-end (Playwright)** — publish an article and see it live; enter a result and see the home
  page update; compile a roster and see it on the player page; subscribe and confirm a newsletter
  address; reject the consent banner and assert zero third-party requests.
- **Accessibility** — axe-core on every page template, plus one manual keyboard pass per slice.
- **Performance** — Lighthouse CI budgets on `/`, `/spiele`, a game page and a player page.
- **Spec** — `openspec validate --strict`.

## What could go wrong

- **The block catalogue grows without discipline.** Every new block is a maintenance cost forever.
  Rule: a new block requires an OpenSpec change; a variant of an existing block requires a setting.
- **Editors publish without alt text or credits.** Prevented by validation, not by training.
- **The assistant becomes a chat box.** The action catalogue is closed by design; adding an action
  is a spec change, and a free-text prompt field is explicitly out of scope.
- **Nobody restores a backup until the day they need it.** The quarterly drill is a task with an
  owner, not an aspiration.
