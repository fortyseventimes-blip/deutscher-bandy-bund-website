# Handoff: Bandy-Bund Website (Deutscher Bandy-Bund e.V.)

## Overview
Complete design set for the public website of a small German national sports federation (Bandy — 11-a-side ice sport on a football-sized field). The site serves four audiences: fans checking fixtures and results, journalists looking for squads and match facts, potential players looking for a way in, and clubs/officials needing documents.

Delivered screens: home page (5 hero states), squad list + player detail, fixtures & results, match detail with match roster, tournament detail, plus a component sheet and variant board (light theme, English navigation).

Language: German (`lang="de"`), with an English variant of the header/nav documented. Season shown: 2026/27, key date 16.01.2027.

## About the Design Files
The files in this bundle are **design references authored as HTML** — prototypes that show intended look, structure, states, and behavior. They are **not production code to copy**. The task is to **recreate these designs in the target codebase's own environment** (Next.js/React, Nuxt, Astro, Rails views, a CMS theme — whatever exists) using its established routing, component, and styling patterns. If no codebase exists yet, pick the framework that fits a content-driven, largely static site with a small amount of live data (fixtures/live score) — a static-first framework with incremental data fetching is the natural fit.

Two implementation notes that matter more than the markup:

- The prototypes use inline styles exclusively (a constraint of the prototyping environment). In the real codebase, convert these to the project's styling system (CSS modules, Tailwind, styled-components…) and hoist the repeated values into the tokens listed under **Design Tokens**.
- Repetition in the prototypes (nav, footer, fixture row, scoreboard) is intentional duplication for previewability. In production these are single components — see **Component Inventory**.

## Fidelity
**High fidelity.** Colors, typography, spacing, radii, states and copy are final-intent. Recreate pixel-close at the two documented breakpoints (desktop 1440, mobile 390) using the codebase's own primitives. All German copy in the prototypes is usable as real copy; it was written for this purpose (no lorem ipsum). Numbers, names and results are plausible placeholders — they must come from the real data source.

Deliberately out of scope: no real photography (all imagery sits in labelled drop-slots), no icon set (a handful of typographic glyphs stand in — see **Assets**), no CMS field modelling.

---

## Design Tokens

### Colors — dark theme (default)
| Token | Hex | Use |
|---|---|---|
| canvas | `#07090B` | Page background outside content |
| surface | `#0B0D0F` | Section background, lists |
| surface-raised | `#14181C` | Header, panels, alternating sections |
| surface-card | `#1D232A` | Cards, active chips, table zebra |
| line | `#2A323A` | All borders and dividers |
| text-muted | `#98A3AD` | Secondary text, meta |
| accent-ice | `#C9E4F0` | Cool labels, competition chips, logo ring |
| text | `#F4F7F9` | Primary text |
| red | `#DD0000` | Primary action, live, breadcrumb separators, left accent |
| red-light | `#FF4D4D` | Links, loss state, jersey numbers |
| yellow | `#FFCC00` | Kicker labels, captain mark, focus ring, postponed |
| green | `#2FBF71` | Win, goal |
| live-row-bg | `rgba(221,0,0,.10)` | Highlighted row (live match, Germany in table) |

Header uses `rgba(20,24,28,.92)` (translucent, for sticky over content).

### Colors — light theme variant
| Token | Hex | Use |
|---|---|---|
| l-surface | `#FFFFFF` | Page/base |
| l-surface-raised | `#EDF2F5` | Hero, secondary bands |
| l-line | `#D3DCE3` | Borders |
| l-text | `#0B0D0F` | Primary text |
| l-text-muted | `#5A6670` | Meta text |
| l-yellow-text | `#8A6A00` | Kicker/label text (yellow is **never** text on white) |
| l-ice | `#1F5F7D` | Competition chip text |
| l-green | `#1E8F52` | Win |
| l-red-loss | `#C42B2B` | Loss |
| l-yellow-fill | `#E0B400` | Postponed accent line |
| l-row-live | `#FDECEC` | Live row background |
| l-row-planned | `#F5F9FB` | Scheduled row background |
| l-row-moved | `#FFFDF5` | Postponed row background |

Rules: `#DD0000` is unchanged across themes. Yellow becomes fill-only; its text equivalent is `#8A6A00`. Green/loss/ice are darkened to clear 4.5:1 on white. The **footer stays dark** (`#0B0D0F`) in the light theme. Cut-out player portraits need a flat light-grey plate instead of the dark radial glow.

