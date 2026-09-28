import { getAdsAttribution, trackWhatsAppClick } from "@/lib/adsAttribution";
import { classifyHref } from "@/lib/leads/leadRecord";

function postLead(payload) {
  const json = JSON.stringify(payload);
  try {
    const blob = new Blob([json], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/leads", blob)) return;
  } catch {
    // Fall through to fetch.
  }
  fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
    keepalive: true,
  }).catch(() => {});
}

/**
 * Record one outbound lead. Does not prevent navigation.
 * gtm: also push the existing whatsapp_click dataLayer event.
 */
export function recordOutbound(href, { branch, services, gtm = false, gtmBranch } = {}) {
  if (typeof window === "undefined") return;
  const lead = classifyHref(href);
  if (!lead) return;

  if (gtm && lead.eventType === "whatsapp") {
    trackWhatsAppClick({
      branch: gtmBranch ?? branch ?? lead.branch,
      number: lead.target,
    });
  }

  const attrs = getAdsAttribution() || {};
  postLead({
    eventType: lead.eventType,
    branch: branch ?? lead.branch,
    target: lead.target,
    services: lead.eventType === "whatsapp" ? services || [] : [],
    pagePath: `${window.location.pathname}${window.location.search}`,
    language: navigator.language || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    screen: {
      w: window.screen?.width ?? null,
      h: window.screen?.height ?? null,
      dpr: window.devicePixelRatio ?? null,
    },
    referrer: document.referrer || null,
    gclid: attrs.gclid || null,
    gbraid: attrs.gbraid || null,
    wbraid: attrs.wbraid || null,
  });
}
