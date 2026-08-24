# deutscher-bandy-bund-website

A website of the German Bandy Federation (private project).

Next.js 16 + Payload CMS 3 + PostgreSQL 17 + Tailwind CSS v4. The public site,
the admin panel (`/admin`) and the content API all run in one app.

## Run it locally

**Requirements:** Node.js 22+, [pnpm](https://pnpm.io) 9+, and Docker (for the
database). Then, from the project root:

```bash
pnpm install
pnpm dev:up
```

`pnpm dev:up` does everything in one go: it creates a local `.env` (with a fresh
secret), starts a PostgreSQL container, applies the migrations, seeds the base
content, and starts the dev server.

Open **http://localhost:3000** — click through `/spiele`, `/teams/herren`,
`/spieler/…`, `/turniere/…`. The admin panel is at **/admin** (the seeded login
is `admin@bandy-bund.de` / `changeme-admin-123`).

The public sport pages are driven by sample fixture data (`src/lib/data`), so
they render without any content setup; a CMS/API can be swapped in behind the
same accessors later.

### Useful scripts

| Command | What it does |
| --- | --- |
| `pnpm dev:up` | One-command setup + dev server (recommended) |
| `pnpm dev` | Dev server only (expects a database already running) |
| `pnpm dev:db` / `pnpm dev:db:down` | Start / stop just the Postgres container |
| `pnpm setup` | Create `.env`, migrate and seed (no server) |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm typecheck` · `pnpm test` | TypeScript check · unit tests |

### No Docker?

Run your own PostgreSQL, put its connection string in `DATABASE_URI` in `.env`
(see `.env.example`), then `pnpm setup && pnpm dev`.

## Language

German is the source language and `/` always opens in German; English is a
manual variant under `/en`, reachable via the language switch.

## Project docs

- `openspec/` — specifications and the relaunch change (source of truth)
- `docs/` — engineering handbook, admin manual, design brief
- `design/` — the design handoff and prototypes
