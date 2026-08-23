# Design Brief — bandy-bund.de

**Paste this whole file as a single prompt into Claude Design or Figma Make.**
It is written to be self-contained: art direction, tokens, module anatomy, page composition, states
and sample content are all here. Do not summarize it before pasting.

---

## 0. The one-line task

Design the public website of the **Deutscher Bandy-Bund (DBB)** — the German national federation for
bandy — mobile-first, dark, fast and unmistakably a *sports* site, not a corporate one.

Deliver these artboards, in this order:

1. **Startseite** — mobile 390 × as-tall-as-needed
2. **Startseite** — desktop 1440
3. **Spielplan & Ergebnisse** — mobile + desktop
4. **Spiel-Detailseite** (finished game, with lineup) — desktop
5. **Kader / Mannschaft** + **Spieler-Detailseite** — mobile + desktop
6. **Komponentenblatt** — every module in isolation with its states

---

## 1. Who this is for

- **Fans on a phone**, 80% of traffic, often outdoors in winter, often on a bad connection. They
  want one thing in under three seconds: *when is the next game and what happened in the last one*.
- **Players and families** looking for a specific person.
- **International federations and press** reading the English version.
- **Sponsors and prospective members**, who need to see a live, credible organization.

Design for the fan, not for the board. The board's message belongs on `/verband`, not in the hero.

---

## 2. The sport, so the design is honest

Bandy is football played on ice: 11 v 11 on a pitch the size of a football field, two 45-minute
halves, a small **orange-red ball**, long **curved sticks**, skates. Rink bandy is the 6 v 6 version
on an ice-hockey rink — that is what the German federation mostly plays.

The visual consequences: **wide open white ice**, **long sightlines**, **speed**, **cold light**,
**a single red dot moving fast**. Not the boarded-in, close-quarters look of ice hockey. Photography
should show space, not scrums.

---

## 3. Brand

The crest is a circular chrome-ringed badge: black / red / gold German flag field, blackletter
"DBB", two crossed black-bladed sticks, a **red ball** at the bottom centre.

Extract three things from it and use only those:

1. **Black, red, gold** — the national palette, used with restraint.
2. **The red ball** — a small solid red circle as a recurring UI accent: bullet, live indicator,
   scroll marker, list dot, the counter of the countdown.
3. **The crossed diagonal** of the sticks — a subtle diagonal cut or shear used on section edges and
   card corners, at a consistent −8°.

**Never** use the blackletter lettering as an interface font. It is illegible at UI sizes and
carries connotations the federation does not want. It stays inside the crest.

---

## 4. Art direction

**Dark-first.** Deep near-black ground with a cool cast, ice-white type, red for action, gold for
achievement. Think a modern broadcast scoreboard rather than a club newsletter. High contrast, large
type, generous negative space, no gradients except a single subtle radial glow behind the hero.

Photography treatment: full-bleed, slightly desaturated, cool white balance, with a bottom-to-top
black scrim so type always sits on the dark end. Faces stay in frame at every crop — design every
image container around a focal point, never a centre crop.

Motion, if the tool supports it: nothing bouncy. Fast, linear, short. 150 ms for hovers, 250 ms for
entrances, a 30 s smooth loop for the results ticker. Respect `prefers-reduced-motion` by disabling
all of it.

---

## 5. Design tokens

Define these as named styles/variables. Every value below is deliberate — do not substitute.

### Colour — dark (default)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0B0D0F` | page ground |
| `--surface` | `#14181C` | cards, sections |
| `--surface-raised` | `#1D232A` | hover, elevated cards |
| `--border` | `#2A323A` | 1px hairlines |
| `--text` | `#F4F7F9` | primary text |
| `--text-muted` | `#98A3AD` | secondary text, metadata |
| `--red` | `#DD0000` | primary action fills, the ball |
| `--red-bright` | `#FF4D4D` | red *text* on dark, live state |
| `--gold` | `#FFCC00` | eyebrows, placements, highlights |
| `--ice` | `#C9E4F0` | cold accent for surfaces and dividers |
| `--win` / `--draw` / `--loss` | `#2FBF71` / `#98A3AD` / `#FF4D4D` | result chips |

