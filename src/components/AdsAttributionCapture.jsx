"use client";

import { useEffect } from "react";
import { captureAdsAttributionFromUrl } from "@/lib/adsAttribution";

/**
 * Captures gclid/gbraid/wbraid from the landing URL once on mount.
 * Mount near the root client layout so every page stores Ads click IDs.
 */
export default function AdsAttributionCapture() {
  useEffect(() => {
    captureAdsAttributionFromUrl();
  }, []);

  return null;
}
