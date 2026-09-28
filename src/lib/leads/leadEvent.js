import mongoose from "mongoose";
import { connectServicesDB } from "@/lib/db/mongoose";
import { BUSINESS_SLUG } from "@/config/constants";

const { Schema } = mongoose;

const leadEventSchema = new Schema(
  {
    businessSlug: {
      type: String,
      required: true,
      default: BUSINESS_SLUG,
      index: true,
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
    userAgent: { type: String, default: null, maxlength: 400 },
    language: { type: String, default: null, maxlength: 40 },
    timezone: { type: String, default: null, maxlength: 80 },
    screen: {
      w: { type: Number, default: null },
      h: { type: Number, default: null },
      dpr: { type: Number, default: null },
    },
    referrer: { type: String, default: null, maxlength: 500 },
    ip: { type: String, default: null, maxlength: 64 },
  },
  { timestamps: true, collection: "lead_events" }
);

leadEventSchema.index({ businessSlug: 1, createdAt: -1 });
leadEventSchema.index({ businessSlug: 1, eventType: 1, createdAt: -1 });
leadEventSchema.index({ businessSlug: 1, branch: 1, createdAt: -1 });

export async function getLeadEventModel() {
  const conn = await connectServicesDB();
  return conn.models.LeadEvent || conn.model("LeadEvent", leadEventSchema);
}