### Colour — light

Same roles, inverted: `--bg #F4F7F9`, `--surface #FFFFFF`, `--border #DCE3E9`, `--text #0B0D0F`,
`--text-muted #55606B`, `--red #C50014` (darkened for contrast on white), `--gold #A67C00` for text.

**Contrast rules, non-negotiable:** never red text on the dark ground — use `--red-bright`. Never
gold text on white — use the darkened gold. Every text pair meets 4.5:1, every UI border 3:1.

### Type

- **Display / headlines / numerals:** Barlow Condensed — 700 and 800, uppercase for eyebrows and
  scores, tabular figures everywhere a number can change.
- **Body / UI:** Inter — 400, 500, 600.

| Role | Mobile | Desktop | Spec |
| --- | --- | --- | --- |
| Score | 56 / 56 | 88 / 88 | Barlow Condensed 800, tabular, −2% |
| H1 | 32 / 36 | 56 / 60 | Barlow Condensed 700, uppercase, −1% |
| H2 | 26 / 32 | 40 / 44 | Barlow Condensed 700, uppercase |
| H3 | 20 / 26 | 24 / 30 | Barlow Condensed 700 |
| Eyebrow | 12 / 16 | 13 / 16 | Inter 600, uppercase, +8% tracking, `--gold` |
| Body L | 17 / 27 | 18 / 30 | Inter 400 |
| Body | 15 / 24 | 16 / 26 | Inter 400 |
| Meta | 13 / 18 | 13 / 18 | Inter 500, `--text-muted` |
| Button | 15 / 20 | 15 / 20 | Inter 600, uppercase, +4% |

Body copy never exceeds 68 characters per line.

### Space, radius, elevation

Spacing scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.
Section padding: 48 mobile / 96 desktop. Card padding: 16 / 24.
Radius: cards 12, buttons 8, chips and pills 999, images 12.
Elevation: no soft drop shadows. Depth comes from `--surface-raised` plus a 1px `--border`.

### Grid

| Breakpoint | Columns | Margin | Gutter | Max content |
| --- | --- | --- | --- | --- |
| 360–767 | 4 | 16 | 16 | full |
| 768–1023 | 8 | 32 | 24 | full |
| 1024–1439 | 12 | 48 | 24 | 1120 |
| 1440+ | 12 | auto | 32 | 1280 |

Hero, ticker and image sections go full-bleed; everything else sits in the content width.

Touch targets are minimum 44 × 44. Sticky elements never cover a target.

---

## 6. Module library

Everything on this site is composed from reusable modules. Design each once, correctly, with its
states. An editor reorders them freely, so **no module may assume what sits above or below it**, and
every module must survive being placed first, last or alone.

Shared settings visible in the design: background variant (default / muted / inverted / accent),
vertical spacing, optional gold eyebrow + H2 heading + optional "alle ansehen" link on the right.

### 6.1 Header

Mobile: 56 px tall, sticky, `--surface` at 92% opacity with backdrop blur, 1px bottom border on
scroll. Left: crest 32 px + "DBB" wordmark. Right: search icon, then hamburger.

Drawer: full-height, slides from the right, `--bg`, large 24 px Barlow Condensed items, second level
indented and revealed by tap, DE/EN switch as a two-segment pill at the bottom, and a red
**"Newsletter abonnieren"** button pinned above the safe area. Focus trapped, Escape closes.

Desktop: 72 px, shrinking to 56 on scroll. Crest + wordmark left; horizontal nav centre with
dropdowns; search, DE/EN and the red newsletter button right.

Nav: **Aktuelles · Mannschaften · Spielplan · Turniere · Verband · Kontakt**

### 6.2 MatchdayHero — the most important module on the site

Full-bleed. Background: an ice-action photo, cool and desaturated, with a black scrim from the
bottom. A faint red radial glow sits behind the centre.

