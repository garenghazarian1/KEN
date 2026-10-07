import { getAdsAttribution, trackWhatsAppClick } from "@/lib/adsAttribution";
import { classifyHref, LEAD_CLICKS_PER_MINUTE } from "@/lib/leads/leadRecord";
import { createId, visitFields } from "@/lib/leads/visit";

const LEAD_WINDOW_MS = 60 * 1000;
const leadClickTimes = [];

function takeLeadClickSlot() {
  const now = Date.now();
  const recent = leadClickTimes.filter((time) => now - time < LEAD_WINDOW_MS);
  leadClickTimes.length = 0;
  leadClickTimes.push(...recent);
  if (leadClickTimes.length >= LEAD_CLICKS_PER_MINUTE) return false;
  leadClickTimes.push(now);
  return true;
}

/** Test seam. The contact link does not use this window. */
export function resetLeadClickWindow() {
  leadClickTimes.length = 0;
}

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
 * Record one outbound contact click. Does not prove a message was sent and
 * does not prevent navigation. After five logs in a minute, later taps still
 * open the link and are not stored or sent to the data layer.
 * gtm: also push the existing whatsapp_click dataLayer event.
 * placement: short id of the pressed button, set only where it is obvious.
 */
export function recordOutbound(
  href,
  { branch, services, gtm = false, gtmBranch, placement } = {},
) {
  if (typeof window === "undefined") return;
  const lead = classifyHref(href);
  if (!lead) return;
  if (!takeLeadClickSlot()) return;
  const eventId = createId();

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
    ...visitFields(),
    pageUrl: window.location.href,
    placement: placement || null,
  });
  return eventId;
}
