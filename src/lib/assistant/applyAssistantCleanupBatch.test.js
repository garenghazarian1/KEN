import { describe, expect, it, vi } from "vitest";
import { applyAssistantCleanupBatch } from "./applyAssistantCleanupBatch";
import {
  ASSISTANT_CLOSE_AFTER_MS,
  ASSISTANT_IDLE_AFTER_MS,
} from "./assistantRetention";

describe("applyAssistantCleanupBatch", () => {
  const now = new Date("2026-09-04T12:00:00.000Z");

  it("marks open rows idle and 24h rows closed; skips handed_off and fresh open", async () => {
    const updateOne = vi.fn().mockResolvedValue({ modifiedCount: 1 });
    const conversations = [
      {
        _id: "fresh",
        status: "open",
        lastMessageAt: now,
      },
      {
        _id: "idle-me",
        status: "open",
        lastMessageAt: new Date(now.getTime() - ASSISTANT_IDLE_AFTER_MS),
      },
      {
        _id: "close-me",
        status: "idle",
        lastMessageAt: new Date(now.getTime() - ASSISTANT_CLOSE_AFTER_MS),
      },
      {
        _id: "handoff",
        status: "handed_off",
        lastMessageAt: new Date(now.getTime() - ASSISTANT_CLOSE_AFTER_MS),
      },
    ];

    const result = await applyAssistantCleanupBatch({
      conversations,
      now,
      updateOne,
    });

    expect(result).toEqual({ scanned: 4, markedIdle: 1, closed: 1 });
    expect(updateOne).toHaveBeenCalledTimes(2);
    expect(updateOne).toHaveBeenCalledWith(
      { _id: "idle-me" },
      { $set: { status: "idle" } }
    );
    expect(updateOne).toHaveBeenCalledWith(
      { _id: "close-me" },
      { $set: { status: "closed", closedReason: "inactivity" } }
    );
  });
});