Contents, top to bottom on mobile:

- Gold eyebrow: competition + round — `RINKBANDY-LÄNDERSPIEL · GRUPPENPHASE`
- The pairing: home crest 64 px, `–`, away crest 64 px, names beneath in Barlow Condensed 700
- Date and time: `SA · 16.01.2027 · 15:00 UHR`
- Venue with a small pin: `Eissporthalle Frankfurt`
- **Countdown**: four tabular blocks `TAGE · STD · MIN · SEK`, separated by a small red ball dot
- Two buttons: primary red **"Zum Spiel"**, secondary outlined **"In Kalender"**

Desktop: two columns — crests and countdown left at large scale, venue and buttons right. Score
typography scales to 88.

**States to draw:**
- *Upcoming* — as above
- *Live* — countdown replaced by a pulsing red dot + `LÄUFT` + the running score
- *Finished* — score at 88, result chip, button becomes **"Spielbericht"**
- *Off-season / no fixture* — falls back to a plain photo hero with headline, one line of copy and
  a single CTA. Draw this. It will be on screen for months every year.

### 6.3 ResultsTicker

Full-bleed, 72 px tall, `--surface`, horizontally scrollable, edge-faded, auto-scrolling slowly and
pausing on hover or focus. Each item: date, both short names with tiny crests, score in tabular
figures, and a 3 px left border in win green / draw grey / loss red. Snap-scrolls on touch.

### 6.4 NewsTeaser

Section heading + "Alle News". Mobile: one large lead card then two compact rows. Desktop: 3 cards.

Card: 16:9 image with a subtle −8° diagonal cut on the bottom edge, gold category eyebrow, H3
headline (max 3 lines), meta line `12. Januar 2027 · Spielbericht`. Whole card is the link; hover
raises the surface and scales the image 1.03 inside a fixed frame.

### 6.5 PlayerCard and PlayerCarousel

The card is the signature element of the site. Portrait ratio 3:4.

Anatomy, back to front: `--surface-raised` panel; a large ghosted jersey number in Barlow Condensed
800 at 8% white filling the upper right; the cut-out portrait sitting on the baseline and slightly
overflowing the top edge; a bottom bar with the number in red, the surname in Barlow Condensed 700
uppercase, the given name in Inter above it, and a position chip. A 2 px red bottom rule appears on
hover.

Mobile: horizontal snap carousel, cards 68% viewport wide, peeking the next one.
Desktop: 4-up grid, with filter chips above — `ALLE · TORWART · VERTEIDIGUNG · MITTELFELD · STURM`.

Draw the case where a player has **no portrait**: the ghosted number becomes the subject, centred,
with a subtle ice-blue field. It must look intentional, not broken.

### 6.6 FixtureList and FixtureRow

A row, not a card — the list is scanned, not browsed. Left: date block, day above date, in tabular
figures. Centre: home name, score or kick-off time, away name — our own squad always in `--text`,
the opponent in `--text-muted`. Right: competition chip and a chevron.

A thin gold left border marks a tournament game; friendlies have none. Rows alternate `--surface`
and transparent. Sticky month subheads while scrolling.

Above the list: filter chips — `KOMMEND / VERGANGEN`, `HERREN / DAMEN / ALLE`, season select.

### 6.7 MatchRoster

Grouped by position, four sub-headings. Each entry: number in a red square, name, and small chips
for captain and starter. Two columns on desktop, one on mobile. When goals or assists exist, they
appear as small gold pips after the name.

### 6.8 StandingsTable

Sticky first column with team name, horizontally scrollable columns `SP · S · U · N · T · GT · PKT`,
tabular figures, our own row highlighted with a red left border and a raised surface. Never let this
table push the page into horizontal scroll — it scrolls inside its own container.

### 6.9 NewsletterSignup — the primary conversion module

