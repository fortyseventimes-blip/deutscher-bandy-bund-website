# team-roster Specification

## Purpose

Squad and player presentation: team overview, squad grids, player detail pages, staff, and the
season-scoped membership that ties players to teams. Owns how athletes are represented publicly.

## Requirements

### Requirement: Multiple squads
The system SHALL support an arbitrary number of teams distinguished by gender and age group, and
SHALL scope players, games and rosters by team.

#### Scenario: Herren and Damen are browsed separately
- **GIVEN** teams `herren` and `damen` each with a roster
- **WHEN** a visitor opens `/teams/damen`
- **THEN** only Damen players, fixtures and results are shown

### Requirement: Player page
Each player SHALL have a permanent, canonical, localized URL rendering portrait, jersey number,
position, nationality, year of joining, season stats, biography, appearance list and related news.

#### Scenario: Player page is shared to social media
- **GIVEN** a player page
- **WHEN** the URL is pasted into a messenger
- **THEN** a generated preview card shows portrait, name, number and position

#### Scenario: Player has no biography yet
- **GIVEN** a player record with an empty biography
- **WHEN** the page renders
- **THEN** the biography section is omitted entirely rather than showing an empty heading

### Requirement: Squad filtering
The squad grid SHALL be filterable by position and searchable by name and number, client-side,
without a page reload, and SHALL remain fully usable with JavaScript disabled.

#### Scenario: Visitor filters to goalkeepers
- **GIVEN** a squad of 17 players
- **WHEN** the visitor taps the "Torwart" filter
- **THEN** only goalkeepers remain visible and the filter state is reflected in the URL query

### Requirement: Bulk player import
The system SHALL provide a one-off import that maps files named
`{gender}-{number}-{first}-{last}` to player records, assigning team by gender, jersey number by
number, and name by the remaining segments, and SHALL report every ambiguous row instead of
guessing.

#### Scenario: Import encounters a duplicate number
- **GIVEN** two source files with the same gender and number
- **WHEN** the import runs
- **THEN** both records are created and the run report flags the collision for human review

#### Scenario: Import encounters a mismatched gender marker
- **GIVEN** a file whose name marks a gender the board later disputes
- **WHEN** the import runs
- **THEN** the record is created as a draft and listed in the report as requiring confirmation
