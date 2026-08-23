import type { CollectionConfig } from 'payload'

/**
 * Auth collection. This is the FOUNDATION shape only — a single `name` plus the
 * built-in email/password auth. The seven-role RBAC model, 2FA and the access
 * matrix (openspec/specs/admin-rbac) land in task 1.11, not here.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { de: 'Benutzer', en: 'User' },
    plural: { de: 'Benutzer', en: 'Users' },
  },
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: { de: 'System', en: 'System' },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { de: 'Name', en: 'Name' },
      required: true,
    },
    {
      // Placeholder for the real role model in 1.11; kept simple for now.
      name: 'role',
      type: 'select',
      label: { de: 'Rolle', en: 'Role' },
      defaultValue: 'editor',
      options: [
        { label: 'Superadmin', value: 'superadmin' },
        { label: { de: 'Redaktion', en: 'Editor' }, value: 'editor' },
        { label: { de: 'Betrachter', en: 'Viewer' }, value: 'viewer' },
      ],
    },
  ],
}
