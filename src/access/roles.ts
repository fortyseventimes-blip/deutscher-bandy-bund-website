/**
 * The seven admin roles (openspec/specs/admin-rbac "Admin role set" and the
 * matrix in docs/engineering-handbook §7). A user carries an array of roles;
 * permissions are the union of their roles. All checks here are pure functions
 * so they can be unit-tested without a running Payload (see tests/unit/access).
 */
export const ROLES = [
  'superadmin',
  'editor',
  'author',
  'sports_manager',
  'media_manager',
  'translator',
  'viewer',
] as const

export type Role = (typeof ROLES)[number]

/** The minimal shape of a user the predicates need. */
export type AccessUser = {
  id?: string | number
  roles?: Role[] | null
} | null | undefined

export const ROLE_LABELS: Record<Role, { de: string; en: string }> = {
  superadmin: { de: 'Superadmin', en: 'Superadmin' },
  editor: { de: 'Redaktion', en: 'Editor' },
  author: { de: 'Autor', en: 'Author' },
  sports_manager: { de: 'Sportwart', en: 'Sports manager' },
  media_manager: { de: 'Medienverwaltung', en: 'Media manager' },
  translator: { de: 'Übersetzung', en: 'Translator' },
  viewer: { de: 'Betrachter', en: 'Viewer' },
}

/** Roles for which two-factor authentication is mandatory. */
export const TWO_FACTOR_REQUIRED_ROLES: Role[] = ['superadmin', 'editor']
