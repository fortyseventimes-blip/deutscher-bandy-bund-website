import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  Payload,
  PayloadRequest,
} from 'payload'

/*
 * Audit trail (openspec/specs/admin-rbac "Audit log"): record actor, action,
 * collection, document, timestamp and changed field names for every create,
 * publish, unpublish, delete, role change and settings change. Writes go
 * through the local API with overrideAccess; the collection itself is
 * superadmin-read and never UI-writable. An audit write never throws into the
 * originating operation — a failed log must not roll back real content.
 */

export type AuditAction =
  | 'create'
  | 'update'
  | 'publish'
  | 'unpublish'
  | 'delete'
  | 'role_change'
  | 'settings_change'
  | 'login_failed'

type WriteArgs = {
  action: AuditAction
  collectionSlug: string
  documentId?: string | number
  documentLabel?: string
  changedFields?: string[]
  locale?: string
}

async function writeAudit(
  payload: Payload,
  req: PayloadRequest | undefined,
  args: WriteArgs,
): Promise<void> {
  try {
    const user = (req?.user ?? null) as { id?: number; email?: string } | null
    await payload.create({
      collection: 'audit-log',
      overrideAccess: true,
      data: {
        action: args.action,
        actor: user?.id ?? undefined,
        actorEmail: user?.email ?? 'system',
        collectionSlug: args.collectionSlug,
        documentId: args.documentId != null ? String(args.documentId) : undefined,
        documentLabel: args.documentLabel,
        changedFields: (args.changedFields ?? []).map((name) => ({ name })),
        locale: args.locale,
      },
    })
  } catch (err) {
    payload?.logger?.error({ err }, 'audit: failed to write audit row')
  }
}

const IGNORED_FIELDS = new Set(['updatedAt', 'createdAt'])

function changedKeys(doc: Record<string, unknown>, prev?: Record<string, unknown>): string[] {
  if (!prev) return []
  const keys = new Set([...Object.keys(doc), ...Object.keys(prev)])
  const changed: string[] = []
  for (const key of keys) {
    if (IGNORED_FIELDS.has(key)) continue
    if (JSON.stringify(doc[key]) !== JSON.stringify(prev[key])) changed.push(key)
  }
  return changed
}

function labelOf(doc: Record<string, unknown>): string | undefined {
  const candidate = doc.title ?? doc.name ?? doc.slug ?? doc.email
  return typeof candidate === 'string' ? candidate : undefined
}

/** afterChange hook for editorially-owned collections. */
export function auditAfterChange(collectionSlug: string): CollectionAfterChangeHook {
  return async ({ doc, previousDoc, req, operation }) => {
    if (collectionSlug === 'audit-log') return doc
    let action: AuditAction = operation === 'create' ? 'create' : 'update'
    if (operation === 'update' && previousDoc && doc._status !== previousDoc._status) {
      if (doc._status === 'published') action = 'publish'
      else if (previousDoc._status === 'published') action = 'unpublish'
    }
    await writeAudit(req.payload, req, {
      action,
      collectionSlug,
      documentId: doc.id,
      documentLabel: labelOf(doc),
      changedFields: operation === 'update' ? changedKeys(doc, previousDoc) : undefined,
      locale: typeof req.locale === 'string' ? req.locale : undefined,
    })
    return doc
  }
}

/** afterDelete hook. */
export function auditAfterDelete(collectionSlug: string): CollectionAfterDeleteHook {
  return async ({ doc, req, id }) => {
    await writeAudit(req.payload, req, {
      action: 'delete',
      collectionSlug,
      documentId: id,
      documentLabel: labelOf(doc),
    })
    return doc
  }
}

/** afterChange hook specialised for the users collection: logs role changes. */
export const auditRoleChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  const before = JSON.stringify(previousDoc?.roles ?? [])
  const after = JSON.stringify(doc?.roles ?? [])
  if (operation === 'update' && before !== after) {
    await writeAudit(req.payload, req, {
      action: 'role_change',
      collectionSlug: 'users',
      documentId: doc.id,
      documentLabel: labelOf(doc),
      changedFields: ['roles'],
    })
  }
  return doc
}

/** afterChange hook for globals: logs a settings change. */
export function auditGlobalChange(slug: string): GlobalAfterChangeHook {
  return async ({ doc, previousDoc, req }) => {
    await writeAudit(req.payload, req, {
      action: 'settings_change',
      collectionSlug: `global:${slug}`,
      changedFields: changedKeys(
        doc as Record<string, unknown>,
        previousDoc as Record<string, unknown>,
      ),
      locale: typeof req.locale === 'string' ? req.locale : undefined,
    })
    return doc
  }
}
