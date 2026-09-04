import { NextResponse } from "next/server";
import { getAssistantModels } from "@/lib/assistant/models";
import { applyAssistantCleanupBatch } from "@/lib/assistant/applyAssistantCleanupBatch";
import { BUSINESS_SLUG } from "@/config/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * GET /api/cron/assistant-cleanup
 * Marks Ken conversations idle after 15 min inactivity, closed after 24 h.
 * Auth: Authorization: Bearer CRON_SECRET (Vercel Cron).
 */
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { success: false, message: "CRON_SECRET is not configured" },
      { status: 503 }
    );
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { AssistantConversation } = await getAssistantModels();
    const now = new Date();
    const openOrIdle = await AssistantConversation.find({
      businessSlug: BUSINESS_SLUG,
      status: { $in: ["open", "idle"] },
    })
      .select("status lastMessageAt")
      .limit(500)
      .lean();

    const data = await applyAssistantCleanupBatch({
      conversations: openOrIdle,
      now,
      updateOne: (filter, update) =>
        AssistantConversation.updateOne(filter, update),
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[assistant] cleanup cron", error);
    return NextResponse.json(
      { success: false, message: "Cleanup failed" },
      { status: 500 }
    );
  }
}
