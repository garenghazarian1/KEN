import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAssistantModels } from "@/lib/assistant/models";
import { allowAssistantRequest } from "@/lib/assistant/rateLimit";
import { normalizeSessionId } from "@/lib/assistant/validation";
import { buildVoiceSystemPrompt } from "@/lib/assistant/prompt";
import { BUSINESS_SLUG } from "@/config/constants";

export const maxDuration = 15;

const REALTIME_MODEL = "gpt-realtime-mini";
const REALTIME_VOICE = "coral"; // same warm female voice as text-mode TTS
const TRANSCRIBE_MODEL = "gpt-4o-mini-transcribe";
const SECRET_TTL_SECONDS = 600;

function errorJson(code, message, status) {
  return NextResponse.json({ code, message }, { status });
}

/**
 * POST /api/assistant/realtime/session
 * Body: { sessionId: string, conversationId?: string }
 *
 * Reuses the caller's open conversation when it owns one (so voice continues
 * the visible thread); otherwise closes stale open records and starts fresh.
 * Mints a short-lived OpenAI Realtime client secret — the real API key never
 * reaches the browser. Turn detection is semantic VAD with
 * `create_response: false`: every model response must first be authorized by
 * POST /api/assistant/realtime/turn (hard escalation gate + catalog grounding).
 */
export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return errorJson("NOT_CONFIGURED", "Assistant is not configured.", 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorJson("BAD_REQUEST", "Invalid JSON body.", 400);
  }

  const sessionId = normalizeSessionId(body.sessionId);
  if (!sessionId) {
    return errorJson("BAD_REQUEST", "sessionId is required.", 400);
  }

  if (
    !allowAssistantRequest(request, "realtime-session", sessionId, {
      sessionLimit: 6,
      ipLimit: 15,
    })
  ) {
    return errorJson("RATE_LIMITED", "Too many requests. Please wait a moment.", 429);
  }

  try {
    const { AssistantConversation } = await getAssistantModels();

    const requestedId = String(body.conversationId || "");
    let conversation = null;

    if (requestedId && mongoose.isValidObjectId(requestedId)) {
      conversation = await AssistantConversation.findOne({
        _id: requestedId,
        sessionId,
        status: { $ne: "closed" },
      });
    }

    if (!conversation) {
      await AssistantConversation.updateMany(
        { businessSlug: BUSINESS_SLUG, sessionId, status: "open" },
        { $set: { status: "closed", closedReason: "superseded" } }
      );
      conversation = await AssistantConversation.create({
        businessSlug: BUSINESS_SLUG,
        sessionId,
        metadata: {
          path: typeof body.path === "string" ? body.path.slice(0, 200) : null,
          userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
        },
      });
    }

    const instructions = buildVoiceSystemPrompt({
      guestName: conversation.guestName,
      catalogContext: null,
      catalogAvailable: true,
      faqEntries: [],
    });

    const secretRes = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expires_after: { anchor: "created_at", seconds: SECRET_TTL_SECONDS },
          session: {
            type: "realtime",
            model: REALTIME_MODEL,
            instructions,
            output_modalities: ["audio"],
            audio: {
              input: {
                noise_reduction: { type: "near_field" },
                transcription: { model: TRANSCRIBE_MODEL },
                turn_detection: {
                  type: "semantic_vad",
                  eagerness: "auto",
                  create_response: false,
                  interrupt_response: true,
                },
              },
              output: { voice: REALTIME_VOICE },
            },
          },
        }),
      }
    );

    if (!secretRes.ok) {
      const detail = await secretRes.text().catch(() => "");
      console.error("assistant/realtime/session client_secrets error:", secretRes.status, detail);
      return errorJson("REALTIME_FAILED", "Could not start the voice conversation.", 502);
    }

    const secret = await secretRes.json();
    if (!secret?.value) {
      return errorJson("REALTIME_FAILED", "Could not start the voice conversation.", 502);
    }

    return NextResponse.json({
      conversationId: conversation._id.toString(),
      clientSecret: secret.value,
      expiresAt: secret.expires_at ?? null,
      model: REALTIME_MODEL,
    });
  } catch (err) {
    console.error("assistant/realtime/session error:", err);
    return errorJson("SERVER_ERROR", "Something went wrong. Please try again.", 500);
  }
}
