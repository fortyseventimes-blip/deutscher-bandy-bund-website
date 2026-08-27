import type { CollectionBeforeChangeHook } from 'payload'
import type { AccessUser } from './roles'

/**
 * Shared beforeChange guard: only a publisher may move a document into the
 * published state (openspec/specs/admin-rbac). Mirrors the inline hook in
 * Pages.ts but factored out since several sport collections need the same
 * check. Trusted local-API / seed writes have no req.user and are allowed —
 * the collection's own access rules already gate who can reach the operation.
 */
export function publishGuard(
  canPublish: (user: AccessUser) => boolean,
  message = 'Sie sind nicht berechtigt, Inhalte zu veröffentlichen.',
): CollectionBeforeChangeHook {
  return async ({ data, req, originalDoc }) => {
    const becomingPublished =
      data._status === 'published' && originalDoc?._status !== 'published'
    if (becomingPublished && req.user && !canPublish(req.user as AccessUser)) {
      const { APIError } = await import('payload')
      throw new APIError(message, 403, undefined, true)
    }
    return data
  }
}
