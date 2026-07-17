/**
 * Mongoose models for assistant chat persistence.
 *
 * Stored in the admin platform database (beauty-admin via connectServicesDB)
 * in dedicated `assistant_*` collections, so the admin app can show chat
 * history per business. Every conversation is stamped with this site's
 * BUSINESS_SLUG — the admin UI must always filter by it (multi-tenant).
 * This is a deliberate exception to the "read admin data over HTTP only"
 * rule: ken write-owns its own transcripts. Voice messages store the
 * transcript text only — never audio.
 */

import mongoose from "mongoose";
import { connectServicesDB } from "@/lib/db/mongoose";
import { BUSINESS_SLUG } from "@/config/constants";

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    businessSlug: {
      type: String,
      required: true,
      default: BUSINESS_SLUG,
      index: true,
    },
    sessionId: { type: String, required: true },
    guestName: { type: String, default: null, trim: true, maxlength: 80 },
    preferredBranch: {
      type: String,
      enum: ["galleria", "rixos", null],
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "handed_off", "closed"],
      default: "open",
    },
    handoffReason: { type: String, default: null },
    closedReason: { type: String, default: null },
    lastMessageAt: { type: Date, default: Date.now },
    metadata: {
      path: { type: String, default: null },
      userAgent: { type: String, default: null },
    },
  },
  { timestamps: true, collection: "assistant_conversations" }
);

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "AssistantConversation",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: { type: String, required: true, maxlength: 8000 },
    inputModality: { type: String, enum: ["text", "voice"], default: "text" },
    sources: { type: [String], default: [] },
    model: { type: String, default: null },
    escalationReason: { type: String, default: null },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "assistant_messages",
  }
);

conversationSchema.index({ sessionId: 1, status: 1, createdAt: -1 });
conversationSchema.index(
  { businessSlug: 1, sessionId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "open" },
    name: "unique_open_assistant_session",
  }
);
conversationSchema.index({ status: 1, lastMessageAt: -1 });
conversationSchema.index({ businessSlug: 1, lastMessageAt: -1 });
messageSchema.index({ conversationId: 1, createdAt: -1 });

/**
 * Models must be registered on the named connection (createConnection),
 * not the default mongoose instance.
 */
export async function getAssistantModels() {
  const conn = await connectServicesDB();
  const AssistantConversation =
    conn.models.AssistantConversation ||
    conn.model("AssistantConversation", conversationSchema);
  const AssistantMessage =
    conn.models.AssistantMessage || conn.model("AssistantMessage", messageSchema);
  return { AssistantConversation, AssistantMessage };
}