### Typography
Two families, loaded from Google Fonts:
- **Barlow Condensed** — 600/700/800. All headings, team names, scores, jersey numbers, section labels. Always `text-transform: uppercase`.
- **Inter** — 400/500/600. Body, meta, UI labels, buttons, chips.

| Role | Desktop | Mobile | Notes |
|---|---|---|---|
| H1 page title | Barlow Condensed 700, 56/60, `letter-spacing:-.01em` | 32/36 | uppercase |
| H1 player/tournament | 88/82 (player surname), 64/66 (tournament) | 44/44 | `letter-spacing:-.02em` |
| H2 section | Barlow Condensed 700, 40/44, `-.01em` | 26/30 | uppercase |
| H3 | Barlow Condensed 700, 28–32 / 32–36 | 24/28 | uppercase |
| Month header (fixture list) | Barlow Condensed 800, 26/28, `+.02em` | 20/22 | uppercase, sticky |
| Team name in row | Barlow Condensed 700, 26/30 | 20/24 | uppercase |
| Score | Barlow Condensed 800, 88/1 (scoreboard), 26/30 (row) | 44/1, 26/28 | tabular-nums |
| Kicker | Inter 600, 13/16, `+.08em` | 12/16 | uppercase, `#FFCC00` |
| Body L | Inter 400, 18/30, `max-width:66ch` | 17/27 | `text-wrap: pretty` |
| Body / meta | Inter 400–500, 15/24 | 15/24 | `#98A3AD` |
| Small meta | Inter 400–500, 13/18 | 12/16 | |
| Nav item | Inter 600, 15/20, `+.04em` | 16/22 | uppercase (EN: 14/18, gap 20px) |
| Button | Inter 600, 15/20, `+.04em` | same | uppercase |
| Chip | Inter 600, 13/16, `+.04em` | same | uppercase |
| Badge | Inter 600, 11/14, `+.06em` | 10/13 | uppercase |
| Table head | Inter 600, 11/14, `+.08em` | 10/13 | uppercase, `#98A3AD` |

Every number (dates, times, scores, table values, attendance, jersey numbers) carries `font-variant-numeric: tabular-nums`.

### Spacing scale
`8` chip padding / icon gaps · `16` mobile page gutter, card grid gap · `24` card padding, desktop grid gap · `40` block spacing inside a section · `64` desktop section spacing · `80` desktop page gutter.

Content column is capped at `max-width: 1280px`, centered, inside the 1440 frame.

### Radii
`4px` tag · `8px` button, input, small tile · `12px` card, panel, section container · `999px` chip, avatar, pill.

### Other
- No box shadows anywhere. Elevation is expressed by surface color + 1px `#2A323A` border.
- Accent bars: `border-left: 3px solid <status color>` on rows and callouts; `border-top: 3px solid` on team panels; radius then becomes `0 12px 12px 0`.
- Focus ring: `outline: 2px solid #FFCC00; outline-offset: 3px` (2px on inputs).
- Minimum hit target 44×44.
- `@media (prefers-reduced-motion: reduce)` disables all animation/transition.
- Scrollbars styled 6px, thumb `#2A323A`.

### Status color mapping (used across fixture rows, timelines, tables)
| Status | Accent | Label color |
|---|---|---|
| Win | `#2FBF71` | `#2FBF71` |
| Draw | `#98A3AD` | `#98A3AD` |
| Loss | `#FF4D4D` | `#FF4D4D` |
| Scheduled | `#C9E4F0` | `#C9E4F0` |
| Live | `#DD0000` + row bg `rgba(221,0,0,.10)` | `#FF4D4D` |
| Postponed / cancelled | `#FFCC00` | `#FFCC00`; team names drop to `#98A3AD`, score becomes `—` |

---

## Screens / Views

### 1. Home page — `Startseite.dc.html`
Desktop 1440 and mobile 390. Hero has **five states**, switchable via prop: upcoming match (default), live, finished, postponed, summer break. Contains: sticky header, hero with live countdown to 16.01.2027, news teasers, squad teaser, newsletter block, footer, and a cookie banner.

Decisions baked in: on mobile the footer reserves space beneath the cookie sheet so legal links stay reachable while the sheet is open. All image areas are drop-slots.

