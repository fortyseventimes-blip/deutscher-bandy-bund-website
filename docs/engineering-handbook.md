# Engineering Handbook — bandy-bund.de

## 1. Repository structure

One repository. One deployable image. Payload lives inside the Next.js app.

```
bandy-bund/
├── openspec/                    # the specs are part of the repo, not a wiki
│   ├── project.md
│   ├── AGENTS.md
│   ├── specs/<capability>/spec.md
│   └── changes/<change-id>/{proposal,design,tasks}.md
├── src/
│   ├── app/
│   │   ├── (site)/[locale]/     # public site
│   │   │   ├── page.tsx                    # /
│   │   │   ├── news/[...]/
│   │   │   ├── teams/[slug]/
│   │   │   ├── spieler/[slug]/
│   │   │   ├── spiele/[slug]/
│   │   │   ├── turniere/[slug]/
│   │   │   └── [...slug]/page.tsx          # CMS pages, catch-all
│   │   ├── (payload)/admin/[[...segments]]/
│   │   └── api/
│   │       ├── ai/[action]/route.ts        # Claude proxy — server only
│   │       ├── newsletter/{subscribe,confirm,unsubscribe}/
│   │       ├── public/{fixtures,results,squads}/route.ts
│   │       └── revalidate/route.ts
│   ├── collections/             # one file per Payload collection
│   ├── globals/                 # header, footer, site-settings, seo-defaults
│   ├── blocks/                  # <Block>.config.ts + <Block>.tsx, colocated
│   ├── components/              # ui/ primitives, shared/ composites
│   ├── ai/
│   │   ├── actions/             # one module per action
│   │   ├── prompts/             # versioned templates: draft-article.v1.ts
│   │   ├── schemas/             # Zod output schemas
│   │   └── guards.ts            # authz, quota, fencing, sanitize
│   ├── lib/                     # seo/, ical/, jsonld/, i18n/, format/
│   ├── access/                  # RBAC predicates, one per rule, unit-tested
│   ├── migrations/              # generated, committed, never edited by hand
│   └── payload.config.ts
├── messages/{de,en}.json        # interface strings
├── tests/{unit,integration,e2e}/
├── infra/
│   ├── compose.yml
│   ├── compose.staging.yml
│   ├── compose.production.yml
│   ├── Caddyfile
│   └── backup/
├── .github/workflows/{ci,deploy-staging,deploy-production,backup-verify}.yml
├── Dockerfile
└── .env.example
```

**Rule:** a block is one folder-neighbour pair — its Payload config and its React component sit next
to each other. If you can add a block without touching more than two files plus a registry, the
architecture is right.

---

## 2. Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Runtime | Node.js 22 LTS, pnpm | LTS through 2027 |
| Language | TypeScript 5, `strict` | the content model is the type system |
| Framework | Next.js 16, App Router, React 19 | server components, tag revalidation, built-in OG images |
| CMS | Payload 3.88+ | mounts inside Next; blocks, drafts, versions, live preview, field-level access |
| Database | PostgreSQL 17 | relational content, real constraints |
| Styling | Tailwind v4 + CSS custom properties | tokens are the source of truth for both design and code |
| Primitives | Radix | accessible dialogs, menus, tabs without reinvention |
| Rich text | Lexical | Payload default, JSON output, no HTML soup |
| Media | sharp, AVIF/WebP, focal point | one upload, every crop |
| Search | Postgres full-text (`tsvector`) | no extra service at this content volume |
| Forms | Payload form builder + server actions | editors build forms, developers don't |
| Bot defence | Cloudflare Turnstile or Friendly Captcha | EU-hosted, no consent needed |
| Email | SMTP via an EU provider, `@payloadcms/email-nodemailer` | transactional only |
| AI | Anthropic Messages API, model pinned by env | server-side proxy, closed action catalogue |
| i18n | Payload localization + next-intl | localized slugs, localized admin |
| Analytics | Plausible or Umami, self-hosted | cookieless, so rejecting consent costs nothing |
| Errors | Sentry (EU region or self-hosted) | |
| Uptime | Uptime Kuma | three endpoints, five-minute alerting |
| Proxy | Caddy | automatic TLS, simple config |
| Containers | Docker + Compose | one VPS, no orchestrator needed |
| Backups | restic to off-site object storage | encrypted, deduplicated, restore-tested |
| Tests | Vitest, Playwright, axe-core, Lighthouse CI | |
| Quality | ESLint 9, Prettier, lefthook, commitlint | |

