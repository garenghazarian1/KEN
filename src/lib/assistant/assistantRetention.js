/** Idle after this much inactivity (no messages). */
export const ASSISTANT_IDLE_AFTER_MS = 15 * 60 * 1000;

/** Close after this much inactivity (server cron). */
export const ASSISTANT_CLOSE_AFTER_MS = 24 * 60 * 60 * 1000;

/**
 * @param {Date} lastMessageAt
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isPastIdleThreshold(lastMessageAt, now = new Date()) {
  return now.getTime() - lastMessageAt.getTime() >= ASSISTANT_IDLE_AFTER_MS;
}

/**
 * @param {Date} lastMessageAt
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isPastCloseThreshold(lastMessageAt, now = new Date()) {
  return now.getTime() - lastMessageAt.getTime() >= ASSISTANT_CLOSE_AFTER_MS;
}
