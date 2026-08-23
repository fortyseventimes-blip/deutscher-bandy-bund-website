# admin-rbac Specification

## Purpose

Who may do what, in the admin panel and on the public site. Owns roles, permissions, session
security and the audit log. Public visitors have no accounts in v1.

## Requirements

### Requirement: Admin role set
The system SHALL provide the roles `superadmin`, `editor`, `author`, `sports_manager`,
`media_manager`, `translator` and `viewer`, and SHALL evaluate every permission server-side in
collection access control, never in the UI alone.

#### Scenario: Sportwart edits a page
- **GIVEN** a user with only `sports_manager`
- **WHEN** they open the admin panel
- **THEN** the Sport group is editable, Pages and Articles are read-only, and System is hidden
- **AND** a direct API write to `pages` returns 403

#### Scenario: Translator touches the German source
- **GIVEN** a user with only `translator`
- **WHEN** they edit a document with the locale switch on `de`
- **THEN** fields are read-only; on `en` they are editable and publishing German is refused

### Requirement: No public accounts in v1
The public site SHALL NOT offer registration, login or password reset. Newsletter preference
management SHALL work through signed, expiring, single-purpose token links sent by email.

#### Scenario: Subscriber changes preferences
- **GIVEN** a confirmed subscriber
- **WHEN** they follow the management link in a newsletter footer
- **THEN** they can change locale or unsubscribe without an account
- **AND** the link expires after use or after 30 days, whichever comes first

### Requirement: Admin session security
Administrative access SHALL require two-factor authentication for `superadmin` and `editor`,
SHALL expire idle sessions after eight hours, and SHALL rate-limit authentication attempts.

#### Scenario: Repeated failed logins
- **GIVEN** six failed login attempts from one address within five minutes
- **WHEN** a seventh is made
- **THEN** it is refused with a backoff and the event is written to the audit log

### Requirement: Audit log
The system SHALL record actor, action, collection, document, timestamp and changed field names for
every create, publish, unpublish, delete, role change and settings change, retained twelve months
and readable only by `superadmin`.

#### Scenario: Content disappears unexpectedly
- **GIVEN** a page that is no longer live
- **WHEN** an administrator opens the audit log
- **THEN** the delete or unpublish event names the responsible user and time
