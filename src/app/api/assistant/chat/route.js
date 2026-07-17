import { NextResponse } from "next/server";
import OpenAI from "openai";
import mongoose from "mongoose";
import { getAssistantModels } from "@/lib/assistant/models";
import {
  detectEscalation,
  matchFaqEntries,
  resolveLocationRequest,
} from "@/lib/assistant/intentGate";
import { buildCatalogContext } from "@/lib/assistant/catalogContext";
import { buildSystemPrompt } from "@/lib/assistant/prompt";
import { allowAssistantRequest } from "@/lib/assistant/rateLimit";
import { normalizeSessionId } from "@/lib/assistant/validation";

const CHAT_MODEL = "gpt-4.1-mini";
const TRANSCRIBE_MODEL = "gpt-4o-mini-transcribe";
const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY_TURNS = 20;
const MAX_AUDIO_BYTES = 8 * 1024 * 1024;

export const maxDuration = 60;

function errorJson(code, message, status) {
  return NextResponse.json({ code, message }, { status });
}

function sseEncode(payload) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

function sseStream(asyncWriter) {
  const encoder = new TextEncoder();
  let closed = false;
  return new ReadableStream({
    async start(controller) {
      const send = (payload) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(sseEncode(payload)));
        } catch {
          // Client disconnected mid-stream; drop remaining events.
          closed = true;
        }
      };
      try {
        await asyncWriter(send);
      } catch (err) {
        console.error("assistant/chat stream error:", err);
        send({
          type: "error",
          code: "SERVER_ERROR",
          message: "Something went wrong. Please try again.",
        });
      } finally {
        if (!closed) {
          closed = true;
          try {
            controller.close();
          } catch {
            // already closed by cancel()
          }
        }
      }
    },
    cancel() {
      closed = true;
    },
  });
}

