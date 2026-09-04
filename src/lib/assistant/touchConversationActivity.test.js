import { describe, expect, it } from "vitest";
import { touchConversationActivity } from "./touchConversationActivity";

describe("touchConversationActivity", () => {
  const now = new Date("2026-09-04T12:00:00.000Z");

  it("rejects closed conversations without mutating activity", () => {
    const conversation = {
      status: "closed",
      lastMessageAt: new Date("2026-09-01T00:00:00.000Z"),
    };
    const result = touchConversationActivity(conversation, { now });
    expect(result).toEqual({ ok: false, code: "CONVERSATION_CLOSED" });
    expect(conversation.status).toBe("closed");
    expect(conversation.lastMessageAt).toEqual(new Date("2026-09-01T00:00:00.000Z"));
  });

  it("reopens idle conversations and bumps lastMessageAt", () => {
    const conversation = {
      status: "idle",
      lastMessageAt: new Date("2026-09-04T11:00:00.000Z"),
    };
    const result = touchConversationActivity(conversation, { now });
    expect(result).toEqual({ ok: true });
    expect(conversation.status).toBe("open");
    expect(conversation.lastMessageAt).toEqual(now);
  });

  it("keeps open and handed_off statuses while bumping lastMessageAt", () => {
    const open = { status: "open", lastMessageAt: new Date(0) };
    expect(touchConversationActivity(open, { now })).toEqual({ ok: true });
    expect(open.status).toBe("open");
    expect(open.lastMessageAt).toEqual(now);

    const handedOff = { status: "handed_off", lastMessageAt: new Date(0) };
    expect(touchConversationActivity(handedOff, { now })).toEqual({ ok: true });
    expect(handedOff.status).toBe("handed_off");
    expect(handedOff.lastMessageAt).toEqual(now);
  });
});
