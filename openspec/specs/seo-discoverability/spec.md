# seo-discoverability Specification

## Purpose

Being found and being understood — by search engines and by AI assistants. Owns rendering strategy,
structured data, sitemaps, crawler directives, machine-readable feeds and performance budgets.

## Requirements

### Requirement: Server-rendered HTML
Every public page SHALL deliver complete, meaningful HTML in the initial response without requiring
client-side JavaScript to render its primary content.

#### Scenario: Crawler without JavaScript fetches a player page
- **GIVEN** a request with JavaScript disabled
- **WHEN** the player page is fetched
- **THEN** name, number, position, biography and appearance list are present in the HTML source

### Requirement: Structured data per entity type
The system SHALL emit valid JSON-LD: `SportsOrganization` for the federation, `SportsTeam` for team
pages, `Person` for players, `SportsEvent` for games, `SportsEvent` with `subEvent` for tournaments,
`NewsArticle` for articles, `ImageObject` with `creditText` for media, plus `BreadcrumbList` and
`WebSite` with `SearchAction` site-wide.

#### Scenario: Structured data is validated
- **GIVEN** any published page
- **WHEN** its JSON-LD is checked against schema.org in CI
- **THEN** validation passes with no errors and no warnings on required properties

#### Scenario: Draft content is excluded
- **GIVEN** an unpublished game
- **WHEN** the site is crawled
- **THEN** no `SportsEvent` markup exists for it anywhere

### Requirement: Sitemaps
The system SHALL publish a sitemap index referencing per-type sitemaps for pages, articles,
players, games and tournaments, each carrying `lastmod`, each locale variant, and SHALL regenerate
them when content is published.

#### Scenario: A new article is published
- **GIVEN** a newly published article
- **WHEN** `sitemap.xml` is fetched
- **THEN** the article URL is present with an accurate `lastmod`

### Requirement: Crawler directives
The system SHALL publish `robots.txt` disallowing `/admin`, `/api` and preview routes, explicitly
allowing the major search and AI crawlers the association chooses to permit, and referencing the
sitemap index. The allowed-crawler list SHALL be editable in site settings without a deployment.

#### Scenario: The board decides to block a specific AI crawler
- **GIVEN** a crawler user-agent added to the disallow list in site settings
- **WHEN** `robots.txt` is fetched
- **THEN** that agent is disallowed and the change required no code release

### Requirement: Machine-readable summaries
The system SHALL publish `/llms.txt` listing the site's stable canonical entry points with one-line
descriptions, and SHALL publish public JSON endpoints for fixtures, results and squads.

#### Scenario: An assistant is asked when Germany plays next
- **GIVEN** the fixtures endpoint and `SportsEvent` markup
- **WHEN** the assistant retrieves the site
- **THEN** the next fixture's date, opponent and venue are available without parsing layout

### Requirement: Canonical URLs and language alternates
Every page SHALL declare a canonical URL and reciprocal `hreflang` alternates for `de`, `en` and
`x-default`, and SHALL 301-redirect legacy URLs from the previous site through a managed redirect
table.

#### Scenario: An old inbound link is followed
- **GIVEN** a URL from the previous site recorded in the redirect table
- **WHEN** it is requested
- **THEN** the system responds 301 to the new equivalent, not 404

### Requirement: Performance budgets
The system SHALL meet, on a simulated mobile 4G profile: Largest Contentful Paint under 2.0s,
Cumulative Layout Shift under 0.05, Interaction to Next Paint under 200 ms, and SHALL fail CI when
a budget regresses.

#### Scenario: A heavy dependency is introduced
- **GIVEN** a pull request adding a large client-side library
- **WHEN** the performance job runs
- **THEN** the build fails with the offending budget named

### Requirement: Social preview images
The system SHALL generate Open Graph images per entity — score cards for games, portrait cards for
players, hero-based cards for articles — at request time with caching.

#### Scenario: A game link is shared
- **GIVEN** a finished game
- **WHEN** its URL is shared
- **THEN** the preview shows both sides, the score and the competition
