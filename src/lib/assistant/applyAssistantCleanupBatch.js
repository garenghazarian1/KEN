import { nextLifecycleState } from "./assistantLifecycle";

/**
 * Apply Cheer-style idle/close transitions to a scanned batch.
 * Used by GET /api/cron/assistant-cleanup so the loop is unit-testable.
 *
 * @param {{
 *   conversations: Array<{ _id: unknown, status: string, lastMessageAt: Date | string }>,
 *   now?: Date,
 *   updateOne: (filter: object, update: object) => Promise<unknown>,
 * }} args
 * @returns {Promise<{ scanned: number, markedIdle: number, closed: number }>}
 */
export async function applyAssistantCleanupBatch({
  conversations,
  now = new Date(),
  updateOne,
}) {
  let markedIdle = 0;
  let closed = 0;

  for (const conversation of conversations) {
    const transition = nextLifecycleState(
      {
        status: conversation.status,
        lastMessageAt: new Date(conversation.lastMessageAt),
      },
      now
    );
    if (!transition.changed) continue;

    await updateOne(
      { _id: conversation._id },
      {
        $set: {
          status: transition.status,
          ...(transition.closedReason
            ? { closedReason: transition.closedReason }
            : {}),
        },
      }
    );

    if (transition.status === "idle") markedIdle += 1;
    if (transition.status === "closed") closed += 1;
  }

  return {
    scanned: conversations.length,
    markedIdle,
    closed,
  };
}
