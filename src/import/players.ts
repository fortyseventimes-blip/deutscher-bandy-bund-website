import fs from 'node:fs/promises'
import path from 'node:path'
import type { Payload } from 'payload'
import type { Player } from '../payload-types'
import { slugifyName } from '../lib/slug'
import { IMAGE_EXTENSIONS, parsePlayerFilename, type TeamGender } from './filename'
import { ImportReport } from './report'

/**
 * One-off player import (openspec task 2.15, team-roster "Bulk player import").
 *
 * Reads every image in `dir` named `{gender}-{number}-{first}-{last}.jpg`, plus
 * an optional `players.json` next to them for what a filename cannot carry
 * (position, club, photo credit…). Each file becomes a portrait in the media
 * library and a player **draft** — nothing goes public until an editor
 * publishes it in /admin. Re-running is safe: players are matched by slug and
 * portraits by filename, so a second run only writes a new draft version.
 */

type Position = Player['position']

type PlayerOverrides = {
  firstName?: string
  lastName?: string
  number?: number
  position?: Position
  captain?: boolean
  club?: string
  birthYear?: number
  joinedYear?: number
  nationality?: string
  bio?: string
  credit?: string
  license?: string
}

export type PlayersManifest = {
  /** Default photo credit/licence for every file, e.g. "Instagram @account". */
  credit?: string
  license?: string
  players?: Record<string, PlayerOverrides>
}

const POSITIONS: Position[] = ['TW', 'VER', 'MF', 'ST']

const TEAM_DEFAULTS: Record<TeamGender, { name: string; slug: string }> = {
  herren: { name: 'Herren', slug: 'herren' },
  damen: { name: 'Damen', slug: 'damen' },
}

/** Jersey numbers used twice within one team — reported, never resolved. */
export function findNumberCollisions(
  rows: { file: string; gender: TeamGender; number: number }[],
): { gender: TeamGender; number: number; files: string[] }[] {
  const byKey = new Map<string, { gender: TeamGender; number: number; files: string[] }>()
  for (const r of rows) {
    const key = `${r.gender}:${r.number}`
    const entry = byKey.get(key) ?? { gender: r.gender, number: r.number, files: [] }
    entry.files.push(r.file)
    byKey.set(key, entry)
  }
  return [...byKey.values()].filter((e) => e.files.length > 1)
}

async function readManifest(dir: string, report: ImportReport): Promise<PlayersManifest> {
  const file = path.join(dir, 'players.json')
  try {
    return JSON.parse(await fs.readFile(file, 'utf8')) as PlayersManifest
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      report.add('info', 'players.json', 'not found — positions and photo credits must be set in /admin')
      return {}
    }
    throw new Error(`players.json is not valid JSON: ${(err as Error).message}`)
  }
}

export async function ensureTeam(
  payload: Payload,
  gender: TeamGender,
  report: ImportReport,
): Promise<number> {
  const { name, slug } = TEAM_DEFAULTS[gender]
  const found = await payload.find({ collection: 'teams', where: { slug: { equals: slug } }, limit: 1 })
  if (found.docs[0]) return found.docs[0].id
  const created = await payload.create({
    collection: 'teams',
    data: { name, slug, gender, crestCode: 'DEU', shortName: 'GER' },
  })
  report.add('created', `Team "${name}"`, 'did not exist yet — check name, coach and description in /admin')
  return created.id
}

async function ensurePortrait(
  payload: Payload,
  filePath: string,
  alt: string,
  credit: string | undefined,
  license: string | undefined,
): Promise<number> {
  const filename = path.basename(filePath)
  const found = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  if (found.docs[0]) return found.docs[0].id
  const created = await payload.create({
    collection: 'media',
    data: { alt, credit, license },
    filePath,
  })
  return created.id
}

export async function importPlayers(payload: Payload, dir: string): Promise<ImportReport> {
  const report = new ImportReport()
  const manifest = await readManifest(dir, report)
  const overrides = manifest.players ?? {}

  const files = (await fs.readdir(dir))
    .filter((f) => IMAGE_EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext)))
    .sort()

  for (const key of Object.keys(overrides)) {
    if (!files.includes(key)) report.add('review', key, 'listed in players.json but no such image file')
  }

  const parsed: { file: string; gender: TeamGender; number: number }[] = []
  const teamIds = new Map<TeamGender, number>()

  for (const file of files) {
    const result = parsePlayerFilename(file)
    if (!result.ok) {
      report.add('error', file, result.error)
      continue
    }
    const o = overrides[file] ?? {}
    const p = result.value
    const firstName = o.firstName ?? p.firstName
    const lastName = o.lastName ?? p.lastName
    const number = o.number ?? p.number
    const fullName = `${firstName} ${lastName}`
    const slug = slugifyName(`${firstName}-${lastName}`)
    parsed.push({ file, gender: p.gender, number })

    // A name given in players.json replaces the filename reading, so the
    // parser's "how did I split this name" notes no longer apply.
    const notes = o.firstName || o.lastName ? [] : [...p.review]
    if (o.position && !POSITIONS.includes(o.position)) {
      report.add('error', file, `position "${o.position}" is not one of ${POSITIONS.join(', ')}`)
      continue
    }
    if (!o.position) notes.push('no position — set it before publishing')
    const credit = o.credit ?? manifest.credit
    if (!credit) notes.push('no photo credit — required before launch')

    if (!teamIds.has(p.gender)) teamIds.set(p.gender, await ensureTeam(payload, p.gender, report))

    const portrait = await ensurePortrait(
      payload,
      path.join(dir, file),
      `${fullName}, Nr. ${number}`,
      credit,
      o.license ?? manifest.license,
    )

    const data = {
      firstName,
      lastName,
      slug,
      team: teamIds.get(p.gender)!,
      number,
      ...(o.position ? { position: o.position } : {}),
      playerStatus: 'active' as const,
      captain: o.captain ?? false,
      nationality: o.nationality ?? 'Deutschland',
      birthYear: o.birthYear,
      joinedYear: o.joinedYear,
      club: o.club,
      bio: o.bio,
      portrait,
      _status: 'draft' as const,
    }

    const existing = await payload.find({
      collection: 'players',
      where: { slug: { equals: slug } },
      limit: 1,
      draft: true,
    })
    if (existing.docs[0]) {
      await payload.update({ collection: 'players', id: existing.docs[0].id, data, draft: true })
      report.add('updated', `${fullName} (#${number}, ${p.gender})`, file)
    } else {
      // Position is required to publish; a draft may be saved without it.
      await payload.create({ collection: 'players', data: data as Omit<Player, 'id' | 'createdAt' | 'updatedAt'>, draft: true })
      report.add('created', `${fullName} (#${number}, ${p.gender})`, file)
    }
    for (const n of notes) report.add('review', `${fullName} (${file})`, n)
  }

  for (const c of findNumberCollisions(parsed)) {
    report.add('review', `Number ${c.number} (${c.gender})`, `used by ${c.files.join(', ')}`)
  }

  return report
}
