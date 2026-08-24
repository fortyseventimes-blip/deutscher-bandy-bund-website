import type { AccessUser, Role } from './roles'
import { TWO_FACTOR_REQUIRED_ROLES } from './roles'

/*
 * Pure permission predicates — the single source of truth for "who may do what".
 * Every Payload access function (src/access/index.ts) is a thin wrapper over one
 * of these. Keeping them pure and user-first makes the RBAC matrix unit-testable
 * (design.md testing strategy: "RBAC predicates, one per rule, unit-tested").
 */

export function rolesOf(user: AccessUser): Role[] {
  return user?.roles ?? []
}

export function hasRole(user: AccessUser, ...roles: Role[]): boolean {
  const owned = rolesOf(user)
  return roles.some((r) => owned.includes(r))
}

export const isAuthenticated = (user: AccessUser): boolean => Boolean(user)

export const isSuperadmin = (user: AccessUser): boolean => hasRole(user, 'superadmin')

/** Any account that can sign in to the admin panel at all. */
export const isStaff = (user: AccessUser): boolean => rolesOf(user).length > 0

// --- Content group: "Inhalte" (pages, articles) ----------------------------
export const canWriteContent = (user: AccessUser): boolean =>
  hasRole(user, 'superadmin', 'editor')

/** Authors may create and edit their OWN drafts, but never publish. */
export const canAuthor = (user: AccessUser): boolean =>
  hasRole(user, 'superadmin', 'editor', 'author')

// --- Sport group -----------------------------------------------------------
export const canWriteSport = (user: AccessUser): boolean =>
  hasRole(user, 'superadmin', 'editor', 'sports_manager')

// --- Marketing group -------------------------------------------------------
export const canWriteMarketing = (user: AccessUser): boolean =>
  hasRole(user, 'superadmin', 'editor')

// --- Media group -----------------------------------------------------------
export const canWriteMedia = (user: AccessUser): boolean =>
  hasRole(user, 'superadmin', 'editor', 'media_manager')

// --- Website group (nav, pages-as-chrome) ----------------------------------
export const canWriteWebsite = (user: AccessUser): boolean => hasRole(user, 'superadmin')

// --- System group (users, settings, audit) ---------------------------------
export const canManageSystem = (user: AccessUser): boolean => hasRole(user, 'superadmin')

// --- Publish rights --------------------------------------------------------
export const canPublishContent = (user: AccessUser): boolean =>
  hasRole(user, 'superadmin', 'editor')

export const canPublishSport = (user: AccessUser): boolean =>
  hasRole(user, 'superadmin', 'editor', 'sports_manager')

// --- Locale rules ----------------------------------------------------------
/**
 * A translator may only touch non-default locales. Given the active request
 * locale, decide whether this user may write. Non-translator writers are
 * unaffected; a translator is refused on the German source.
 */
export function canWriteInLocale(
  user: AccessUser,
  locale: string | undefined,
  defaultLocale = 'de',
): boolean {
  if (hasRole(user, 'superadmin', 'editor')) return true
  if (hasRole(user, 'translator')) return Boolean(locale) && locale !== defaultLocale
  return false
}

// --- Two-factor ------------------------------------------------------------
export const requiresTwoFactor = (user: AccessUser): boolean =>
  TWO_FACTOR_REQUIRED_ROLES.some((r) => rolesOf(user).includes(r))