**Deliberately not chosen:** Kubernetes (no scale need), a separate headless CMS service (two
deploys, two auth systems), Redis (Postgres handles the session and job load here), a paid SaaS CMS
(the federation must own its data and its bill).

---

## 3. Git flow

Trunk-based with short-lived branches and tagged releases. Full GitFlow with a permanent `develop`
branch is more ceremony than a two-to-four-person team can service.

```
feat/roster-editor ──┐
fix/ical-timezone ───┼──► main ──────────────────────► tag v1.4.0 ──► production
chore/bump-payload ──┘   (auto-deploys to staging)      (manual approval, deploys to prod)

hotfix/consent-banner ──────────────────────────────► tag v1.4.1 ──► production
                        └──────► back-merge to main
```

| Branch | Rule |
| --- | --- |
| `main` | Protected. Always deployable. Every merge deploys to **staging**. |
| `feat/*`, `fix/*`, `chore/*`, `docs/*`, `spec/*` | Branch from `main`, live under three days, squash-merged. |
| `hotfix/*` | Branch from the production tag, released as a patch tag, back-merged to `main` the same day. |

**Rules**

1. No direct pushes to `main`. One approving review, all checks green.
2. Conventional Commits. `feat(games): add postponed status` — the changelog writes itself.
3. Every PR title carries the OpenSpec change id: `feat(ai): add translate action [relaunch-bandy-bund]`.
4. A PR that changes behaviour without updating `openspec/specs/` fails review, not just CI.
5. Production releases are tags on `main`, semver. `v1.4.0` for features, `v1.4.1` for fixes.
6. Migrations are generated, committed and reviewed. Never hand-edit a generated migration.

---

## 4. Environments

| | local | staging | production |
| --- | --- | --- | --- |
| Trigger | developer | merge to `main` | tag `v*` + manual approval |
| Domain | `localhost:3000` | `staging.bandy-bund.de` | `bandy-bund.de` |
| Data | seed fixtures | anonymized copy, refreshed weekly | real |
| Robots | n/a | `Disallow: /` + HTTP basic auth | open |
| AI | mocked by default | live, low quota | live, full quota |
| Email | Mailpit | catch-all inbox | real sender domain |

Staging must be crawler-proof and password-protected. A staging site that gets indexed will
cannibalize the production site's rankings for months.

---

## 5. CI/CD

### `ci.yml` — every pull request

```
setup (pnpm cache)
  ├─ typecheck
  ├─ lint + format check
  ├─ unit tests            (Vitest)
  ├─ openspec validate --strict
  └─ build
        ├─ integration     (Postgres service; RBAC matrix: role × collection × operation)
        ├─ e2e             (Playwright against the built app)
        ├─ a11y            (axe-core on every page template)
        └─ perf            (Lighthouse CI budgets on /, /spiele, a game, a player)
```

Fails on: any red job, a performance budget regression, a new accessibility violation, or a stale
spec.

### `deploy-staging.yml` — push to `main`

1. Build the image, tag it `ghcr.io/<org>/bandy-bund:<sha>` and `:staging`, push.
2. SSH to the VPS, `docker compose pull && docker compose up -d` in the staging stack.
3. `pnpm payload migrate`.
4. Smoke: `/` returns 200, `/admin` returns 200, the fixtures endpoint returns JSON.
5. Post the result to the team channel.

