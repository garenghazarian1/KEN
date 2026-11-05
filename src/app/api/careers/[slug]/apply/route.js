import { NextResponse } from "next/server";
import { ADMIN_PUBLIC_BASE_URL } from "@/config/constants";
import { isPublicJobSlug } from "@/lib/business/careers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request, { params }) {
  const slug = typeof params?.slug === "string" ? decodeURIComponent(params.slug).trim() : "";
  if (!isPublicJobSlug(slug)) {
    return NextResponse.json(
      { code: "VALIDATION_ERROR", message: "Invalid job link." },
      { status: 400 }
    );
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return NextResponse.json(
      { code: "VALIDATION_ERROR", message: "Expected multipart form data." },
      { status: 400 }
    );
  }

  let incoming;
  try {
    incoming = await request.formData();
  } catch {
    return NextResponse.json(
      { code: "FILE_TOO_LARGE", message: "File is too large." },
      { status: 400 }
    );
  }

  const outgoing = new FormData();
  for (const [key, value] of incoming.entries()) {
    outgoing.append(key, value);
  }

  try {
    const adminRes = await fetch(
      `${ADMIN_PUBLIC_BASE_URL}/api/public/jobs/${encodeURIComponent(slug)}/apply`,
      { method: "POST", body: outgoing, cache: "no-store" }
    );
    const body = await adminRes.text();
    return new NextResponse(body, {
      status: adminRes.status,
      headers: {
        "Content-Type": adminRes.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        code: "VALIDATION_ERROR",
        message: "Could not submit your application. Check the form and try again.",
      },
      { status: 502 }
    );
  }
}
