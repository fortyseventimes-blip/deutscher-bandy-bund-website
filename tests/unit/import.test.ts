import { describe, it, expect } from 'vitest'
import { parsePlayerFilename } from '@/import/filename'
import { findNumberCollisions } from '@/import/players'
import { safeHttpUrl, validateHttpUrl } from '@/lib/url'
import { slugifyName } from '@/lib/slug'

describe('parsePlayerFilename', () => {
  it('reads {gender}-{number}-{first}-{last}', () => {
    const r = parsePlayerFilename('m-10-Jan-Kowalski.jpg')
    expect(r).toEqual({
      ok: true,
      value: { gender: 'herren', number: 10, firstName: 'Jan', lastName: 'Kowalski', review: [] },
    })
  })

  it('maps the women marker to damen and accepts any image extension', () => {
    const r = parsePlayerFilename('w-7-Anna-Berg.PNG')
    expect(r.ok && r.value.gender).toBe('damen')
  })

  it('treats underscores as spaces inside a name part', () => {
    const r = parsePlayerFilename('m-4-Eric-Arakaza_von_Hof.jpeg')
    expect(r.ok && r.value.lastName).toBe('Arakaza von Hof')
    expect(r.ok && r.value.review).toEqual([])
  })

  it('flags a last name split over several parts for review instead of guessing silently', () => {
    const r = parsePlayerFilename('m-4-Anna-Mueller-Schmidt.jpg')
    expect(r.ok && r.value.lastName).toBe('Mueller Schmidt')
    expect(r.ok && r.value.review).toHaveLength(1)
  })

  it('ignores the directory part of a path', () => {
    const r = parsePlayerFilename('C:\\bandy-players\\m-1-Lukas-Brandt.jpg')
    expect(r.ok && r.value.firstName).toBe('Lukas')
  })

  it.each([
    ['IMG_2024.jpg', 'does not match'],
    ['x-10-Jan-Kowalski.jpg', 'unknown gender marker'],
    ['m-ten-Jan-Kowalski.jpg', 'not a jersey number'],
    ['m-100-Jan-Kowalski.jpg', 'not a jersey number'],
    ['m-10--Kowalski.jpg', 'does not match'],
  ])('rejects %s', (name, message) => {
    const r = parsePlayerFilename(name)
    expect(r.ok).toBe(false)
    expect(!r.ok && r.error).toContain(message)
  })
})

describe('findNumberCollisions', () => {
  it('reports two players of the same team sharing a jersey number', () => {
    const collisions = findNumberCollisions([
      { file: 'a.jpg', gender: 'herren', number: 10 },
      { file: 'b.jpg', gender: 'herren', number: 10 },
      { file: 'c.jpg', gender: 'damen', number: 10 },
    ])
    expect(collisions).toEqual([{ gender: 'herren', number: 10, files: ['a.jpg', 'b.jpg'] }])
  })
})

describe('safeHttpUrl / validateHttpUrl', () => {
  it('accepts absolute http(s) links', () => {
    expect(safeHttpUrl('https://fib-tv.com/game/123')?.hostname).toBe('fib-tv.com')
    expect(validateHttpUrl('')).toBe(true)
    expect(validateHttpUrl(undefined)).toBe(true)
  })

  it('rejects scripts and relative paths', () => {
    expect(safeHttpUrl('javascript:alert(1)')).toBeNull()
    expect(safeHttpUrl('/spiele')).toBeNull()
    expect(validateHttpUrl('fib-tv.com/game')).not.toBe(true)
  })
})

describe('slugifyName', () => {
  it('transliterates German characters', () => {
    expect(slugifyName('Paul Nyström')).toBe('paul-nystroem')
    expect(slugifyName('Jörg Weiß')).toBe('joerg-weiss')
  })
})
