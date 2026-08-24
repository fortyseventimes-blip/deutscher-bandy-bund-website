import type { CollectionConfig } from 'payload'
import { superadminOnly } from '../access'

/**
 * Append-only audit trail. Rows are written by the audit hooks via the local
 * API (overrideAccess); the admin UI can never create, edit or delete them.
 * Readable only by superadmin. Retention is twelve months — a scheduled prune
 * job is added with the jobs runner in a later slice (see the retention note).
 */
export const AuditLog: CollectionConfig = {
  slug: 'audit-log',
  labels: {
    singular: { de: 'Audit-Eintrag', en: 'Audit entry' },
    plural: { de: 'Audit-Log', en: 'Audit log' },
  },
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['action', 'collectionSlug', 'actorEmail', 'createdAt'],
    group: { de: 'System', en: 'System' },
    // Read-only log; hide the "create" affordance.
    hidden: ({ user }) => !(user?.roles as string[] | undefined)?.includes('superadmin'),
  },
  access: {
    read: superadminOnly,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  // createdAt/updatedAt provide the timestamp.
  fields: [
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        'create',
        'update',
        'publish',
        'unpublish',
        'delete',
        'role_change',
        'settings_change',
        'login_failed',
      ],
    },
    {
      name: 'actor',
      type: 'relationship',
      relationTo: 'users',
      admin: { description: { de: 'Auslösende Person', en: 'Responsible user' } },
    },
    { name: 'actorEmail', type: 'text', admin: { readOnly: true } },
    { name: 'collectionSlug', type: 'text', required: true },
    { name: 'documentId', type: 'text' },
    { name: 'documentLabel', type: 'text' },
    {
      name: 'changedFields',
      type: 'array',
      fields: [{ name: 'name', type: 'text' }],
    },
    { name: 'locale', type: 'text' },
  ],
}
