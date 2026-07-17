import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createIdleCloser,
  CHECK_IN_DELAY_MS,
  GOODBYE_DELAY_MS,
} from "./voiceLifecycle.js";

describe("createIdleCloser", () => {
  let onCheckIn;
  let onGoodbye;
  let closer;

  beforeEach(() => {
    vi.useFakeTimers();
    onCheckIn = vi.fn();
    onGoodbye = vi.fn();
    closer = createIdleCloser({ onCheckIn, onGoodbye });
  });

  afterEach(() => {
    closer.dispose();
    vi.useRealTimers();
  });

  it("fires the check-in after 15 seconds of silence following an assistant turn", () => {
    closer.noteAssistantTurnEnd();
    vi.advanceTimersByTime(CHECK_IN_DELAY_MS - 1);
    expect(onCheckIn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onCheckIn).toHaveBeenCalledTimes(1);
    expect(onGoodbye).not.toHaveBeenCalled();
    expect(closer.stage).toBe("checkin-spoken");
  });

  it("fires the goodbye 15 seconds after the check-in turn also ends", () => {
    closer.noteAssistantTurnEnd();
    vi.advanceTimersByTime(CHECK_IN_DELAY_MS);
    // The spoken check-in finishes → its own turn end arms the goodbye stage.
    closer.noteAssistantTurnEnd();
    vi.advanceTimersByTime(GOODBYE_DELAY_MS - 1);
    expect(onGoodbye).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onGoodbye).toHaveBeenCalledTimes(1);
    expect(closer.stage).toBe("closing");
  });

  it("resets to active on user activity before the check-in", () => {
    closer.noteAssistantTurnEnd();
    vi.advanceTimersByTime(CHECK_IN_DELAY_MS - 1000);
    closer.noteUserActivity();
    vi.advanceTimersByTime(CHECK_IN_DELAY_MS * 2);
    expect(onCheckIn).not.toHaveBeenCalled();
    expect(closer.stage).toBe("active");
  });

  it("returns to the check-in stage (not goodbye) after activity resets the cycle", () => {
    closer.noteAssistantTurnEnd();
    vi.advanceTimersByTime(CHECK_IN_DELAY_MS);
    closer.noteAssistantTurnEnd(); // goodbye armed
    closer.noteUserActivity(); // guest speaks — cancel goodbye
    closer.noteAssistantTurnEnd(); // next assistant turn ends
    vi.advanceTimersByTime(CHECK_IN_DELAY_MS);
    expect(onCheckIn).toHaveBeenCalledTimes(2);
    expect(onGoodbye).not.toHaveBeenCalled();
  });

  it("only closes once and ignores events after closing", () => {
    closer.noteAssistantTurnEnd();
    vi.advanceTimersByTime(CHECK_IN_DELAY_MS);
    closer.noteAssistantTurnEnd();
    vi.advanceTimersByTime(GOODBYE_DELAY_MS);
    expect(onGoodbye).toHaveBeenCalledTimes(1);

    closer.noteAssistantTurnEnd();
    closer.noteUserActivity();
    vi.advanceTimersByTime(CHECK_IN_DELAY_MS + GOODBYE_DELAY_MS);
    expect(onCheckIn).toHaveBeenCalledTimes(1);
    expect(onGoodbye).toHaveBeenCalledTimes(1);
    expect(closer.stage).toBe("closing");
  });

  it("dispose cancels pending timers", () => {
    closer.noteAssistantTurnEnd();
    closer.dispose();
    vi.advanceTimersByTime(CHECK_IN_DELAY_MS + GOODBYE_DELAY_MS);
    expect(onCheckIn).not.toHaveBeenCalled();
    expect(onGoodbye).not.toHaveBeenCalled();
  });
});
