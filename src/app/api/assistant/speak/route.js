import { NextResponse } from "next/server";
import OpenAI from "openai";
import mongoose from "mongoose";
import { getAssistantModels } from "@/lib/assistant/models";
import { allowAssistantRequest } from "@/lib/assistant/rateLimit";
import { normalizeSessionId } from "@/lib/assistant/validation";

const TTS_MODEL = "gpt-4o-mini-tts";
const TTS_VOICE = "coral"; // warm female OpenAI voice
const TTS_INSTRUCTIONS =
  "Speak as a warm, friendly young woman working at a luxury beauty salon in Abu Dhabi. Clear, natural, welcoming — not robotic.";
const MAX_CHARS = 800;

export const maxDuration = 30;

/**
 * POST /api/assistant/speak
 * Body: { conversationId: string, assistantMessageId: string, sessionId: string }
 * Returns audio/mpeg. Audio is never stored — streamed once to the client.
 * Only stored assistant messages owned by this browser session may be spoken,
 * preventing this public route from becoming an arbitrary-text TTS proxy.
 */
export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { code: "NOT_CONFIGURED", message: "Assistant is not configured." },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const sessionId = normalizeSessionId(body.sessionId);
  const conversationId = String(body.conversationId || "");
  const assistantMessageId = String(body.assistantMessageId || "");
  if (
    !sessionId ||
    !mongoose.isValidObjectId(conversationId) ||
    !mongoose.isValidObjectId(assistantMessageId)
  ) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Valid message ownership is required." },
      { status: 400 }
    );
  }

  if (
    !allowAssistantRequest(request, "speak", sessionId, {
      sessionLimit: 10,
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
    })
      .select("_id")
      .lean();
    if (!conversation) {
      return NextResponse.json(
        { code: "NOT_FOUND", message: "Conversation not found." },
        { status: 404 }
      );
    }

    const message = await AssistantMessage.findOne({
      _id: assistantMessageId,
      conversationId: conversation._id,
      role: "assistant",
    })
      .select("content")
      .lean();
    if (!message?.content) {
      return NextResponse.json(
        { code: "NOT_FOUND", message: "Assistant message not found." },
        { status: 404 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const speech = await openai.audio.speech.create({
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: message.content.slice(0, MAX_CHARS),
      instructions: TTS_INSTRUCTIONS,
      response_format: "mp3",
    });

    // Pipe OpenAI audio through without buffering the whole file first.
    return new NextResponse(speech.body, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("assistant/speak error:", err);
    return NextResponse.json(
      { code: "TTS_FAILED", message: "Could not generate speech." },
      { status: 502 }
    );
  }
}
