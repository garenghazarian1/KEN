import { afterEach, describe, expect, it, vi } from "vitest";
import mongoose from "mongoose";

vi.mock("@/lib/assistant/models", () => ({
  getAssistantModels: vi.fn(),
}));

vi.mock("@/lib/assistant/rateLimit", () => ({
  allowAssistantRequest: vi.fn(() => true),
}));

import { POST } from "@/app/api/assistant/session/end/route";
import { getAssistantModels } from "@/lib/assistant/models";

const SESSION_ID = "test-session-01";
const CONVERSATION_ID = new mongoose.Types.ObjectId().toString();

describe("POST /api/assistant/session/end", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("closes with the requested reason", async () => {
    const updateOne = vi.fn().mockResolvedValue({ modifiedCount: 1 });
    getAssistantModels.mockResolvedValue({
      AssistantConversation: { updateOne },
    });

    const res = await POST(
      new Request("http://localhost/api/assistant/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: SESSION_ID,
          conversationId: CONVERSATION_ID,
          reason: "panel_closed",
        }),
      })
    );
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(updateOne).toHaveBeenCalledWith(
      { _id: CONVERSATION_ID, sessionId: SESSION_ID, status: { $ne: "closed" } },
      { $set: { status: "closed", closedReason: "panel_closed" } }
    );
  });

  it("defaults an unknown reason to user_end", async () => {
    const updateOne = vi.fn().mockResolvedValue({ modifiedCount: 1 });
    getAssistantModels.mockResolvedValue({
      AssistantConversation: { updateOne },
    });

    const res = await POST(
      new Request("http://localhost/api/assistant/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: SESSION_ID,
          conversationId: CONVERSATION_ID,
          reason: "not-a-reason",
        }),
      })
    );
    expect(res.status).toBe(200);
    expect(updateOne).toHaveBeenCalledWith(
      expect.any(Object),
      { $set: { status: "closed", closedReason: "user_end" } }
    );
  });

  it("rejects invalid conversation ids", async () => {
    const res = await POST(
      new Request("http://localhost/api/assistant/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: SESSION_ID,
          conversationId: "nope",
          reason: "user_end",
        }),
      })
    );
    expect(res.status).toBe(400);
    expect(getAssistantModels).not.toHaveBeenCalled();
  });
});
