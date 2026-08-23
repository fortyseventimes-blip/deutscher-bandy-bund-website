# fixtures-results Specification

## Purpose

The calendar: upcoming fixtures, past results, the game detail page, and machine-readable calendar
output. This is the highest-traffic capability on the site and the heart of the home page.

## Requirements

### Requirement: Fixture and result listing
The system SHALL provide a listing at `/spiele` (`/en/games`) filterable by team, season,
competition and time direction (upcoming / past), defaulting to upcoming fixtures ascending.

#### Scenario: Season has ended
- **GIVEN** no upcoming fixtures in the current season
- **WHEN** a visitor opens the listing
- **THEN** the view falls back to past results descending with a visible notice

### Requirement: Game detail page
Each game SHALL have a canonical URL rendering both sides with crests, competition and round,
venue with map link, kick-off in Europe/Berlin, status, score when finished, matchday roster when
present, match report when present, gallery and video when present.

#### Scenario: Game is postponed
- **GIVEN** a game whose status changes to `postponed`
- **WHEN** the page renders
- **THEN** the original date is struck through, the status is stated, and no score is shown

#### Scenario: Game is finished
- **GIVEN** a `finished` game with a score
- **WHEN** the page renders
- **THEN** the score is the most prominent element and `SportsEvent` JSON-LD reports
  `eventStatus: EventScheduled` with the result

### Requirement: Countdown to the next fixture
The home page `MatchdayHero` SHALL identify the chronologically next `scheduled` game across all
teams, or a selected team when configured, and display a countdown that degrades to a plain date
without JavaScript.

#### Scenario: Kick-off passes while a visitor has the page open
- **GIVEN** the countdown reaching zero
- **WHEN** it elapses
- **THEN** the module switches to a "läuft" state without a page error

### Requirement: Calendar export
The system SHALL publish a subscribable iCalendar feed at `/spiele.ics`, per-team feeds, and a
per-game `.ics` download, all reflecting status changes.

#### Scenario: Fan subscribes to the fixture feed
- **GIVEN** a fan who subscribed to `/spiele.ics`
- **WHEN** an editor moves a fixture to a new date
- **THEN** the fan's calendar reflects the new date on its next refresh

### Requirement: Manual result entry is authoritative
The system SHALL treat editor-entered scores as the single source of truth and SHALL NOT ingest
results from third-party feeds in v1.

#### Scenario: Editor enters a final score
- **GIVEN** a `scheduled` game
- **WHEN** the editor sets both scores and status `finished` and publishes
- **THEN** the result appears in listings, the ticker, the tournament page and the RSS feed
