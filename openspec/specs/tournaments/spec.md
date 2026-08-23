# tournaments Specification

## Purpose

Competition representation: tournament pages, their game lists, standings, documents and the
federation's placement. Owns the grouping layer above individual games.

## Requirements

### Requirement: Tournament entity and page
The system SHALL store for each tournament a name, type
(`Weltmeisterschaft` | `Pokal` | `Liga` | `Turnier` | `Sonstiges`), organizer, season, date range,
location, logo, description, participating sides, related games, optional standings and optional
documents; and SHALL render a canonical page per tournament.

#### Scenario: Tournament page lists its games
- **GIVEN** four games with `isTournamentGame = true` referencing one tournament
- **WHEN** the tournament page renders
- **THEN** all four appear grouped by round in chronological order with scores where finished

### Requirement: Standings are editor-maintained
The system SHALL allow an editor to maintain a standings table per tournament as structured rows
(team, played, won, drawn, lost, goals for, goals against, points) and SHALL NOT compute standings
automatically in v1.

#### Scenario: Editor updates standings after a matchday
- **GIVEN** a tournament with a standings table
- **WHEN** the editor edits the rows and publishes
- **THEN** the table renders sorted by points then goal difference, with the DBB row highlighted

#### Scenario: Tournament without standings
- **GIVEN** a knockout cup with no table
- **WHEN** the page renders
- **THEN** the standings section is absent, not empty

### Requirement: Placement is recorded
The system SHALL allow recording the federation's final placement per tournament and SHALL surface
it on the tournament page and in the federation history timeline.

#### Scenario: Historic tournament is added
- **GIVEN** a past World Championship with a recorded placement
- **WHEN** it is published
- **THEN** it appears in the tournament archive and in the `Timeline` block on `/verband`