### 2. Squad & player detail — `Kader.dc.html`
- **2a Squad, desktop**: compact hero (breadcrumb, team name, season, count, coach), team switch chips (Herren/Damen/Nachwuchs), position filter chips with counts, sort note; 4-column card grid of players (`aspect-ratio: 3/4`); staff section (3 cards); CTA banner; footer. Player card: cut-out portrait with a huge ghost jersey number behind it (`rgba(244,247,249,.08)`, 150px), bottom bar with number in `#FF4D4D` 34px, first name small grey, surname 24px condensed, position pill right.
- **Zero-results state**: active filter chip turns yellow-outlined with `· 0 ✕`, dashed-border empty panel with headline, explanation, reset button.
- **2b Squad, mobile**: chip rows become horizontal scrollers; **2-column** card grid; “Weitere N anzeigen” secondary button (initial page = 6 players).
- **2c Player detail, desktop**: split hero — 440px portrait column (portrait stands on the baseline, 280px ghost number behind) next to name block (first name 18px, surname 88px), status pills (number/position/captain), three 56px stat figures in `#FFCC00`. Below: bio prose column (66ch) plus a `Steckbrief` key-value panel with zebra rows. Then “Letzte Spiele” list, then “Weitere Spieler” 4-up.
- **2d Player detail, mobile + special cases**: stacked hero, 3-up stat strip with dividers; **no-portrait fallback** (radial glow + 170px number) and **no-biography fallback** (dashed panel explaining the text is missing).

Players without a portrait are a first-class case, not an error: the card/hero shows a large jersey number over a cool radial glow.

### 3. Fixtures & results — `Spielplan.dc.html`
- **3a Desktop**: hero with “next match” callout (red left accent); filter block — team chips row, then competition chips + `Nur Ergebnisse` / `Nur kommende` + season dropdown + “iCal abonnieren”. Fixture list grouped by month with **sticky month headers** (`position:sticky; top:0; z-index:2`, background `#0B0D0F`, bottom border). Row grid: `96px 150px 1fr 150px 220px 24px` = date block / competition badge / teams+score / status / venue / chevron; 3px status accent on the left. Legend of the five status colors. Then standings table: header row `#1D232A`, columns `64px 1fr 72px 72px 72px 72px 120px 96px 88px` (Pl., Mannschaft, Sp, S, U, N, Tore, Diff., Punkte); Germany's row is highlighted (`rgba(221,0,0,.10)`, gold text); a 3px zone bar left of the position marks qualification (`#2FBF71`) or relegation (`#FFCC00`); goal difference is colored; legend below.
- **3b Mobile**: chip scrollers; sticky month header on `#14181C`; fixture rows stack home/away vertically with the score right and status/venue as one small line; compact standings (`34px 1fr 40px 60px 48px` = Pl./Team short/Sp/Diff./Pkt) with a note that the full table is on desktop.
- **3c States**: row variants (live, draw, scheduled, postponed with new date, cancelled with reason), filter-with-no-results panel (reset + “notify me”), and a pre-season table with all zeros and an explanatory footer row.

### 4. Match detail — `Spiel-Detail.dc.html`
- **4a Desktop**: scoreboard band on `#14181C` with a red radial glow from the top; three-column layout (home right-aligned + 72px crest circle / score column / away). Crest circles are placeholders: 72px, bordered in the team accent, 3-letter code inside. Score 88px; live pill above it; status line below (`Endstand` / `2. Halbzeit` / `Anpfiff Ortszeit`); halftime score line. CTA row centered (tickets only in preview state). Tab bar (Übersicht / Aufstellung / Ticker / Statistik / Galerie) with a 2px red underline on the active tab.
  Body: two columns — timeline (`64px 20px 1fr`: minute, square marker, title + running score + detail) plus match report prose and a red-bordered pull quote; sidebar with statistics bars (two-tone `#FFCC00` / `#2A323A`, 6px, flex-weighted to the values), a `Spielinfo` key-value panel, and a **blocked map placeholder** with a “Karte laden” button.
  **MatchRoster**: two team panels side by side, each with a 3px top accent (`#FFCC00` home, `#C9E4F0` away), team header (crest, name, coach, formation), then position groups (Torwart / Verteidigung / Mittelfeld / Sturm) as labelled subheaders on `#14181C`, then player rows `44px 1fr auto` (number right-aligned, first+last name, captain `C` in gold, event tags right). Event tags: goal = green fill, assist = ice fill, penalty = yellow fill, all with `#0B0D0F` text; rows carrying a tag get `#1D232A` background. Bench listed as one text line. Legend above the panels.
  Then gallery mosaic (2fr 1fr 1fr × two 340px rows — see the implementation note below), and a “next match” CTA band.