Full-bleed `--red` band. White H2: **`KEIN SPIEL VERPASSEN.`** One line of white copy at 80% opacity. A single email input with a white fill and a black
**"Anmelden"** button attached on desktop, stacked on mobile. Below, small print: consent line plus
a link to `/datenschutz`.

States: default, focused, invalid email, submitting, and the success state — the form is replaced by
a check mark and *"Fast geschafft. Bestätige den Link in deiner E-Mail."*

Variants: inline band (above), a compact version in the footer, and a dismissible slide-in card
bottom-right on desktop / bottom sheet on mobile.

### 6.10 Stats, TournamentTeaser, LogoWall, Footer

**Stats** — 2 × 2 on mobile, 4 across on desktop. Large gold Barlow Condensed number, label beneath
in Inter meta. `2013 GEGRÜNDET · 2 NATIONALMANNSCHAFTEN · 28 SPIELERINNEN UND SPIELER · 1 ZIEL`.

**TournamentTeaser** — wide cards: logo, name, date range, location, placement badge in gold when
finished, "Zum Turnier".

**LogoWall** — greyscale partner logos at 40% opacity, full colour on hover, on `--surface`.

**Footer** — `--bg` with a top hairline. Four columns on desktop, stacked accordions on mobile:
navigation, Mannschaften, Verband, Kontakt. Then a compact newsletter field. Then a bottom bar:
crest, `© 2027 Deutscher Bandy-Bund e.V.`, and the legal links **Impressum · Datenschutz ·
Barrierefreiheit · Cookie-Einstellungen**. Social icons right. FIB membership line beneath.

### 6.11 Also needed on the component sheet

`HeroCompact` (inner-page title + breadcrumb), `RichText` (prose styles: H2/H3, list, blockquote
with a red rule, inline link with a red underline that thickens on hover, table, figure with a
credit line), `MediaWithText`, `Quote`, `Accordion`, `Gallery` + lightbox, `VideoEmbed` in its
**consent placeholder state** (a local poster with a lock icon and a "Video laden" button —
draw this, it is a legal requirement), `DocumentList` (PDF rows with size and date), `MapBlock`
consent placeholder, `CTABanner`, `Divider`, `ContactForm`, search overlay with grouped results,
pagination, breadcrumbs, and the **404 page** (big gold 404, search field, next fixture, latest three
articles).

---

## 7. Home page composition

Order, top to bottom. Everything is editor-reorderable, so each section must stand alone.

1. Header
2. **MatchdayHero** — next game
3. **ResultsTicker** — last five results
4. **NewsTeaser** — three articles
5. **PlayerCarousel** — "Unser Kader", link to `/teams`
6. **TournamentTeaser** — current or next tournament
7. **Stats** — the federation in four numbers
8. **NewsletterSignup** — full-width red band
9. **LogoWall** — partners
10. Footer

Rhythm on desktop: alternate `--bg` and `--surface` so sections separate without dividers. Two
full-bleed image moments only — the hero and one editorial break. Everything else is type and data.

---

## 8. States and edge cases — draw these, do not skip them

A design that only shows the happy path is a design that gets rebuilt in month three.

- Off-season hero with no upcoming fixture
- Live game state in hero and ticker
- Player without a portrait; player without a biography
- Squad filter with zero results
- Game that is postponed — original date struck through, status stated, no score
- Tournament without a standings table
- Article without a hero image
- Empty search
- Long German compound words: `Barrierefreiheitserklärung`, `Rinkbandy-Länderspiel`,
  `Mannschaftsaufstellung`. Nothing may overflow or clip. Test every heading at 25 characters.
- A name that is too long for the player card: `Eric Arakaza von Hof`, `Nilas Leander Houck`
- English version of the header — labels get longer, the nav must not wrap
- **Cookie consent banner** — bottom sheet on mobile, with "Alle akzeptieren" and "Ablehnen" as
  visually equal buttons, and a third "Einstellungen" text link. Equal weight is a legal
  requirement, not a preference.

---

## 9. Constraints

- **Mobile-first.** Design the 390 artboard first and let desktop follow. If a section only works at
  1440, it is wrong.
