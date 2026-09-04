import {
  isPastCloseThreshold,
  isPastIdleThreshold,
} from "./assistantRetention";

/**
 * @typedef {"open" | "idle" | "handed_off" | "closed"} ConversationStatus
 * @typedef {"user_end" | "idle_timeout" | "panel_closed" | "connection_lost" | "inactivity" | "superseded"} ClosedReason
 *
 * @typedef {{
 *   status: ConversationStatus,
 *   lastMessageAt: Date,
 *   closedReason?: ClosedReason | null,
 * }} LifecycleSnapshot
 *
 * @typedef {{
 *   status: ConversationStatus,
 *   closedReason?: ClosedReason,
 *   changed: boolean,
 * }} LifecycleTransition
 */

/**
 * Pure transition for cron / inactivity processing.
 * Does not close on panel close — only inactivity thresholds.
 *
 * @param {LifecycleSnapshot} snap
 * @param {Date} [now]
 * @returns {LifecycleTransition}
 */
export function nextLifecycleState(snap, now = new Date()) {
  if (snap.status === "closed" || snap.status === "handed_off") {
    return { status: snap.status, changed: false };
  }

  if (isPastCloseThreshold(snap.lastMessageAt, now)) {
    return {
      status: "closed",
      closedReason: "inactivity",
      changed: true,
    };
  }

  if (snap.status === "open" && isPastIdleThreshold(snap.lastMessageAt, now)) {
    return { status: "idle", changed: true };
  }

  return { status: snap.status, changed: false };
}

/**
 * Explicit guest/admin close (not cron inactivity).
 *
 * @param {Exclude<ClosedReason, "inactivity" | "superseded">} reason
 * @returns {LifecycleTransition}
 */
export function closeConversationExplicitly(reason) {
  return {
    status: "closed",
    closedReason: reason,
    changed: true,
  };
}

/**
 * @param {ConversationStatus} status
 * @returns {ConversationStatus}
 */
export function reopenOnCustomerActivity(status) {
  if (status === "idle") return "open";
  return status;
}
