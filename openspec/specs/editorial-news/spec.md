# editorial-news Specification

## Purpose

News, match reports, interviews and announcements: the article collection, its listing, categories
and tags, authorship, and syndication. Owns the blog-style publishing surface.

## Requirements

### Requirement: Article collection
The system SHALL store articles with localized title, slug, excerpt, block-composed body, hero
image, type (`news` | `spielbericht` | `interview` | `mitteilung`), categories, tags, author,
`publishedAt`, related players, games and tournaments, SEO fields and an `aiAssisted` flag.

#### Scenario: Match report is linked to its game
- **GIVEN** an article of type `spielbericht` related to a game
- **WHEN** it is published
- **THEN** the game page links to the report and the report links back to the game

### Requirement: Article listing and filtering
The system SHALL provide a paginated listing at `/news` filterable by type, category and tag, with
the newest article first, and SHALL provide category and tag archive URLs.

#### Scenario: Visitor filters to match reports
- **GIVEN** a mixed article list
- **WHEN** the visitor selects "Spielberichte"
- **THEN** only that type is listed and the filter is reflected in a crawlable URL

### Requirement: Syndication
The system SHALL publish an RSS/Atom feed per locale containing the most recent 30 published
articles with full metadata.

#### Scenario: Article is unpublished
- **GIVEN** a published article that an editor reverts to draft
- **WHEN** the feed regenerates
- **THEN** the article is absent from the feed and returns 404 at its URL

### Requirement: Editorial review gate
Users holding only the `author` role SHALL be able to create and edit their own drafts and submit
them for review, and SHALL NOT be able to publish.

#### Scenario: Author attempts to publish
- **GIVEN** a user with role `author`
- **WHEN** they open a draft article
- **THEN** the publish control is absent and the API rejects a publish attempt with 403
