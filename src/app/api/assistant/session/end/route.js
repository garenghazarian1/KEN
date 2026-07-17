import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAssistantModels } from "@/lib/assistant/models";
import { allowAssistantRequest } from "@/lib/assistant/rateLimit";
import { normalizeSessionId } from "@/lib/assistant/validation";

export const maxDuration = 15;

const CLOSE_REASONS = new Set([
  "user_end",
  "idle_timeout",
  "panel_closed",
  "connection_lost",
]);

function errorJson(code, message, status) {
  return NextResponse.json({ code, message }, { status });
}

/**
 * POST /api/assistant/session/end
 * Body: { sessionId, conversationId, reason }
 * Marks the owned conversation closed (explicit end, two-stage inactivity
 * goodbye, panel close, or connection failure).
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorJson("BAD_REQUEST", "Invalid JSON body.", 400);
  }

  const sessionId = normalizeSessionId(body.sessionId);
  const conversationId = String(body.conversationId || "");
  const reason = CLOSE_REASONS.has(body.reason) ? body.reason : "user_end";

  if (!sessionId || !mongoose.isValidObjectId(conversationId)) {
    return errorJson("BAD_REQUEST", "Valid session and conversation are required.", 400);
  }

  if (
    !allowAssistantRequest(request, "session-end", sessionId, {
      sessionLimit: 8,
      ipLimit: 20,
    })
  ) {
    return errorJson("RATE_LIMITED", "Too many requests. Please wait a moment.", 429);
  }

  try {
    const { AssistantConversation } = await getAssistantModels();
    await AssistantConversation.updateOne(
      { _id: conversationId, sessionId, status: { $ne: "closed" } },
      { $set: { status: "closed", closedReason: reason } }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("assistant/session/end error:", err);
    return errorJson("SERVER_ERROR", "Something went wrong. Please try again.", 500);
  }
}
