import { NextResponse } from "next/server";
import { BUSINESS_SLUG } from "@/config/constants";
import { allowRequest } from "@/lib/assistant/rateLimit";
import { getLeadEventModel } from "@/lib/leads/leadEvent";
import { parseLeadBody } from "@/lib/leads/leadRecord";

export const maxDuration = 10;

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded ? forwarded.split(",")[0].trim() : "";
  const ip = first || request.headers.get("x-real-ip") || "";
  return ip.slice(0, 64) || null;
}

/**
 * POST /api/leads
 * One outbound click (WhatsApp, phone, salon email, directions).
 * The browser does not wait on this response.
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

  const lead = parseLeadBody(body);
  if (!lead) {
    return NextResponse.json(
      { code: "BAD_REQUEST", message: "Not a lead click." },
      { status: 400 }
    );
  }

  const ip = clientIp(request);
  if (!allowRequest(`lead:${ip || "unknown"}`, 40)) {
    return NextResponse.json(
      { code: "RATE_LIMITED", message: "Too many click events." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const LeadEvent = await getLeadEventModel();
    await LeadEvent.create({
      ...lead,
      businessSlug: BUSINESS_SLUG,
      userAgent: (request.headers.get("user-agent") || "").slice(0, 400) || null,
      ip,
    });
  } catch (error) {
    if (error?.code === 11000 && lead.eventId) {
      return new NextResponse(null, { status: 204 });
    }
    console.error("lead_events write failed", {
      eventId: lead.eventId,
      message: error?.message,
    });
    return NextResponse.json(
      { code: "WRITE_FAILED", message: "Click event was not stored." },
      { status: 503 }
    );
  }

  return new NextResponse(null, { status: 204 });
}
