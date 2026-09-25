/**
 * Player card filenames: `{gender}-{number}-{first}-{last}.{ext}`
 * (openspec/specs/team-roster "Bulk player import"), e.g.
 * `m-10-Jan-Kowalski.jpg`. Inside a name part an underscore stands for a space
 * (`w-7-Anna_Lena-Berg.jpg`). The parser never guesses: anything it had to
 * interpret is returned as a `review` note for the run report.
 */

export type TeamGender = 'herren' | 'damen'

export type ParsedPlayerFile = {
  gender: TeamGender
  number: number
  firstName: string
  lastName: string
  /** Assumptions a human should confirm (listed in the run report). */
  review: string[]
}

export type ParseResult = { ok: true; value: ParsedPlayerFile } | { ok: false; error: string }

const GENDER_MARKERS: Record<string, TeamGender> = {
  m: 'herren',
  h: 'herren',
  herren: 'herren',
  men: 'herren',
  w: 'damen',
  f: 'damen',
  d: 'damen',
  damen: 'damen',
  women: 'damen',
}

export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const

function stripExtension(filename: string): string {
  const lower = filename.toLowerCase()
  const ext = IMAGE_EXTENSIONS.find((e) => lower.endsWith(e))
  return ext ? filename.slice(0, -ext.length) : filename
}

const namePart = (s: string) => s.replace(/_/g, ' ').trim()

export function parsePlayerFilename(filename: string): ParseResult {
  const base = stripExtension(filename.split(/[\\/]/).pop() ?? filename)
  const parts = base.split('-').map((p) => p.trim())

  if (parts.length < 4 || parts.some((p) => p === '')) {
    return {
      ok: false,
      error: `"${filename}" does not match {gender}-{number}-{first}-{last}`,
    }
  }

  const [genderRaw, numberRaw, firstRaw, ...lastParts] = parts
  const gender = GENDER_MARKERS[genderRaw.toLowerCase()]
  if (!gender) {
    return { ok: false, error: `"${filename}": unknown gender marker "${genderRaw}" (use m or w)` }
  }

  if (!/^\d{1,2}$/.test(numberRaw)) {
    return { ok: false, error: `"${filename}": "${numberRaw}" is not a jersey number (0–99)` }
  }

  const review: string[] = []
  if (lastParts.length > 1) {
    review.push(
      `last name read as "${lastParts.map(namePart).join(' ')}" from ${lastParts.length} parts — ` +
        'use "_" for spaces inside a name to avoid this',
    )
  }

  return {
    ok: true,
    value: {
      gender,
      number: Number(numberRaw),
      firstName: namePart(firstRaw),
      lastName: lastParts.map(namePart).join(' '),
      review,
    },
  }
}
