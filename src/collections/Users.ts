import type { CollectionConfig } from 'payload'
import { ROLES, ROLE_LABELS, type Role } from '../access/roles'
import {
  readSelfOrSuperadmin,
  updateSelfOrSuperadmin,
  superadminOnly,
  rolesFieldAccess,
} from '../access'
import { auditRoleChange } from '../audit/hooks'

const roleOptions = ROLES.map((value: Role) => ({ value, label: ROLE_LABELS[value] }))

/**
 * Auth collection with the seven-role model (openspec/specs/admin-rbac).
 * Permissions are the union of a user's roles and are enforced in access
 * functions server-side. Session security: 8h idle token expiry and a
 * six-attempt login lockout with backoff. Two-factor is mandatory for
 * superadmin/editor — see the note on `twoFactorEnabled`.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { de: 'Benutzer', en: 'User' },
    plural: { de: 'Benutzer', en: 'Users' },
  },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8 hours idle
    maxLoginAttempts: 6, // a 7th attempt is refused with a backoff
    lockTime: 5 * 60 * 1000, // 5 minutes
    useAPIKey: false,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
    group: { de: 'System', en: 'System' },
  },
  access: {
    read: readSelfOrSuperadmin,
    create: superadminOnly,
    update: updateSelfOrSuperadmin,
    delete: superadminOnly,
    admin: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [auditRoleChange],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { de: 'Name', en: 'Name' },
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      label: { de: 'Rollen', en: 'Roles' },
      required: true,
      defaultValue: ['viewer'],
      options: roleOptions,
      // Only a superadmin may change roles — blocks privilege escalation.
      access: {
        update: rolesFieldAccess,
        create: rolesFieldAccess,
      },
      admin: {
        description: {
          de: 'Berechtigungen sind die Vereinigung aller zugewiesenen Rollen.',
          en: 'Permissions are the union of all assigned roles.',
        },
      },
    },
    {
      name: 'twoFactorEnabled',
      type: 'checkbox',
      label: { de: 'Zwei-Faktor aktiviert', en: 'Two-factor enabled' },
      defaultValue: false,
      admin: {
        description: {
          de: 'Für Superadmin und Redaktion verpflichtend. Die TOTP-Einrichtung folgt; dieses Feld verfolgt den Status.',
          en: 'Mandatory for superadmin and editor. TOTP enrolment is pending; this field tracks status.',
        },
      },
    },
  ],
}
