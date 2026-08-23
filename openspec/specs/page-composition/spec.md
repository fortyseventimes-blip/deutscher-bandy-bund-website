# page-composition Specification

## Purpose

Defines the modular block system: the catalogue of reusable modules, how editors compose pages from
them, the settings shared by every block, and the composition rules for the home page. Owns layout
assembly, not the visual design of individual modules.

## Requirements

### Requirement: Block-composed pages
The system SHALL render every `pages` document from an ordered, editor-managed array of blocks,
with no hardcoded page templates other than entity detail pages.

#### Scenario: Editor reorders the home page
- **GIVEN** the home page with the newsletter block in position 8
- **WHEN** the editor drags it to position 3 and publishes
- **THEN** the live page renders it in position 3 without a deployment

### Requirement: Block catalogue
The system SHALL provide these blocks, each usable on any page unless marked entity-only:
`HeroFeature`, `HeroCompact`, `MatchdayHero`, `NextMatches`, `LastResults`, `ResultsTicker`,
`FixtureList`, `StandingsTable`, `TournamentTeaser`, `MatchRoster` (entity-only), `MatchReport`
(entity-only), `PlayerGrid`, `PlayerCarousel`, `PlayerSpotlight`, `StaffGrid`, `NewsTeaser`,
`RichText`, `MediaWithText`, `Quote`, `Accordion`, `Stats`, `Timeline`, `Gallery`, `VideoEmbed`,
`DocumentList`, `TableBlock`, `LogoWall`, `NewsletterSignup`, `CTABanner`, `ContactForm`,
`MapBlock`, `SocialLinks`, `Divider`.

#### Scenario: Editor builds a tournament preview page
- **GIVEN** an empty page
- **WHEN** the editor adds `HeroCompact`, `RichText`, `FixtureList` filtered to one tournament,
  `Gallery` and `NewsletterSignup`
- **THEN** the page renders those five modules in order with no developer involvement

### Requirement: Shared block settings
Every block SHALL expose the same settings group: anchor id, background variant
(`default` | `muted` | `inverted` | `accent`), vertical spacing (`none` | `s` | `m` | `l`),
optional eyebrow, heading and heading level (`h2` | `h3`), and locale visibility.

#### Scenario: Anchor link from navigation
- **GIVEN** a block with anchor id `kader`
- **WHEN** a visitor opens `/verband#kader`
- **THEN** the browser scrolls to that block with the sticky header offset accounted for

### Requirement: Data-driven blocks query live content
Blocks that display entities SHALL take a filter (team, season, competition, category, tag,
status) and a limit, and SHALL resolve their contents at request time rather than storing copies.

#### Scenario: A new result is entered
- **GIVEN** a home page containing `LastResults` limited to 3
- **WHEN** an editor sets a final score on a game and publishes
- **THEN** the home page shows that result within the revalidation window without being edited

#### Scenario: A filter matches nothing
- **GIVEN** `NextMatches` filtered to the Damen squad with no upcoming fixtures
- **WHEN** the page renders
- **THEN** the block renders its documented empty state, never an empty container or an error

### Requirement: Home page composition default
The home page SHALL ship with this default order, all of it editor-reorderable:
`MatchdayHero`, `ResultsTicker`, `NewsTeaser`, `PlayerCarousel`, `TournamentTeaser`, `Stats`,
`NewsletterSignup`, `LogoWall`.

#### Scenario: Off-season with no upcoming fixture
- **GIVEN** no game with status `scheduled` in the future
- **WHEN** the home page renders
- **THEN** `MatchdayHero` falls back to its `HeroFeature` presentation using the configured
  fallback image, headline and CTA
