"use client";

import { useEffect } from "react";
import { captureAdsAttributionFromUrl } from "@/lib/adsAttribution";
import { captureFirstVisit } from "@/lib/leads/visit";

/** Save the Google click id and the first page of this visit. Does not wait for a cookie prompt. */
export default function ConsentAnalytics() {
  useEffect(() => {
    captureAdsAttributionFromUrl();
    captureFirstVisit();
  }, []);

  return null;
}