function sseResponse(stream) {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

/**
 * POST /api/assistant/chat
 * JSON body:      { conversationId, sessionId, message }
 * or multipart:   conversationId, sessionId, audio (Blob)
 * Streams SSE events: transcript | delta | done | error
 * Voice audio is transcribed in memory and never persisted.
 */
export async function POST(request) {
  let conversationId = "";
  let sessionId = "";
  let message = "";
  let inputModality = "text";
  let audioFile = null;

  const contentType = request.headers.get("content-type") || "";
  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      conversationId = String(form.get("conversationId") || "");
      sessionId = normalizeSessionId(form.get("sessionId"));
      audioFile = form.get("audio");
      inputModality = "voice";
    } else {
      const body = await request.json();
      conversationId = String(body.conversationId || "");
      sessionId = normalizeSessionId(body.sessionId);
      message = typeof body.message === "string" ? body.message : "";
    }
  } catch {
    return errorJson("BAD_REQUEST", "Invalid request body.", 400);
  }

  if (!conversationId || !sessionId) {
    return errorJson("BAD_REQUEST", "conversationId and sessionId are required.", 400);
  }
  if (!mongoose.isValidObjectId(conversationId)) {
    return errorJson("BAD_REQUEST", "Invalid conversationId.", 400);
  }

  if (
    !allowAssistantRequest(request, "chat", sessionId, {
      sessionLimit: 12,
      ipLimit: 30,
    })
  ) {
    return errorJson("RATE_LIMITED", "Too many messages. Please wait a moment.", 429);
  }

  if (inputModality === "voice") {
    if (!process.env.OPENAI_API_KEY) {
      return errorJson("NOT_CONFIGURED", "Assistant is not configured.", 503);
    }
    if (!audioFile || typeof audioFile.arrayBuffer !== "function") {
      return errorJson("BAD_REQUEST", "Audio file is missing.", 400);
    }
    if (!audioFile.type?.startsWith("audio/")) {
      return errorJson("BAD_REQUEST", "Unsupported audio file.", 400);
    }
    if (audioFile.size > MAX_AUDIO_BYTES) {
      return errorJson("BAD_REQUEST", "Audio is too long. Please keep it short.", 400);
    }
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const transcription = await openai.audio.transcriptions.create({
        model: TRANSCRIBE_MODEL,
        file: audioFile,
      });
      message = transcription.text?.trim() ?? "";
    } catch (err) {
      console.error("assistant/chat transcription error:", err);
      return errorJson(
        "TRANSCRIPTION_FAILED",
        "Sorry, I couldn't hear that. Please try again or type your message.",
        502
      );
    }
  }

  message = message.trim().slice(0, MAX_MESSAGE_CHARS);
  if (!message) {
    return errorJson("BAD_REQUEST", "Message is empty.", 400);
  }

  try {
    const { AssistantConversation, AssistantMessage } = await getAssistantModels();

    const conversation = await AssistantConversation.findOne({
      _id: conversationId,
      sessionId,
    });
    if (!conversation) {
      return errorJson("NOT_FOUND", "Conversation not found.", 404);
    }

    await AssistantMessage.create({
      conversationId: conversation._id,
      role: "user",
      content: message,
      inputModality,
    });

    const escalation = detectEscalation(message);
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

      return sseResponse(
        sseStream(async (send) => {
          if (inputModality === "voice") {
            send({ type: "transcript", content: message });
          }
          send({ type: "delta", content: escalation.reply });
          send({
            type: "done",
            assistantMessageId: assistantMessage._id.toString(),
            actions: escalation.actions,
            escalated: true,
          });
        })
      );
    }

    const history = await AssistantMessage.find({
      conversationId: conversation._id,
      role: { $in: ["user", "assistant"] },
    })
      .sort({ createdAt: -1 })
      .limit(MAX_HISTORY_TURNS)
      .lean();

    const retrievalQuery = history
      .filter((entry) => entry.role === "user")
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
        sources: ["location"],
      });
      conversation.lastMessageAt = new Date();
      conversation.save().catch((err) => {
        console.error("assistant/chat location conversation save error:", err);
      });

      return sseResponse(
        sseStream(async (send) => {
          if (inputModality === "voice") {
            send({ type: "transcript", content: message });
          }
          send({ type: "delta", content: locationAnswer.reply });
          send({
            type: "done",
            assistantMessageId: assistantMessage._id.toString(),
            actions: locationAnswer.actions,
            escalated: false,
          });
        })
      );
    }

    const [catalog, faqEntries] = await Promise.all([
      buildCatalogContext(retrievalQuery),
      Promise.resolve(matchFaqEntries(retrievalQuery)),
    ]);

    const chatMessages = [
      {
        role: "system",
        content: buildSystemPrompt({
          guestName: conversation.guestName,
          catalogContext: catalog.context,
          catalogAvailable: catalog.available,
          faqEntries,
        }),
      },
      ...[...history]
        .reverse()
        .map((m) => ({ role: m.role, content: m.content })),
    ];

    if (!process.env.OPENAI_API_KEY) {
      return errorJson("NOT_CONFIGURED", "Assistant is not configured.", 503);
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: chatMessages,
      max_tokens: 400,
      temperature: 0.3,
      stream: true,
    });

    const sources = [
      ...catalog.sources,
      ...faqEntries.map((f) => `faq:${f.id}`),
    ];

    return sseResponse(
      sseStream(async (send) => {
        if (inputModality === "voice") {
          send({ type: "transcript", content: message });
        }

        let reply = "";
        for await (const chunk of completion) {
          const delta = chunk.choices?.[0]?.delta?.content || "";
          if (!delta) continue;
          reply += delta;
          send({ type: "delta", content: delta });
        }

        reply = reply.trim();
        if (!reply) {
          reply =
            "Sorry, I couldn't answer that. Please contact the salon on WhatsApp.";
          send({ type: "delta", content: reply });
        }

        const assistantMessage = await AssistantMessage.create({
          conversationId: conversation._id,
          role: "assistant",
          content: reply,
          sources,
          model: CHAT_MODEL,
        });
        conversation.lastMessageAt = new Date();
        // Don't block the client TTS kickoff on the conversation timestamp write.
        conversation.save().catch((err) => {
          console.error("assistant/chat conversation save error:", err);
        });

        send({
          type: "done",
          assistantMessageId: assistantMessage._id.toString(),
          actions: [],
          escalated: false,
        });
      })
    );
  } catch (err) {
    console.error("assistant/chat error:", err);
    return errorJson("SERVER_ERROR", "Something went wrong. Please try again.", 500);
  }
}
