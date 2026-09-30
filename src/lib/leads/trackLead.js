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

function createEventId() {
  try {
    return window.crypto.randomUUID();
  } catch {
    return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`;
  }
}

/**
 * Record one outbound contact click. Does not prove a message was sent and
 * does not prevent navigation.
 * gtm: also push the existing whatsapp_click dataLayer event.
 */
export function recordOutbound(href, { branch, services, gtm = false, gtmBranch } = {}) {
  if (typeof window === "undefined") return;
  const lead = classifyHref(href);
  if (!lead) return;
  const eventId = createEventId();

  if (gtm && lead.eventType === "whatsapp") {
    trackWhatsAppClick({
      branch: gtmBranch ?? branch ?? lead.branch,
      number: lead.target,
      eventId,
    });
  }

  const attrs = getAdsAttribution() || {};
  postLead({
    eventId,
    eventType: lead.eventType,
    branch: branch ?? lead.branch,
    target: lead.target,
    services: lead.eventType === "whatsapp" ? services || [] : [],
    pagePath: window.location.pathname,
    gclid: attrs.gclid || null,
    gbraid: attrs.gbraid || null,
    wbraid: attrs.wbraid || null,
  });
  return eventId;
}
