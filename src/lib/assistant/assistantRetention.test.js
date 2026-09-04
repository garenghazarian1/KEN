import { describe, expect, it } from "vitest";
import {
  ASSISTANT_CLOSE_AFTER_MS,
  ASSISTANT_IDLE_AFTER_MS,
  isPastCloseThreshold,
  isPastIdleThreshold,
} from "./assistantRetention";

describe("assistantRetention", () => {
  const now = new Date("2026-09-04T12:00:00.000Z");

  it("is not idle just before the 15 minute boundary", () => {
    expect(
      isPastIdleThreshold(new Date(now.getTime() - ASSISTANT_IDLE_AFTER_MS + 1), now)
    ).toBe(false);
  });

  it("is idle at exactly 15 minutes", () => {
    expect(
      isPastIdleThreshold(new Date(now.getTime() - ASSISTANT_IDLE_AFTER_MS), now)
    ).toBe(true);
  });

  it("is not past close just before 24 hours", () => {
    expect(
      isPastCloseThreshold(new Date(now.getTime() - ASSISTANT_CLOSE_AFTER_MS + 1), now)
    ).toBe(false);
  });

  it("is past close at exactly 24 hours", () => {
    expect(
      isPastCloseThreshold(new Date(now.getTime() - ASSISTANT_CLOSE_AFTER_MS), now)
    ).toBe(true);
  });
});