- **4b Mobile**: crest+name stacked in three columns, 44px score, chip tab scroller, timeline `44px 12px 1fr`, roster with a two-button team switch above a single panel, stats bars, 3-image gallery block with a “+10” overlay.
- **4c Scoreboard states**: preview (kickoff time instead of score, “Anpfiff in 4 Tagen”), live (red top accent, live pill with minute, auto-refresh note), postponed (grey team names, `—` score, gold status), plus a “lineup not yet submitted” empty state.

Implementation note: in the prototype the gallery grid needed explicit row heights (`grid-template-rows: 340px`, per-cell heights, `min-height: 0`) because the drop-slot placeholders have an intrinsic height. With real `<img>` elements this collapses to a normal `aspect-ratio` grid.

### 5. Component sheet — `Komponentenblatt.dc.html`
Reference board, not a page: **5a** palette swatches, type scale with specs, spacing scale, radii, image-slot kinds; **5b** buttons in four states each (rest/hover/focus/disabled) for primary/secondary/ghost, filter chips (6 states), badges and status marks, pagination, breadcrumbs incl. truncation rule; **5c** form fields (rest/focus/error/select/textarea with counter/checkboxes) and the newsletter module in four states (rest, sending, success with double-opt-in wording, error); **5d** news cards (with and without image), document list, accordion, RichText styles (subhead, inline link, bold, italic, dash bullets, pull quote, caption), and table/list row states; **5e** mobile drawer nav, search overlay (with results and a no-results block), cookie sheet, 404 page.

### 6. Gallery, lightbox & embeds — `Module-Galerie-Embeds.dc.html`
- **6a** Gallery: desktop mosaic (2×2 lead tile + four tiles, last one carrying a “+8” overlay), caption over a bottom gradient, keyboard hint; mobile carousel with 280px slides, a peeking next slide, progress dashes and caption; empty state (“Bilder folgen nach dem Spiel”).
- **6b** Lightbox: desktop overlay `rgba(7,9,11,.97)` — top bar (title, “Bild 3 von 12”, download/fullscreen/close as 44px targets), 56px round prev/next, image area uses `object-fit: contain`, caption + credit, thumbnail strip with the active thumb outlined in `#FFCC00`; mobile lightbox; image-failed-to-load state.
- **6c** Consent: VideoEmbed blocked (what YouTube loads, “Video laden” + “Immer erlauben”, privacy link, duration) and allowed (poster + play button + revoke link); MapBlock blocked **with a text fallback of the actual directions** and allowed (map + marker + zoom + OSM attribution); a per-service consent management list with toggles (necessary = always on and locked).

Consent rules to carry into the implementation: nothing third-party loads before consent; each embed asks per instance; “Immer erlauben” persists per service; every blocked embed offers an equivalent (address text, external app link); revocation is reachable from the footer (“Cookie-Einstellungen”).

### 7. Variants — `Varianten.dc.html`
- **7a** Light theme applied to the fixtures page, with the token mapping table and the contrast rules listed above.
- **7b** English navigation: longer labels force nav gap 28→20px, wordmark 22→20px, buttons 15→14px, and the drawer breakpoint moves up (collapse below ~1280px instead of ~1100px). Includes the English mobile drawer and a DE→EN glossary (Spielplan & Ergebnisse → Fixtures & Results, Kader → Squad, Länderspiel → International friendly, WM-Qualifikation → World Championship qualifier, Rückennummer → Shirt number, Strafzeit → Penalty time, Verlegt/abgesagt → Postponed/cancelled). Proper nouns stay German. EN date format `16 Jan 2027`, time `2:00 pm CET`.
- **7c** Tournament detail **without a table**: photo hero with a left-to-right dark gradient, format kicker, dates/venue/counts meta row, ticket CTAs; day-grouped schedule (Saturday semi-finals, Sunday third-place + final) where unresolved fixtures read “Sieger HF1 / Verlierer HF2” in grey with a `Teilnehmer offen` tag; a “Format” explainer with rule pills; participants panel (host row highlighted); on-site info panel with blocked map; a yellow-accented weather caveat.