### `deploy-production.yml` — tag `v*`

1. **Manual approval gate** on a protected GitHub Environment.
2. Database dump to off-site storage; abort the release if the dump fails.
3. Retag the already-verified staging digest as `:production` — **no rebuild**, so the artifact that
   was tested is the artifact that ships.
4. `docker compose up -d` with a health-checked rolling restart.
5. `pnpm payload migrate`.
6. Smoke tests plus a Playwright critical-path run.
7. On failure: retag the previous digest, restart, alert. Recorded rollback time target: under
   five minutes.
8. Create the GitHub release with the generated changelog.

### `backup-verify.yml` — weekly

Restore the newest backup into a scratch container, assert the row counts and the newest published
article, then tear it down. A backup nobody has restored is a rumour.

---

## 6. Secrets

Repository secrets live in GitHub Environments, scoped per environment. Server secrets live in an
`.env` file owned by root, mode 600, encrypted at rest with SOPS + age and committed as
`infra/secrets/<env>.env.enc`. Keys rotate on staff change and at least annually.

`ANTHROPIC_API_KEY` exists only on the server, is never referenced in a `NEXT_PUBLIC_*` variable,
and CI greps the client bundle for it as a build-time assertion.

---

## 7. Role model

### Admin panel

| Role | Inhalte | Sport | Marketing | Website | System | Publish | AI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **superadmin** | RW | RW | RW | RW | RW | yes | yes |
| **editor** | RW | RW | RW | R | – | yes | yes |
| **author** | own drafts | R | – | – | – | no | yes |
| **sports_manager** | R | RW | – | – | – | sport only | yes |
| **media_manager** | media + galleries RW | R | – | – | – | media only | alt-text only |
| **translator** | non-default locale only | non-default locale only | – | – | – | non-default locale | translate only |
| **viewer** | R | R | R | R | – | no | no |

Enforced in Payload `access` functions, evaluated server-side on every request. The UI hides what a
role cannot do; the API refuses it. Both are tested — the integration suite asserts allow or 403 for
every role × collection × operation cell.

Two-factor authentication is mandatory for `superadmin` and `editor`. Sessions expire after eight
hours idle. Six failed logins from one address trigger a backoff.

### Public website

| Role | Capabilities |
| --- | --- |
| **anonymous** | Read all published content; subscribe to the newsletter; submit the contact form; download `.ics`; consume RSS and the public JSON endpoints |
| **subscriber** | Everything above, plus preference management and unsubscribe through a signed, single-use, 30-day token link — **no account, no password** |
| **member** *(phase 2, not in v1)* | Authenticated area for association members: internal documents, training plans, member directory |

**Decision:** v1 ships with **no public user accounts**. Accounts mean password storage, reset
flows, session security, GDPR access-and-deletion requests and a permanent attack surface — for
zero benefit to any of the five jobs the site exists to do. Token links deliver the same subscriber
experience with none of that. Revisit only when a member area is actually funded and staffed.

---

## 8. Operations

| Task | Cadence | Owner |
| --- | --- | --- |
| Dependency updates (Renovate, grouped) | weekly | maintainer |
| Payload and Next minor upgrades | monthly, on staging first | maintainer |
| Backup restore drill | quarterly | maintainer |
| Access review — who still needs which role | quarterly | superadmin |
| AI usage and cost review | monthly | product owner |
| Broken-link and redirect audit | quarterly | editor |
| Legal review of Impressum and privacy notice | annually or on any new third-party service | board |
| Lighthouse and accessibility regression sweep | monthly | maintainer |

**Incident procedure:** alert fires → check Uptime Kuma and Sentry → if the last deploy is the
suspect, roll back to the previous tag first and diagnose second → post a short note in the team
channel → write the cause into the next PR description. No blameless-postmortem template needed at
this size; a written cause is enough.
