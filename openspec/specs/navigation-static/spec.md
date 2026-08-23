# navigation-static Specification

## Purpose

The frame around the content: header, footer, navigation trees, search, error pages and redirects.
Everything here is editor-managed even though it appears fixed to visitors.

## Requirements

### Requirement: Editor-managed navigation
Header and footer navigation SHALL be maintained as ordered trees in the admin panel, per locale,
supporting internal document references, external URLs and anchors, with a maximum depth of two.

#### Scenario: A new tournament section is added
- **GIVEN** a published tournament page
- **WHEN** the editor adds it as a child of "Turniere" in the header tree
- **THEN** it appears in the desktop dropdown and the mobile drawer without a deployment

#### Scenario: A linked page is unpublished
- **GIVEN** a navigation entry pointing to a page that is reverted to draft
- **WHEN** the site renders
- **THEN** the entry is hidden and the editor sees a warning in the navigation editor

### Requirement: Mobile-first navigation
On small viewports the header SHALL present a compact bar with logo, search and a menu trigger
opening a full-height drawer with the complete tree, language switch and primary call to action.

#### Scenario: Visitor navigates on a phone
- **GIVEN** a 375 px viewport
- **WHEN** the drawer is opened
- **THEN** focus is trapped inside it, background scroll is locked, and Escape closes it

### Requirement: Site search
The system SHALL provide search across articles, players, games, tournaments and pages, grouped by
type, reachable from the header on every viewport.

#### Scenario: Visitor searches for a player by number
- **GIVEN** a squad containing number 35
- **WHEN** the visitor searches "35"
- **THEN** matching players are returned in a Spieler group above other result types

### Requirement: Error pages
The system SHALL serve a composed 404 page offering search, latest news and the next fixture, and a
500 page that renders without depending on the database.

#### Scenario: Database is unavailable
- **GIVEN** the database is down
- **WHEN** any page is requested
- **THEN** a static 500 page is served with contact information and no stack trace

### Requirement: Managed redirects
The system SHALL provide an editable redirect table supporting exact and prefix matches with 301
and 302 status codes, applied before rendering.

#### Scenario: A page is renamed
- **GIVEN** a page whose slug changes
- **WHEN** it is saved
- **THEN** a 301 from the old slug is proposed automatically and created on confirmation
