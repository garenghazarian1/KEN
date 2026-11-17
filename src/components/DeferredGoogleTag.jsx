"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { THIRD_PARTY } from "@/config/constants";
import { whenThirdParties } from "@/components/scheduleThirdParties";

function releaseFbqStub() {
  const stub = window.fbq;
  if (!stub || stub.callMethod || stub.__kenStub !== true) return;
  window.__fbqEarly = stub.queue || window.__fbqEarly || [];
  try {
    delete window.fbq;
  } catch {
    window.fbq = undefined;
  }
}

function replayFbq() {
  const queued = window.__fbqEarly || [];
  if (!queued.length) return;
  const send = () => {
    if (typeof window.fbq !== "function") return false;
    const batch = queued.splice(0, queued.length);
    batch.forEach((args) => window.fbq.apply(null, args));
    return true;
  };
  if (send()) return;
  const id = window.setInterval(() => {
    if (send()) window.clearInterval(id);
  }, 250);
  window.setTimeout(() => window.clearInterval(id), 10000);
}

function injectGoogleTag(clarityId) {
  if (document.getElementById("gtm-init")) return;
  window.__gtmListening = true;
  releaseFbqStub();
  const id = THIRD_PARTY.googleTagManager.id;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const script = document.createElement("script");
  script.id = "gtm-init";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  script.onload = () => replayFbq();
  document.head.appendChild(script);

  if (clarityId && !document.getElementById("clarity-init")) {
    const clarity = document.createElement("script");
    clarity.id = "clarity-init";
    clarity.async = true;
    clarity.src = `https://www.clarity.ms/tag/${clarityId}`;
    document.head.appendChild(clarity);
  }
}

export default function DeferredGoogleTag({ clarityId = "" }) {
  useEffect(() => whenThirdParties(() => injectGoogleTag(clarityId)), [clarityId]);
  return null;
}

export function DelayedAnalytics() {
  const [on, setOn] = useState(false);
  useEffect(() => whenThirdParties(() => setOn(true)), []);
  if (!on) return null;
  return <Analytics />;
}
