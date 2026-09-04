import { describe, expect, it } from "vitest";
import {
  closeConversationExplicitly,
  nextLifecycleState,
  reopenOnCustomerActivity,
} from "./assistantLifecycle";
import {
  ASSISTANT_CLOSE_AFTER_MS,
  ASSISTANT_IDLE_AFTER_MS,
} from "./assistantRetention";

describe("assistantLifecycle", () => {
  const base = new Date("2026-09-04T12:00:00.000Z");

  it("marks open conversations idle after the idle threshold", () => {
    const lastMessageAt = new Date(base.getTime() - ASSISTANT_IDLE_AFTER_MS);
    const result = nextLifecycleState({ status: "open", lastMessageAt }, base);
    expect(result).toEqual({ status: "idle", changed: true });
  });

  it("closes idle conversations after the close threshold", () => {
    const lastMessageAt = new Date(base.getTime() - ASSISTANT_CLOSE_AFTER_MS);
    const result = nextLifecycleState({ status: "idle", lastMessageAt }, base);
    expect(result.changed).toBe(true);
    expect(result.status).toBe("closed");
    expect(result.closedReason).toBe("inactivity");
  });

  it("closes open conversations after the close threshold without lingering in idle", () => {
    const lastMessageAt = new Date(base.getTime() - ASSISTANT_CLOSE_AFTER_MS);
    const result = nextLifecycleState({ status: "open", lastMessageAt }, base);
    expect(result).toEqual({
      status: "closed",
      closedReason: "inactivity",
      changed: true,
    });
  });

  it("does not change already closed conversations", () => {
    const result = nextLifecycleState(
      {
        status: "closed",
        lastMessageAt: new Date(0),
      },
      base
    );
    expect(result).toEqual({ status: "closed", changed: false });
  });

  it("does not change handed_off conversations via inactivity", () => {
    const lastMessageAt = new Date(base.getTime() - ASSISTANT_CLOSE_AFTER_MS);
    const result = nextLifecycleState(
      { status: "handed_off", lastMessageAt },
      base
    );
    expect(result).toEqual({ status: "handed_off", changed: false });
  });

  it("closes explicitly for guest end", () => {
    const result = closeConversationExplicitly("user_end");
    expect(result).toEqual({
      status: "closed",
      closedReason: "user_end",
      changed: true,
    });
  });

  it("leaves open conversations unchanged before the idle threshold", () => {
    const lastMessageAt = new Date(base.getTime() - ASSISTANT_IDLE_AFTER_MS + 1);
    const result = nextLifecycleState({ status: "open", lastMessageAt }, base);
    expect(result).toEqual({ status: "open", changed: false });
  });

  it("leaves idle conversations unchanged before the close threshold", () => {
    const lastMessageAt = new Date(base.getTime() - ASSISTANT_CLOSE_AFTER_MS + 1);
    const result = nextLifecycleState({ status: "idle", lastMessageAt }, base);
    expect(result).toEqual({ status: "idle", changed: false });
  });

  it("does not mark an already-idle conversation idle again", () => {
    const lastMessageAt = new Date(base.getTime() - ASSISTANT_IDLE_AFTER_MS);
    const result = nextLifecycleState({ status: "idle", lastMessageAt }, base);
    expect(result).toEqual({ status: "idle", changed: false });
  });

  it("closes explicitly for idle_timeout and connection_lost", () => {
    expect(closeConversationExplicitly("idle_timeout")).toEqual({
      status: "closed",
      closedReason: "idle_timeout",
      changed: true,
    });
    expect(closeConversationExplicitly("connection_lost")).toEqual({
      status: "closed",
      closedReason: "connection_lost",
      changed: true,
    });
  });

  it("reopens idle conversations on activity", () => {
    expect(reopenOnCustomerActivity("idle")).toBe("open");
    expect(reopenOnCustomerActivity("open")).toBe("open");
    expect(reopenOnCustomerActivity("closed")).toBe("closed");
    expect(reopenOnCustomerActivity("handed_off")).toBe("handed_off");
  });
});
