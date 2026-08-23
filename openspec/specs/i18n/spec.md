# i18n Specification

## Purpose

Two locales — German as source, English as translation — across content, interface, URLs, dates and
the admin panel. Owns localization mechanics and the translation workflow.

## Requirements

### Requirement: Locale routing
German SHALL be served without a path prefix and English under `/en/`. Slugs SHALL be localized
fields, so URLs read naturally in both languages.

#### Scenario: Visitor switches language on a player page
- **GIVEN** a visitor on `/spieler/eric-arakaza-von-hof`
- **WHEN** they use the language switch
- **THEN** they land on `/en/players/eric-arakaza-von-hof`, not on the English home page

#### Scenario: Translation does not exist yet
- **GIVEN** an article published only in German
- **WHEN** an English visitor reaches its English URL
- **THEN** the German content is shown with a notice, and the page is marked `noindex` for `en`

### Requirement: Interface localization
All interface strings SHALL come from message catalogues, and dates, times and numbers SHALL be
formatted per locale with Europe/Berlin as the display timezone.

#### Scenario: Kick-off time is displayed
- **GIVEN** a game stored at `2027-01-16T14:00:00Z`
- **WHEN** it renders
- **THEN** German shows `16.01.2027, 15:00 Uhr` and English shows `16 Jan 2027, 3:00 PM`

### Requirement: Translation workflow
The admin panel SHALL offer per-document locale switching, SHALL indicate which locale is
outdated relative to the source, and SHALL offer the `translate` AI action to produce a draft
translation for human review.

#### Scenario: German source is edited after translation
- **GIVEN** an article translated to English, whose German version is then edited
- **WHEN** an editor opens the document
- **THEN** the English locale is flagged as outdated with the date of divergence

### Requirement: Admin panel language
The admin interface SHALL default to German and SHALL be switchable to English per user.

#### Scenario: A non-German-speaking volunteer joins
- **GIVEN** a new user who sets their interface language to English
- **WHEN** they log in
- **THEN** navigation, field labels and validation messages appear in English
