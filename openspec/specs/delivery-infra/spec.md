# delivery-infra Specification

## Purpose

How the software is built, verified, shipped, operated and recovered on the provided VPS/VDS. Owns
environments, pipelines, backups and observability.

## Requirements

### Requirement: Three environments
The system SHALL run in `local`, `staging` and `production`, sharing one image and differing only
by configuration and data.

#### Scenario: A feature is verified before release
- **GIVEN** a merge to `main`
- **WHEN** the pipeline completes
- **THEN** staging runs the new image and production is untouched until a release tag is pushed

### Requirement: Reproducible builds and promotion
The system SHALL build one container image per commit, publish it to a registry tagged with the
commit SHA, and promote that exact image to production by retagging — never by rebuilding.

#### Scenario: Release is cut
- **GIVEN** a staging image verified under a commit SHA
- **WHEN** the release tag is pushed
- **THEN** the same digest is deployed to production

### Requirement: Quality gates
Every pull request SHALL pass type checking, linting, unit tests, a production build, end-to-end
tests, accessibility checks, performance budgets and `openspec validate --strict` before merge.

#### Scenario: A test fails
- **GIVEN** a pull request with a failing end-to-end test
- **WHEN** the author attempts to merge
- **THEN** branch protection blocks it

### Requirement: Safe migrations
Deployments SHALL take a database backup before running migrations, run migrations as an explicit
step, and roll back to the previous image if smoke tests fail.

#### Scenario: A migration breaks the application
- **GIVEN** a production deployment whose smoke tests fail
- **WHEN** the failure is detected
- **THEN** the previous image is restored automatically and the team is notified

### Requirement: Backups and restore drills
The system SHALL back up the database daily and media weekly to encrypted off-site storage with 30
daily, 8 weekly and 6 monthly retention points, and SHALL be restore-tested quarterly.

#### Scenario: Restore drill
- **GIVEN** a quarterly drill
- **WHEN** the latest backup is restored into a scratch environment
- **THEN** the site starts and the newest content is present, and the elapsed time is recorded

### Requirement: Observability and alerting
The system SHALL collect application errors, uptime checks on the home page, a fixture endpoint and
the admin login, plus container and disk metrics, and SHALL alert a named on-call address.

#### Scenario: The site goes down at night
- **GIVEN** two consecutive failed uptime checks
- **WHEN** the second fails
- **THEN** an alert is delivered within five minutes

### Requirement: Hardened administration surface
The admin panel and API SHALL be rate-limited, served only over TLS with HSTS, protected by a
strict Content-Security-Policy, and SHALL support restricting `/admin` to an allowlisted network or
identity proxy when the association requires it.

#### Scenario: Admin access is restricted to the association network
- **GIVEN** the network restriction enabled
- **WHEN** a request to `/admin` arrives from outside the allowlist
- **THEN** it is refused before reaching the application
