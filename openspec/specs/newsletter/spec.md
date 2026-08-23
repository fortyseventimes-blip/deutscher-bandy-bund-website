# newsletter Specification

## Purpose

The site's primary conversion mechanic: collecting email addresses lawfully, confirming them, and
letting subscribers leave without friction. Owns consent capture and evidence, not campaign
sending.

## Requirements

### Requirement: Double opt-in
The system SHALL create subscribers in status `pending`, send a confirmation email containing a
signed single-use token, and SHALL only set status `confirmed` when that token is followed.

#### Scenario: Address is submitted but never confirmed
- **GIVEN** a `pending` subscriber whose token is 30 days old
- **WHEN** the retention job runs
- **THEN** the record is deleted and the address receives no further mail

#### Scenario: Confirmation link is reused
- **GIVEN** an already-used confirmation token
- **WHEN** it is followed again
- **THEN** the system shows an already-confirmed notice and does not create a second record

### Requirement: Consent evidence
The system SHALL store, per subscriber, the consent timestamp, the confirmation timestamp, the
source URL of the form, the wording version of the consent text and a truncated IP address.

#### Scenario: A complaint about unsolicited mail arrives
- **GIVEN** a confirmed subscriber
- **WHEN** an administrator opens the record
- **THEN** the stored evidence shows when, where and to what wording consent was given

### Requirement: One-click unsubscribe
Every newsletter SHALL contain an unsubscribe link that requires no login and no confirmation step,
and SHALL honour `List-Unsubscribe` and `List-Unsubscribe-Post` headers.

#### Scenario: Subscriber unsubscribes
- **GIVEN** a confirmed subscriber
- **WHEN** they follow the unsubscribe link
- **THEN** status becomes `unsubscribed` immediately and a confirmation page is shown

### Requirement: Signup module placement and abuse protection
The signup module SHALL be available as a page block, in the footer and as an optional dismissible
slide-in, and SHALL be protected by a privacy-respecting challenge and a honeypot field.

#### Scenario: Bot submits the form
- **GIVEN** a submission with the honeypot field filled
- **WHEN** it is received
- **THEN** it is discarded silently and no confirmation email is sent

#### Scenario: Slide-in is dismissed
- **GIVEN** a visitor who dismissed the slide-in
- **WHEN** they browse further pages in the same session
- **THEN** it does not reappear
