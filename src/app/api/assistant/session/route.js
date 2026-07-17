import { NextResponse } from "next/server";
import { getAssistantModels } from "@/lib/assistant/models";
import { allowAssistantRequest } from "@/lib/assistant/rateLimit";
import { normalizeSessionId } from "@/lib/assistant/validation";
import { BUSINESS_SLUG } from "@/config/constants";

export const maxDuration = 15;

function normalizeGuestName(value) {
  if (typeof value !== "string") return null;
  const normalized = value
    .normalize("NFKC")
    .replace(/[^\p{L}\p{M}\p{N} .'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  return normalized || null;
}

/**
 * POST /api/assistant/session
 * Start a FRESH conversation for a widget session — any previous open
 * conversation for the same session is closed first, and no old messages are
 * hydrated. Body: { sessionId: string, guestName?: string, path?: string }
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

  const sessionId = normalizeSessionId(body.sessionId);
  if (!sessionId) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "sessionId is required." },
      { status: 400 }
    );
  }

  if (
    !allowAssistantRequest(request, "session", sessionId, {
      sessionLimit: 8,
      ipLimit: 20,
    })
  ) {
    return NextResponse.json(
      { code: "RATE_LIMITED", message: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  const guestName = normalizeGuestName(body.guestName);

  try {
    const { AssistantConversation } = await getAssistantModels();

    // Every new assistant session starts a fresh conversation.
    await AssistantConversation.updateMany(
      { businessSlug: BUSINESS_SLUG, sessionId, status: "open" },
      { $set: { status: "closed", closedReason: "superseded" } }
    );

    const conversation = await AssistantConversation.create({
      businessSlug: BUSINESS_SLUG,
      sessionId,
      guestName,
      metadata: {
        path: typeof body.path === "string" ? body.path.slice(0, 200) : null,
        userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
      },
    });

    return NextResponse.json({
      conversationId: conversation._id.toString(),
      guestName: conversation.guestName,
      messages: [],
    });
  } catch (err) {
    console.error("assistant/session error:", err);
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "Could not start the conversation." },
      { status: 500 }
    );
  }
}
