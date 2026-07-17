import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAssistantModels } from "@/lib/assistant/models";
import { allowAssistantRequest } from "@/lib/assistant/rateLimit";
import { normalizeSessionId } from "@/lib/assistant/validation";
import { buildWhatsAppActions, buildCallActions } from "@/data/assistantFaq";

const HANDOFF_REPLY =
  "Of course — the team will help you directly. Choose the branch you'd like to contact:";

export const maxDuration = 15;

/**
 * POST /api/assistant/handoff
 * Mark the conversation handed_off and return prefilled WhatsApp / call CTAs.
 * Body: { conversationId, sessionId, reason?: string }
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const conversationId = String(body.conversationId || "");
  const sessionId = normalizeSessionId(body.sessionId);
  if (!conversationId || !sessionId) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "conversationId and sessionId are required." },
      { status: 400 }
    );
  }
  if (!mongoose.isValidObjectId(conversationId)) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Invalid conversationId." },
      { status: 400 }
    );
  }

  if (
    !allowAssistantRequest(request, "handoff", sessionId, {
      sessionLimit: 6,
      ipLimit: 20,
    })
  ) {
    return NextResponse.json(
      { code: "RATE_LIMITED", message: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    const { AssistantConversation, AssistantMessage } = await getAssistantModels();
    const conversation = await AssistantConversation.findOne({
      _id: conversationId,
      sessionId,
    });
    if (!conversation) {
      return NextResponse.json(
        { code: "NOT_FOUND", message: "Conversation not found." },
        { status: 404 }
      );
    }

    conversation.status = "handed_off";
    conversation.handoffReason = "user_request";
    conversation.lastMessageAt = new Date();
    await conversation.save();

    await AssistantMessage.create({
      conversationId: conversation._id,
      role: "user",
      content: "Talk to the salon",
      inputModality: "text",
    });

    const assistantMessage = await AssistantMessage.create({
      conversationId: conversation._id,
      role: "assistant",
      content: HANDOFF_REPLY,
      sources: ["handoff"],
      escalationReason: "user_request",
    });

    const namePart = conversation.guestName
      ? ` My name is ${conversation.guestName}.`
      : "";
    const whatsappMessage = `Hello KEN Beauty Center, I was chatting with your website assistant and need help from the team.${namePart}`;

    return NextResponse.json({
      reply: HANDOFF_REPLY,
      assistantMessageId: assistantMessage._id.toString(),
      actions: [...buildWhatsAppActions(whatsappMessage), ...buildCallActions()],
    });
  } catch (err) {
    console.error("assistant/handoff error:", err);
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "Could not hand off the conversation." },
      { status: 500 }
    );
  }
}
