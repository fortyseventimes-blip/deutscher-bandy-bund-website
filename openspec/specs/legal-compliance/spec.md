# legal-compliance Specification

## Purpose

German and EU obligations for a registered association operating a public website: provider
identification, data protection, cookie consent, accessibility and image rights. Owns compliance
surfaces, not legal advice — the wording is reviewed by the association's counsel before launch.

## Requirements

### Requirement: Provider identification
The system SHALL publish an Impressum reachable from every page in at most two clicks, containing
the association's full name and legal form, registered address, representative board members,
Vereinsregister number and Registergericht, contact email and telephone, and, where applicable, the
responsible supervisory information. The legal basis cited SHALL be § 5 DDG.

#### Scenario: Visitor on a deep page looks for the Impressum
- **GIVEN** any page of the site
- **WHEN** the visitor scrolls to the footer
- **THEN** a direct link to `/impressum` is present

### Requirement: Privacy notice
The system SHALL publish a Datenschutzerklärung describing every processing activity actually
performed: hosting logs, contact form, newsletter, analytics, embedded media, and the use of the
Anthropic API for editorial assistance, with legal bases, retention periods and data subject rights.

#### Scenario: A new third-party service is added
- **GIVEN** a proposal introducing an external service that processes personal data
- **WHEN** the change is reviewed
- **THEN** the privacy notice update is a blocking task in `tasks.md`

### Requirement: Consent before non-essential storage
The system SHALL NOT set or read any non-essential cookie or local storage entry, and SHALL NOT
load any third-party embed, before explicit consent under § 25 TDDDG. Rejecting SHALL be as easy as
accepting, and the choice SHALL be revocable from a persistent link.

#### Scenario: Visitor arrives and rejects
- **GIVEN** a first visit
- **WHEN** the visitor chooses "Ablehnen"
- **THEN** no third-party request is made and the site remains fully usable

#### Scenario: A video is embedded on a page
- **GIVEN** a `VideoEmbed` block and no consent for media embeds
- **WHEN** the page renders
- **THEN** a local placeholder with the video title is shown, and the provider is contacted only
  after the visitor explicitly loads it

### Requirement: Analytics without consent burden
The system SHALL use a cookieless, IP-anonymizing analytics solution hosted in the EU so that
analytics requires no consent banner interaction.

#### Scenario: Visitor rejects all consent
- **GIVEN** a visitor who rejected the banner
- **WHEN** they browse the site
- **THEN** page views are still counted anonymously with no identifier stored on their device

### Requirement: Image rights and credits
Every media item SHALL carry a photographer credit and a license/usage note, and the system SHALL
display the credit wherever the image is shown at feature size.

#### Scenario: Image is published without a credit
- **GIVEN** a media item with an empty credit field
- **WHEN** an editor attempts to publish content using it as a hero image
- **THEN** validation blocks publication and names the missing credit

### Requirement: Accessibility
Public pages SHALL meet WCAG 2.2 level AA: keyboard operability, visible focus, 4.5:1 text
contrast, correct heading order, labelled controls, and alternative text on every meaningful image.

#### Scenario: Keyboard-only navigation
- **GIVEN** a visitor using only a keyboard
- **WHEN** they tab through the home page
- **THEN** a skip link appears first, focus order matches visual order, and no trap occurs
