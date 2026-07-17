/**
 * Two-stage inactivity closer for the voice conversation.
 *
 * After an assistant turn ends, 15s of silence triggers a spoken check-in
 * ("Anything else?"). If the check-in turn also ends and another 15s passes
 * with no activity, the goodbye stage fires and the conversation closes.
 * Any user activity (speech, typing, interaction) resets to the active stage.
 *
 * Pure module — timers are injectable so the lifecycle is unit-testable.
 */

export const CHECK_IN_DELAY_MS = 15_000;
export const GOODBYE_DELAY_MS = 15_000;

/**
 * @param {{
 *   onCheckIn: () => void,
 *   onGoodbye: () => void,
 *   checkInDelayMs?: number,
 *   goodbyeDelayMs?: number,
 *   schedule?: (fn: () => void, ms: number) => any,
 *   cancel?: (handle: any) => void,
 * }} options
 */
export function createIdleCloser({
  onCheckIn,
  onGoodbye,
  checkInDelayMs = CHECK_IN_DELAY_MS,
  goodbyeDelayMs = GOODBYE_DELAY_MS,
  schedule = (fn, ms) => setTimeout(fn, ms),
  cancel = (handle) => clearTimeout(handle),
}) {
  /** @type {"active"|"checkin-armed"|"checkin-spoken"|"goodbye-armed"|"closing"} */
  let stage = "active";
  let timer = null;

  const clearTimer = () => {
    if (timer !== null) {
      cancel(timer);
      timer = null;
    }
  };

  return {
    get stage() {
      return stage;
    },
    /** Call when an assistant spoken turn has fully finished. */
    noteAssistantTurnEnd() {
      if (stage === "closing") return;
      clearTimer();
      if (stage === "checkin-spoken") {
        stage = "goodbye-armed";
        timer = schedule(() => {
          timer = null;
          stage = "closing";
          onGoodbye();
        }, goodbyeDelayMs);
      } else {
        stage = "checkin-armed";
        timer = schedule(() => {
          timer = null;
          stage = "checkin-spoken";
          onCheckIn();
        }, checkInDelayMs);
      }
    },
    /** Call on any user activity: speech, typing, or interaction. */
    noteUserActivity() {
      if (stage === "closing") return;
      clearTimer();
      stage = "active";
    },
    dispose() {
      clearTimer();
      stage = "closing";
    },
  };
}
