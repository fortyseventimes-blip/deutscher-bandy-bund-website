import type { Access, FieldAccess } from 'payload'
import type { AccessUser } from './roles'
import {
  canAuthor,
  canManageSystem,
  canPublishContent,
  canPublishSport,
  canWriteContent,
  canWriteSport,
  isStaff,
  isSuperadmin,
} from './predicates'

/*
 * Payload access functions — thin adapters that pull `req.user` and delegate to
 * the pure predicates. Every rule is evaluated server-side on every request
 * (openspec/specs/admin-rbac: "never in the UI alone"). Read rules for public
 * collections return a constraint for anonymous visitors so drafts never leak
 * through the REST/GraphQL API, not only through the site loader.
 */

const userOf = (req: { user?: unknown }): AccessUser => (req.user ?? null) as AccessUser

export const superadminOnly: Access = ({ req }) => canManageSystem(userOf(req))

export const staffOnly: Access = ({ req }) => isStaff(userOf(req))

/** Published to everyone; drafts only to staff. For collections with a
 * draft/publish lifecycle (versions.drafts enabled). */
export const publicReadPublished: Access = ({ req }) => {
  if (isStaff(userOf(req))) return true
  return { _status: { equals: 'published' } }
}

/** Unconditionally public. For reference/structural collections with no
 * draft/publish lifecycle of their own (teams, staff, venues, opponents,
 * seasons, media) — everything in them is immediately live. */
export const publicRead: Access = () => true

/** Users may read themselves; superadmin reads everyone. */
export const readSelfOrSuperadmin: Access = ({ req }) => {
  const user = userOf(req)
  if (isSuperadmin(user)) return true
  if (!user?.id) return false
  return { id: { equals: user.id } }
}

/** Users may update themselves; superadmin updates anyone. */
export const updateSelfOrSuperadmin: Access = ({ req }) => {
  const user = userOf(req)
  if (isSuperadmin(user)) return true
  if (!user?.id) return false
  return { id: { equals: user.id } }
}

// --- Content (Inhalte) collections -----------------------------------------
export const createContent: Access = ({ req }) => canAuthor(userOf(req))

/** Editors write anything; authors only their own documents. */
export const updateContent: Access = ({ req }) => {
  const user = userOf(req)
  if (canWriteContent(user)) return true
  if (canAuthor(user) && user?.id) return { createdBy: { equals: user.id } }
  return false
}

export const deleteContent: Access = ({ req }) => canWriteContent(userOf(req))

// --- Sport (teams, players, staff, games, tournaments, venues, opponents,
// seasons, media) --------------------------------------------------------
export const createSport: Access = ({ req }) => canWriteSport(userOf(req))
export const updateSport: Access = ({ req }) => canWriteSport(userOf(req))
export const deleteSport: Access = ({ req }) => canWriteSport(userOf(req))

// --- Field-level -----------------------------------------------------------
/** Only a superadmin may change a user's roles (blocks privilege escalation). */
export const rolesFieldAccess: FieldAccess = ({ req }) => isSuperadmin(userOf(req))

export { canPublishContent, canPublishSport }
