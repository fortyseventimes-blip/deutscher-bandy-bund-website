# media-library Specification

## Purpose

Images, documents and galleries: upload, derivative generation, metadata, and the constraints that
keep the site fast and lawful. Owns asset handling.

## Requirements

### Requirement: Required metadata
Every uploaded image SHALL require alternative text in German, a photographer credit and a usage
right before it can be referenced by published content.

#### Scenario: Editor uploads a match photo without alt text
- **GIVEN** an upload with empty alt text
- **WHEN** the editor attempts to attach it to a page and publish
- **THEN** publication is blocked with a message naming the missing field

### Requirement: Responsive derivatives
The system SHALL generate AVIF and WebP derivatives at defined breakpoints on upload, SHALL serve
the smallest sufficient variant, and SHALL support a focal point so portrait crops keep faces in
frame.

#### Scenario: Player portrait is used in a card and a hero
- **GIVEN** one portrait with a focal point on the face
- **WHEN** it renders in a square card and in a wide hero
- **THEN** the face remains visible in both crops

### Requirement: Player card assets
Player records SHALL accept a portrait and an optional action image, and the system SHALL provide a
consistent card treatment that works when only the portrait exists.

#### Scenario: Player has no action photo
- **GIVEN** a player with only a portrait
- **WHEN** the squad grid renders
- **THEN** the card uses the portrait with the standard treatment and no gap appears

### Requirement: Galleries
The system SHALL support galleries with a title, date, ordered images and an optional relation to a
game or tournament, rendered as a lazy-loaded grid with a keyboard-operable lightbox.

#### Scenario: Gallery attached to a game
- **GIVEN** a gallery related to a finished game
- **WHEN** the game page renders
- **THEN** the gallery appears below the report with a link to the full gallery page

### Requirement: Documents
The system SHALL support PDF documents with title, category, date and file, listed by the
`DocumentList` block, with file size and type shown before download.

#### Scenario: Tournament regulations are published
- **GIVEN** a PDF attached to a tournament
- **WHEN** the tournament page renders
- **THEN** the document is listed with its title, size and last-updated date