---

## Component Inventory
Build these once; every screen composes them.

| Component | Props / variants |
|---|---|
| `SiteHeader` | `lang` (de/en), `activeNav`, sticky, translucent; desktop nav + mobile hamburger |
| `DrawerNav` | open/closed, expandable group (active group gets `#1D232A` background, `−` chevron, gold label) |
| `SearchOverlay` | query, results, empty state |
| `Breadcrumbs` | items; red `·` separators; mobile truncation to `…` |
| `HeroCompact` | kicker, title, meta line, optional right-hand callout card |
| `HeroMedia` | image slot, gradient direction, overlay content (tournament, home) |
| `Chip` | active / secondary-active / rest / hover / zero-results / disabled; optional count suffix |
| `Button` | primary / secondary / ghost × rest / hover / focus / disabled |
| `Badge` | competition (ice), number (red), role (gold), live (red + dot) |
| `StatusTag` | win / draw / loss / scheduled / live / postponed |
| `FixtureRow` | desktop grid + mobile stacked; status accent, optional live pill, venue, chevron |
| `MonthHeader` | sticky, label + count |
| `StandingsTable` | full and compact; highlight row, zone bars, colored diff, legend; empty (pre-season) variant |
| `Scoreboard` | result / live / preview / postponed; crest placeholder, score, status, CTA row |
| `MatchTimeline` | events with minute, marker color, title, running score, detail |
| `StatBars` | label + two values, flex-weighted bars |
| `MatchRoster` | two panels (desktop) / switcher (mobile); position groups, captain, event tags, bench; “not yet submitted” state |
| `PlayerCard` | with portrait / without portrait (ghost number) |
| `KeyValuePanel` | header + zebra rows (Steckbrief, Spielinfo, Vor Ort) |
| `NewsCard` | with image / text-only |
| `DocumentList` | file type chip, name, size/pages, download affordance |
| `Accordion` | open/closed |
| `RichText` | subhead, links, bold, italic, dash list, pull quote, caption |
| `Gallery` | desktop mosaic / mobile carousel / empty |
| `Lightbox` | open, index, thumbnails, error |
| `ConsentGate` | blocked / allowed, per-service persistence, text fallback slot |
| `NewsletterForm` | rest / sending / success / error |
| `Pagination` | numbers + ellipsis / mobile “load more” |
| `CookieSheet` | accept all / necessary only / settings; mobile reserves footer space |
| `CTABanner`, `SiteFooter`, `NotFound` | — |

---

## Interactions & Behavior
- **Hero state machine** (home): `upcoming | live | finished | postponed | summer-break`. Drives headline, score/countdown, CTA set, accent color. Derive from fixture data + server time, not from a manual flag.
- **Countdown** to the next fixture (16.01.2027 in the prototype): days/hours/minutes; stops at kickoff and flips the hero to `live`.
- **Live match**: red row highlight + live pill with the current minute; ticker states it refreshes every 30 s. Use polling or SSE; the pulsing dot must be suppressed under `prefers-reduced-motion`.
- **Filters** (squad, fixtures): chips are toggles reflected in the URL query so a filtered view is linkable; counts come from the filtered dataset; a zero-result filter shows the dedicated empty panel with a reset action, never an empty list.
- **Sticky month headers**: one header per month group, sticks under the site header.
- **Mobile paging**: squad shows 6, “Weitere N anzeigen” appends; fixtures load older matches on demand; desktop uses numbered pagination where lists are long (news).
- **Roster team switch** (mobile): two-state segmented control, no page reload.
- **Gallery → lightbox**: click opens at the clicked index; arrows and ←/→ navigate; Esc closes; focus is trapped inside; focus returns to the originating thumbnail on close; mobile supports swipe; image errors show the retry panel.
- **Consent**: no third-party request before consent; “Video laden” loads that one embed, “Immer erlauben” persists the service; revoke link on the freed embed and via the footer.
- **Newsletter**: double opt-in; states rest → sending (disabled button) → success (“Bestätigungsmail geschickt”) or error (already-subscribed message with “Neu bestätigen”).
- **Forms**: validate on blur and on submit; error shows a red border plus a text message naming the fix; privacy checkbox is required; textarea has a 1200-character counter.
- **Responsive**: two authored breakpoints (1440 desktop, 390 mobile). Nav collapses to the drawer below ~1100px German / ~1280px English. Squad grid 4 → 2 columns. Fixture rows switch from a 6-column grid to a stacked card. Standings drop to 5 columns. Content gutters 80 → 16px.
- **Accessibility**: keyboard focus ring `#FFCC00`; 44px minimum targets; scores and statuses must be readable without color (labels are always present); tables need proper `<th scope>`; the live region for the ticker should be `aria-live="polite"`; skip link to main content.

