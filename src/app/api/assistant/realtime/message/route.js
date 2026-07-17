import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAssistantModels } from "@/lib/assistant/models";
import { allowAssistantRequest } from "@/lib/assistant/rateLimit";
import { normalizeSessionId } from "@/lib/assistant/validation";

export const maxDuration = 15;

const REALTIME_MODEL = "gpt-realtime-mini";
const MAX_TRANSCRIPT_CHARS = 8000;

function errorJson(code, message, status) {
  return NextResponse.json({ code, message }, { status });
}

/**
 * POST /api/assistant/realtime/message
 * Body: { sessionId, conversationId, transcript }
 *
 * Persists a completed assistant voice transcript. Transcript-only storage —
 * raw audio is never written anywhere.
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
  const transcript =
    typeof body.transcript === "string"
      ? body.transcript.trim().slice(0, MAX_TRANSCRIPT_CHARS)
      : "";

  if (!sessionId || !mongoose.isValidObjectId(conversationId)) {
    return errorJson("BAD_REQUEST", "Valid session and conversation are required.", 400);
  }
  if (!transcript) {
    return errorJson("BAD_REQUEST", "Transcript is empty.", 400);
  }

  if (
    !allowAssistantRequest(request, "realtime-message", sessionId, {
      sessionLimit: 20,
      ipLimit: 40,
    })
  ) {
    return errorJson("RATE_LIMITED", "Too many requests. Please wait a moment.", 429);
  }

  try {
    const { AssistantConversation, AssistantMessage } = await getAssistantModels();

    const conversation = await AssistantConversation.findOne({
      _id: conversationId,
      sessionId,
    }).select("_id");
    if (!conversation) {
      return errorJson("NOT_FOUND", "Conversation not found.", 404);
    }

    const assistantMessage = await AssistantMessage.create({
      conversationId: conversation._id,
      role: "assistant",
      content: transcript,
      sources: ["realtime"],
      model: REALTIME_MODEL,
    });
    await AssistantConversation.updateOne(
      { _id: conversation._id },
      { $set: { lastMessageAt: new Date() } }
    );

    return NextResponse.json({
      assistantMessageId: assistantMessage._id.toString(),
    });
  } catch (err) {
    console.error("assistant/realtime/message error:", err);
    return errorJson("SERVER_ERROR", "Something went wrong. Please try again.", 500);
  }
}
