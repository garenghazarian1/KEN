import { reopenOnCustomerActivity } from "./assistantLifecycle";

/**
 * Reject closed conversations; reopen idle → open and bump lastMessageAt.
 * Mutates the conversation document in memory (caller must save).
 *
 * @param {{ status: string, lastMessageAt?: Date }} conversation
 * @param {{ now?: Date }} [options]
 * @returns {{ ok: true } | { ok: false, code: "CONVERSATION_CLOSED" }}
 */
export function touchConversationActivity(conversation, { now = new Date() } = {}) {
  if (conversation.status === "closed") {
    return { ok: false, code: "CONVERSATION_CLOSED" };
  }
  conversation.status = reopenOnCustomerActivity(conversation.status);
  conversation.lastMessageAt = now;
  return { ok: true };
}
