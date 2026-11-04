"use client";

import { useEffect } from "react";
import { THIRD_PARTY } from "@/config/constants";

const IDLE_CAP_MS = 3000;

function injectGoogleTag() {
  if (document.getElementById("gtm-init")) return;
  const id = THIRD_PARTY.googleTagManager.id;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const script = document.createElement("script");
  script.id = "gtm-init";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.appendChild(script);
}

/** Home waits for the hero still, then idle. Every other page loads at once. */
export default function DeferredGoogleTag() {
  useEffect(() => {
    const still = document.querySelector("[data-hero-still]");
    if (!still) {
      injectGoogleTag();
      return undefined;
    }

    let cancelled = false;
    let scheduled = false;
    let cancelIdle = () => {};
    const started = performance.now();

    const run = () => {
      if (!cancelled) injectGoogleTag();
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      const remaining = Math.max(0, IDLE_CAP_MS - (performance.now() - started));
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(run, { timeout: remaining });
        cancelIdle = () => window.cancelIdleCallback(id);
        return;
      }
      const timer = window.setTimeout(run, remaining);
      cancelIdle = () => window.clearTimeout(timer);
    };

    if (still.complete && still.naturalWidth > 0) schedule();
    else {
      still.addEventListener("load", schedule, { once: true });
      still.addEventListener("error", schedule, { once: true });
    }
    const cap = window.setTimeout(schedule, IDLE_CAP_MS);

    return () => {
      cancelled = true;
      cancelIdle();
      window.clearTimeout(cap);
      still.removeEventListener("load", schedule);
      still.removeEventListener("error", schedule);
    };
  }, []);

  return null;
}
