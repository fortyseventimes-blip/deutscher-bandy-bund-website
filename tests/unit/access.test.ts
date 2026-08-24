import { describe, it, expect } from 'vitest'
import type { AccessUser, Role } from '@/access/roles'
import {
  hasRole,
  isSuperadmin,
  isStaff,
  canWriteContent,
  canAuthor,
  canWriteSport,
  canWriteMedia,
  canManageSystem,
  canPublishContent,
  canPublishSport,
  canWriteInLocale,
  requiresTwoFactor,
} from '@/access/predicates'

const user = (...roles: Role[]): AccessUser => ({ id: 1, roles })
const anon: AccessUser = null

describe('role membership', () => {
  it('detects any of the given roles', () => {
    expect(hasRole(user('editor'), 'editor', 'author')).toBe(true)
    expect(hasRole(user('viewer'), 'editor', 'author')).toBe(false)
    expect(hasRole(anon, 'editor')).toBe(false)
  })

  it('isStaff is true for any assigned role and false for anonymous', () => {
    expect(isStaff(user('viewer'))).toBe(true)
    expect(isStaff(anon)).toBe(false)
    expect(isStaff({ id: 1, roles: [] })).toBe(false)
  })
})

describe('content (Inhalte) group', () => {
  it('only superadmin and editor may write content', () => {
    expect(canWriteContent(user('superadmin'))).toBe(true)
    expect(canWriteContent(user('editor'))).toBe(true)
    expect(canWriteContent(user('author'))).toBe(false)
    expect(canWriteContent(user('sports_manager'))).toBe(false)
    expect(canWriteContent(user('viewer'))).toBe(false)
  })

  it('authors may author but not publish', () => {
    expect(canAuthor(user('author'))).toBe(true)
    expect(canPublishContent(user('author'))).toBe(false)
    expect(canPublishContent(user('editor'))).toBe(true)
  })
})

describe('sport group', () => {
  it('sports_manager writes and publishes sport, but not general content', () => {
    expect(canWriteSport(user('sports_manager'))).toBe(true)
    expect(canPublishSport(user('sports_manager'))).toBe(true)
    expect(canWriteContent(user('sports_manager'))).toBe(false)
  })
})

describe('media and system groups', () => {
  it('media_manager writes media only', () => {
    expect(canWriteMedia(user('media_manager'))).toBe(true)
    expect(canWriteContent(user('media_manager'))).toBe(false)
    expect(canManageSystem(user('media_manager'))).toBe(false)
  })

  it('only superadmin manages system', () => {
    expect(canManageSystem(user('superadmin'))).toBe(true)
    expect(isSuperadmin(user('editor'))).toBe(false)
    expect(canManageSystem(user('editor'))).toBe(false)
  })
})

describe('translator locale rule', () => {
  it('translator may write non-default locales only', () => {
    expect(canWriteInLocale(user('translator'), 'de')).toBe(false)
    expect(canWriteInLocale(user('translator'), 'en')).toBe(true)
    expect(canWriteInLocale(user('translator'), undefined)).toBe(false)
  })

  it('editors may write any locale, viewers none', () => {
    expect(canWriteInLocale(user('editor'), 'de')).toBe(true)
    expect(canWriteInLocale(user('editor'), 'en')).toBe(true)
    expect(canWriteInLocale(user('viewer'), 'en')).toBe(false)
  })
})

describe('two-factor requirement', () => {
  it('is required for superadmin and editor only', () => {
    expect(requiresTwoFactor(user('superadmin'))).toBe(true)
    expect(requiresTwoFactor(user('editor'))).toBe(true)
    expect(requiresTwoFactor(user('author'))).toBe(false)
    expect(requiresTwoFactor(user('sports_manager', 'editor'))).toBe(true)
  })
})

describe('union of multiple roles', () => {
  it('grants the union of permissions', () => {
    const u = user('translator', 'sports_manager')
    expect(canWriteSport(u)).toBe(true)
    expect(canWriteInLocale(u, 'en')).toBe(true)
    expect(canWriteContent(u)).toBe(false)
  })
})