- **WCAG 2.2 AA.** 4.5:1 text, 3:1 UI, visible focus rings (2 px `--gold` offset 2 px), 44 px
  targets, no meaning carried by colour alone — the result chips carry a letter as well as a colour.
- **Performance.** One hero image above the fold, no carousels that autoplay video, no icon font, no
  decorative image over 200 KB. Layout must not shift as images load: every image container has a
  fixed aspect ratio.
- **Two locales.** Every string will exist in German and English. Leave 30% headroom on labels.
- **Everything is CMS-managed.** No text is baked into the design that an editor cannot change,
  including the hero fallback and the footer legal lines.

---

## 10. Do not

- Do not use stock photography of generic ice hockey. Bandy has a ball and long curved sticks; the
  difference is visible and getting it wrong destroys credibility with the audience.
- Do not put the sponsor wall above the fold.
- Do not use blackletter type outside the crest.
- Do not use the flag colours as large flat blocks of black-red-gold stacked together. Red is the
  action colour, gold is the highlight, black is the ground. The flag stays in the crest.
- Do not design a login, an account menu or a shop. Neither exists.
- Do not add gradients, glassmorphism, or drop shadows beyond the single hero glow.
- Do not centre body text.

---

## 11. Sample content — use exactly this, it is real

**Next fixture:** Deutschland – Niederlande · Rinkbandy-Länderspiel · Sa 16.01.2027, 15:00 Uhr ·
Eissporthalle Frankfurt

**Recent results:** Deutschland 3:5 Estland · Deutschland 6:2 Ungarn · Deutschland 2:2 Niederlande ·
Deutschland 1:4 Schweden · Deutschland 5:3 Schweiz

**Herren squad:** 1 Eric Arakaza von Hof (Torwart) · 3 Theo Simon Houck (Verteidiger) ·
4 Julian Cordes (Verteidiger) · 5 Nilas Leander Houck (Mittelfeld) · 7 Franz von Schoultz
(Mittelfeld) · 8 Maximilian Fichter (Sturm) · 9 Phillip Billington (Sturm) · 10 Elias Leonhard
Rieder (Sturm) · 13 Konstantin Karmilin (Verteidiger) · 14 Simon Framgard (Mittelfeld) ·
15 Jaromir Freiberger (Sturm) · 16 Elias Hjortenhed (Verteidiger) · 22 Johan Koch (Mittelfeld) ·
35 Konstantin Fichter (Sturm) · 44 Aleksandr Epifanov (Verteidiger)

**Damen squad:** 1 Annalena Fichter (Torwart) · 4 Eva Hermann (Verteidigung) · 5 Marie Meyer-Piton
(Mittelfeld) · 9 Lea-Sophie Kaden (Sturm) · 10 Nasim Mossadeghi (Mittelfeld) · 15 Frida Wacker
(Verteidigung) · 17 Janet Duke (Sturm) · 21 Gloria Fritsch (Mittelfeld) · 22 Klara Brinkmann
(Sturm) · 35 Juli Dubbel (Verteidigung)

**Headlines:**
- „Punktgewinn gegen die Niederlande — Deutschland holt spätes 2:2"
- „Konstantin Fichter über die Vorbereitung: ‚Wir haben endlich Eiszeit'"
- „Deutscher Rinkbandy-Pokal 2027: Termine und Spielorte stehen fest"
- „Damen-Nationalmannschaft nominiert 14 Spielerinnen für das Turnier in Frankfurt"

**Tournament:** Deutscher Rinkbandy-Pokal 2027 · 12.–14. Februar 2027 · Frankfurt am Main

**Stats:** 2013 gegründet · 2 Nationalmannschaften · 28 Spielerinnen und Spieler · Mitglied der
Federation of International Bandy

**Newsletter copy:** „Kein Spiel verpassen." / „Spieltermine, Ergebnisse und Kadernews — etwa
zweimal im Monat, jederzeit abbestellbar."
