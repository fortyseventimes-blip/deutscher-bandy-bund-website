# content-modeling Specification

## Purpose

Defines every content entity the site stores, their fields, their relationships and their
lifecycle. This capability owns the shape of the data; other capabilities own what is done
with it. It does not own presentation, access control, or SEO output.

## Requirements

### Requirement: Canonical entity set
The system SHALL model content as exactly these collections: `pages`, `articles`, `teams`,
`players`, `staff`, `games`, `tournaments`, `opponents`, `venues`, `seasons`, `galleries`,
`media`, `documents`, `partners`, `subscribers`, `form-submissions`, `users`, `ai-generations`,
`redirects`, `audit-log`; and these globals: `site-settings`, `header`, `footer`, `seo-defaults`.

#### Scenario: New content need appears
- **GIVEN** an editor needs to publish a kind of content not covered by the list
- **WHEN** they request it
- **THEN** the request is handled as an OpenSpec change proposal, not by overloading `pages`

### Requirement: Draft and publish lifecycle
Every editorially-owned collection SHALL support `draft` and `published` states with full version
history, restore, and scheduled publication via a `publishAt` timestamp.

#### Scenario: Editor schedules an announcement
- **GIVEN** an article in `draft` with `publishAt` set to a future timestamp
- **WHEN** that timestamp passes
- **THEN** the article becomes `published` and appears in listings, sitemap and RSS
- **AND** the previous version remains restorable

#### Scenario: Unpublished content is not reachable
- **GIVEN** an article in `draft`
- **WHEN** an anonymous visitor requests its URL
- **THEN** the system returns 404, and the URL is absent from `sitemap.xml`

### Requirement: Player entity
The system SHALL store for each player: first name, last name, localized slug, jersey number,
position (`TW` | `VER` | `MF` | `ST`), team membership per season, year of joining, birth date,
nationality, height, weight, status (`active` | `injured` | `inactive` | `alumni`), portrait image,
optional action image, localized biography, optional social links, and an `aiAssisted` flag.

#### Scenario: Jersey numbers repeat across the roster
- **GIVEN** two players in the same squad who have both worn number 9 in different seasons
- **WHEN** both records are saved
- **THEN** both save successfully
- **AND** uniqueness is enforced only within a single matchday roster, never on the player record

#### Scenario: Player leaves the squad
- **GIVEN** a player whose status changes to `alumni`
- **WHEN** the squad page renders
- **THEN** the player is absent from the current roster grid
- **AND** their player page stays reachable at the same URL with an "ehemalig" marker

### Requirement: Game entity and the tournament flag
The system SHALL store for each game: kick-off timestamp in UTC, status
(`scheduled` | `live` | `finished` | `postponed` | `cancelled`), home side, away side, venue,
`isTournamentGame` boolean, optional tournament relation, optional round label, scores, optional
matchday roster, optional report, optional gallery, optional video and ticket links.

#### Scenario: Friendly game without a tournament
- **GIVEN** a game with `isTournamentGame = false`
- **WHEN** it is saved
- **THEN** it saves without a tournament relation
- **AND** it appears in `/spiele` but in no tournament's game list

#### Scenario: Tournament flag set without a tournament
- **GIVEN** a game with `isTournamentGame = true` and no tournament selected
- **WHEN** the editor attempts to publish
- **THEN** validation fails with a message naming the missing tournament

### Requirement: Matchday roster is optional and per-game
The system SHALL allow an editor to attach a roster to any game, composed of entries referencing a
player plus that game's jersey number, position, starter flag and captain flag; and SHALL allow
games to have no roster at all.

#### Scenario: Roster is compiled the day before a game
- **GIVEN** a `scheduled` game with no roster
- **WHEN** the editor selects eleven players from the squad and saves
- **THEN** the game page shows the lineup grouped by position
- **AND** each listed player's page shows this game under their appearances

#### Scenario: Player selected twice
- **GIVEN** a roster where the same player is added twice
- **WHEN** the editor saves
- **THEN** validation fails and names the duplicated player

### Requirement: Opponents are first-class but lightweight
The system SHALL model opposing sides as an `opponents` collection holding name, short name,
country, crest and website, so that games can reference sides that are not DBB squads.

#### Scenario: Game against a foreign club
- **GIVEN** a friendly against a Swedish club not present in the system
- **WHEN** the editor creates the opponent inline from the game editor
- **THEN** the opponent is reusable in future games without duplication
