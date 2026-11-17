import { NextResponse } from "next/server";
import { ADMIN_PUBLIC_BASE_URL } from "@/config/constants";
import { careerDetailSlug, isPublicJobSlug } from "@/lib/business/careers";

function missingJob(request) {
  const url = request.nextUrl.clone();
  url.pathname = "/job-not-found";
  url.search = "";
  return NextResponse.rewrite(url, { status: 404 });
}

export async function proxy(request) {
  if (request.headers.get("next-router-prefetch") === "1") {
    return NextResponse.next();
  }

  const slug = careerDetailSlug(request.nextUrl.pathname);
  if (!slug) return NextResponse.next();
  if (!isPublicJobSlug(slug)) return missingJob(request);

  try {
    const res = await fetch(
      `${ADMIN_PUBLIC_BASE_URL}/api/public/jobs/${encodeURIComponent(slug)}`,
      { cache: "no-store", headers: { accept: "application/json" } }
    );
    if (res.status === 404) return missingJob(request);
  } catch {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/careers/:slug",
};