## State Management
Local/UI state: hero state (derived), countdown tick, active filters (URL-synced), mobile page size, drawer open, search open + query, lightbox open + index, tab selection, roster team selection, accordion open, consent map per service (persisted), cookie decision (persisted), newsletter form state.

Data needed from the backend/CMS: teams; players (number, first/last name, position, captain flag, club, birth year, debut, caps/goals/assists, optional portrait, optional bio); staff; fixtures (date, time, competition, home/away, score, status, venue, live minute, postponed-to, cancellation reason); standings rows (may be absent — tournament pages must render without them); match details (events, statistics, referee, attendance, weather, lineups incl. bench, gallery); tournaments (format, day-grouped schedule with placeholder participants, teams, on-site info); news; documents; static pages.

Note that **absence is the normal case** in this domain: no portrait, no bio, no lineup yet, no table for this competition, no photos yet, participants not yet known. Every one of these has a designed state — model the fields as optional and render the designed fallback rather than hiding the module.

## Assets
- **Fonts**: Barlow Condensed (600/700/800) and Inter (400/500/600), Google Fonts. Self-host in production.
- **Photography**: none supplied. Every image area is a labelled drop-slot describing what belongs there: news 16:9, cut-out player portraits 3:4 (standing on the baseline, transparent background), match photos, gallery tiles, tournament hero, video poster, map tiles. Cut-out portraits are the only art-directed requirement; the design depends on them being transparent PNGs.
- **Crests/logos**: placeholders only — a bordered circle with a 3-letter country code, and a `DBB` monogram circle with a red dot for the federation. Replace with real marks.
- **Icons**: intentionally none. The prototypes use typographic stand-ins (`⌕` search, `‹ ›` navigation, `✕` close, `▾` select, `↓` download, `▶` play, `⤢` fullscreen, `+ −` zoom, `✓` checkbox, `—` list bullets). Substitute a real icon set at 20–24px, keeping the 44px target.

## Files
Design references in this bundle (open any of them in a browser):

| File | Contents |
|---|---|
| `Startseite.dc.html` | Home page, desktop + mobile, 5 hero states, cookie banner, countdown |
| `Kader.dc.html` | Squad list (desktop 2a / mobile 2b), player detail (2c / 2d), no-portrait and no-bio cases |
| `Spielplan.dc.html` | Fixtures & results (3a desktop / 3b mobile), row + empty states, standings (3c) |
| `Spiel-Detail.dc.html` | Match detail (4a desktop / 4b mobile), MatchRoster, scoreboard states (4c) |
| `Komponentenblatt.dc.html` | Component sheet 5a–5e: tokens, buttons, chips, forms, cards, nav, overlays, 404 |
| `Module-Galerie-Embeds.dc.html` | Gallery (6a), lightbox (6b), video/map consent + consent management (6c) |
| `Varianten.dc.html` | Light theme (7a), English header + glossary (7b), tournament without table (7c) |
| `image-slot.js`, `support.js` | Prototyping runtime only — **do not port**. `image-slot` is the drag-and-drop image placeholder; `support.js` renders the prototype format. |

Each file is a canvas of labelled boards: the badge in the corner of every board (`2a`, `3b`, `5c`…) is the reference id used in the descriptions above.

## Suggested build order
1. Tokens + `SiteHeader` / `SiteFooter` / `Breadcrumbs` / `Button` / `Chip` / `Badge`.
2. Fixtures & results (`FixtureRow`, `MonthHeader`, filters, `StandingsTable`) — highest traffic, exercises most primitives.
3. Match detail incl. `MatchRoster` and the scoreboard state machine.
4. Squad + player detail, including the missing-portrait/missing-bio fallbacks.
5. Home page with the hero state machine and countdown.
6. Gallery/lightbox and the consent gate.
7. Tournament detail (reuses the fixture row without the table).
8. Light theme and the English locale.
