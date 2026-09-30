import mongoose from "mongoose";
import { connectServicesDB } from "@/lib/db/mongoose";
import { BUSINESS_SLUG } from "@/config/constants";

const { Schema } = mongoose;
const RETENTION_SECONDS = 90 * 24 * 60 * 60;

const leadEventSchema = new Schema(
  {
    businessSlug: {
      type: String,
      required: true,
      default: BUSINESS_SLUG,
      index: true,
    },
    eventId: {
      type: String,
      default: null,
      maxlength: 80,
    },
    eventType: {
      type: String,
      enum: ["whatsapp", "phone", "email", "directions"],
      required: true,
    },
    branch: {
      type: String,
      enum: ["galleria", "rixos", null],
      default: null,
    },
    target: { type: String, required: true, maxlength: 300 },
    pagePath: { type: String, default: null, maxlength: 300 },
    services: {
      type: [
        {
          _id: false,
          id: { type: String, default: null, maxlength: 80 },
          name: { type: String, required: true, maxlength: 120 },
        },
      ],
      default: [],
    },
    gclid: { type: String, default: null, maxlength: 200 },
    gbraid: { type: String, default: null, maxlength: 200 },
    wbraid: { type: String, default: null, maxlength: 200 },
  },
  { timestamps: true, collection: "lead_events" }
);

leadEventSchema.index(
  { eventId: 1 },
  {
    unique: true,
    partialFilterExpression: { eventId: { $type: "string" } },
  }
);
leadEventSchema.index({ businessSlug: 1, createdAt: -1 });
leadEventSchema.index({ businessSlug: 1, eventType: 1, createdAt: -1 });
leadEventSchema.index({ businessSlug: 1, branch: 1, createdAt: -1 });
leadEventSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: RETENTION_SECONDS }
);

export async function getLeadEventModel() {
  const conn = await connectServicesDB();
  return conn.models.LeadEvent || conn.model("LeadEvent", leadEventSchema);
}
