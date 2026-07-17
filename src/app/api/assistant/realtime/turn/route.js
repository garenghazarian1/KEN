import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAssistantModels } from "@/lib/assistant/models";
import {
  detectEscalation,
  matchFaqEntries,
  resolveLocationRequest,
} from "@/lib/assistant/intentGate";
import { buildCatalogContext } from "@/lib/assistant/catalogContext";
import { buildVoiceSystemPrompt } from "@/lib/assistant/prompt";
import { allowAssistantRequest } from "@/lib/assistant/rateLimit";
import { normalizeSessionId } from "@/lib/assistant/validation";

export const maxDuration = 15;

const MAX_TRANSCRIPT_CHARS = 1000;
const MAX_HISTORY_TURNS = 20;

function errorJson(code, message, status) {
  return NextResponse.json({ code, message }, { status });
}

/**
 * POST /api/assistant/realtime/turn
 * Body: { sessionId, conversationId, transcript }
 *
 * Called by the voice client after each final user transcript, BEFORE any
 * model response is created (the Realtime session runs with
 * `create_response: false`). Persists the user turn, runs the hard Zenoti
 * escalation gate, and returns either the fixed escalation reply or grounded
 * instructions for the next spoken response.
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
    !allowAssistantRequest(request, "realtime-turn", sessionId, {
      sessionLimit: 20,
      ipLimit: 40,
    })
  ) {
    return errorJson("RATE_LIMITED", "Too many messages. Please wait a moment.", 429);
  }

  try {
    const { AssistantConversation, AssistantMessage } = await getAssistantModels();

    const conversation = await AssistantConversation.findOne({
      _id: conversationId,
      sessionId,
      status: { $ne: "closed" },
    });
    if (!conversation) {
      return errorJson("NOT_FOUND", "Conversation not found.", 404);
    }

    await AssistantMessage.create({
      conversationId: conversation._id,
      role: "user",
      content: transcript,
      inputModality: "voice",
    });

    // Hard gate: Zenoti / payment / cancellation topics never reach the model.
    const escalation = detectEscalation(transcript);
    if (escalation) {
      const assistantMessage = await AssistantMessage.create({
        conversationId: conversation._id,
        role: "assistant",
        content: escalation.reply,
        sources: ["escalation"],
        escalationReason: escalation.reason,
      });
      conversation.status = "handed_off";
      conversation.handoffReason = escalation.reason;
      conversation.lastMessageAt = new Date();
      await conversation.save();

      return NextResponse.json({
        escalated: true,
        reply: escalation.reply,
        actions: escalation.actions,
        assistantMessageId: assistantMessage._id.toString(),
      });
    }

    const history = await AssistantMessage.find({
      conversationId: conversation._id,
      role: "user",
    })
      .sort({ createdAt: -1 })
      .limit(MAX_HISTORY_TURNS)
      .select("content")
      .lean();

    // Ground follow-ups ("How much is it?") in the last few user turns.
    const retrievalQuery = history
      .slice(0, 3)
      .reverse()
      .map((entry) => entry.content)
      .join(" ");

    const locationAnswer = resolveLocationRequest(retrievalQuery);
    if (locationAnswer) {
      const assistantMessage = await AssistantMessage.create({
        conversationId: conversation._id,
        role: "assistant",
        content: locationAnswer.reply,
        inputModality: "voice",
        sources: ["location"],
      });
      conversation.lastMessageAt = new Date();
      conversation.save().catch((err) => {
        console.error(
          "assistant/realtime/turn location conversation save error:",
          err
        );
      });

      return NextResponse.json({
        escalated: false,
        fixed: true,
        reply: locationAnswer.reply,
        actions: locationAnswer.actions,
        assistantMessageId: assistantMessage._id.toString(),
      });
    }

    const [catalog, faqEntries] = await Promise.all([
      buildCatalogContext(retrievalQuery),
      Promise.resolve(matchFaqEntries(retrievalQuery)),
    ]);

    conversation.lastMessageAt = new Date();
    conversation.save().catch((err) => {
      console.error("assistant/realtime/turn conversation save error:", err);
    });

    return NextResponse.json({
      escalated: false,
      instructions: buildVoiceSystemPrompt({
        guestName: conversation.guestName,
        catalogContext: catalog.context,
        catalogAvailable: catalog.available,
        faqEntries,
      }),
    });
  } catch (err) {
    console.error("assistant/realtime/turn error:", err);
    return errorJson("SERVER_ERROR", "Something went wrong. Please try again.", 500);
  }
}
