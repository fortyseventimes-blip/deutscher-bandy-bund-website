import fs from 'node:fs/promises'
import path from 'node:path'
import type { Payload } from 'payload'
import { IMAGE_EXTENSIONS, parsePlayerFilename, type TeamGender } from './filename'
import { ImportReport } from './report'

/**
 * Swap player photos, nothing else (`pnpm import:portraits`).
 *
 * For every `{gender}-{number}-…` image in `dir` it finds that team's player
 * by jersey number — not by name, so names corrected in /admin after the first
 * import (which also changes the slug) still match — and replaces the file of
 * the portrait the player already has. The player record itself is never
 * written: names, positions and publish state stay as the editors left them,
 * and the new photo is live at once without publishing anything again.
 */
export async function importPortraits(payload: Payload, dir: string): Promise<ImportReport> {
  const report = new ImportReport({
    review: 'Not replaced — please check',
    updated: 'Photo replaced (live immediately)',
  })

  const files = (await fs.readdir(dir))
    .filter((f) => IMAGE_EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext)))
    .sort()

  const teamIds = new Map<TeamGender, number | null>()
  const replaced = new Map<number, string>()

  for (const file of files) {
    const result = parsePlayerFilename(file)
    if (!result.ok) {
      report.add('error', file, result.error)
      continue
    }
    const { gender, number } = result.value

    if (!teamIds.has(gender)) {
      const team = await payload.find({ collection: 'teams', where: { slug: { equals: gender } }, limit: 1 })
      teamIds.set(gender, team.docs[0]?.id ?? null)
    }
    const teamId = teamIds.get(gender)
    if (teamId == null) {
      report.add('error', file, `team "${gender}" does not exist — run import:players first`)
      continue
    }

    const found = await payload.find({
      collection: 'players',
      where: { and: [{ team: { equals: teamId } }, { number: { equals: number } }] },
      draft: true,
      depth: 0,
      limit: 2,
    })
    if (found.docs.length === 0) {
      report.add('error', file, `no player with #${number} in ${gender} — run import:players first`)
      continue
    }
    if (found.docs.length > 1) {
      report.add('review', file, `several ${gender} players wear #${number} — set the photo in /admin`)
      continue
    }

    const player = found.docs[0]
    const who = `${player.firstName} ${player.lastName} (#${number}, ${gender})`
    const portraitId = typeof player.portrait === 'object' ? player.portrait?.id : player.portrait
    if (portraitId == null) {
      report.add('review', who, `has no portrait yet — upload ${file} in /admin`)
      continue
    }
    if (replaced.has(portraitId)) {
      report.add('review', who, `shares its photo with ${replaced.get(portraitId)} — set it in /admin`)
      continue
    }

    const filePath = path.join(dir, file)
    const media = await payload.findByID({ collection: 'media', id: portraitId, depth: 0 })
    if (media.filesize === (await fs.stat(filePath)).size) {
      report.add('info', who, 'photo already up to date')
      replaced.set(portraitId, who)
      continue
    }

    await payload.update({ collection: 'media', id: portraitId, data: {}, filePath })
    replaced.set(portraitId, who)
    report.add('updated', who, file)
  }

  return report
}
