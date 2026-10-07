import { stores, getGoogleMapsUrl } from "@/data/stores";
import { productionClickId } from "@/lib/ads/clickId";

export const SALON_EMAIL = stores[0].email.toLowerCase();

/** Background logs kept per minute. The contact link still opens after this. */
export const LEAD_CLICKS_PER_MINUTE = 5;

const EVENT_TYPES = new Set(["whatsapp", "phone", "email", "directions"]);
const EVENT_ID_PATTERN = /^[A-Za-z0-9_-]{16,80}$/;

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

const PHONE_TARGETS = new Map(
  stores.flatMap((store) => [
    [digitsOnly(store.phone), branchKey(store.name)],
    [digitsOnly(store.mobile), branchKey(store.name)],
  ]),
);

const WHATSAPP_TARGETS = new Map(
  stores.map((store) => [
    digitsOnly(store.whatsapp),
    branchKey(store.name),
  ]),
);

const DIRECTION_TARGETS = new Map(
  stores.map((store) => [
    new URL(getGoogleMapsUrl(store)).toString(),
    branchKey(store.name),
  ]),
);

function clip(value, max) {
  if (value == null) return null;
  const text = String(value).trim();
  if (!text) return null;
  return text.slice(0, max);
}

export function branchKey(name) {
  const text = String(name || "");
  if (/rixos/i.test(text)) return "rixos";
  if (/galleria/i.test(text)) return "galleria";
  return null;
}

export function branchFromDigits(digits) {
  return WHATSAPP_TARGETS.get(digits) || PHONE_TARGETS.get(digits) || null;
}

/** Map a tel, mailto, wa.me, or Google Maps href to a lead. Other links are ignored. */
export function classifyHref(href) {
  const raw = String(href || "").trim();
  if (!raw) return null;

  if (raw.startsWith("tel:")) {
    const target = digitsOnly(raw);
    if (!target) return null;
    return { eventType: "phone", target, branch: branchFromDigits(target) };
  }

  if (raw.startsWith("mailto:")) {
    const email = raw.slice("mailto:".length).split("?")[0].trim().toLowerCase();
    if (email !== SALON_EMAIL) return null;
    return { eventType: "email", target: SALON_EMAIL, branch: null };
  }

  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;

  if (url.hostname.toLowerCase() === "wa.me") {
    const target = digitsOnly(url.pathname);
    if (!target) return null;
    return { eventType: "whatsapp", target, branch: branchFromDigits(target) };
  }

  const host = url.hostname.toLowerCase();
  const maps =
    (host === "www.google.com" || host === "maps.google.com") &&
    url.pathname.toLowerCase().startsWith("/maps");
  if (!maps) return null;

  const query = url.searchParams.get("query") || "";
  return {
    eventType: "directions",
    target: url.toString().slice(0, 300),
    branch: branchKey(query),
  };
}

function finite(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 20000) return null;
  return Math.round(number * 100) / 100;
}

function screenOf(value) {
  if (!value || typeof value !== "object") return null;
  const screen = { w: finite(value.w), h: finite(value.h), dpr: finite(value.dpr) };
  if (screen.w == null && screen.h == null && screen.dpr == null) return null;
  return screen;
}

function servicesOf(eventType, value) {
  if (eventType !== "whatsapp" || !Array.isArray(value)) return [];
  return value
    .slice(0, 20)
    .map((service) => ({
      id: clip(service?.id, 80),
      name: clip(service?.name, 120),
    }))
    .filter((service) => service.name);
}

function canonicalTarget(eventType, value) {
  if (eventType === "whatsapp") {
    const target = digitsOnly(value);
    return WHATSAPP_TARGETS.has(target) ? target : null;
  }
  if (eventType === "phone") {
    const target = digitsOnly(value);
    return PHONE_TARGETS.has(target) ? target : null;
  }
  if (eventType === "email") {
    return String(value || "").trim().toLowerCase() === SALON_EMAIL
      ? SALON_EMAIL
      : null;
  }
  try {
    const target = new URL(String(value || "")).toString();
    return DIRECTION_TARGETS.has(target) ? target : null;
  } catch {
    return null;
  }
}

function canonicalBranch(eventType, target) {
  if (eventType === "whatsapp") return WHATSAPP_TARGETS.get(target) || null;
  if (eventType === "phone") return PHONE_TARGETS.get(target) || null;
  if (eventType === "directions") return DIRECTION_TARGETS.get(target) || null;
  return null;
}

function cleanPagePath(value) {
  const path = clip(value, 300);
  if (!path?.startsWith("/")) return null;
  return path.split(/[?#]/, 1)[0];
}

function optionalClickId(value) {
  if (value == null || String(value).trim() === "") return null;
  return productionClickId(value);
}

// First-touch fields are optional: a bad value becomes null, never a rejected click.
const VISIT_ID_PATTERN = /^[A-Za-z0-9_-]{8,200}$/;
const PLACEMENT_PATTERN = /^[A-Za-z0-9_-]{1,80}$/;
const AD_CLICK_ID_PATTERN = /^[A-Za-z0-9._~-]{1,200}$/;
const MAX_SECONDS_ON_SITE = 7 * 24 * 60 * 60;

function text(value, max) {
  return typeof value === "string" ? clip(value, max) : null;
}

function matching(value, pattern) {
  const candidate = typeof value === "string" ? value.trim() : "";
  return pattern.test(candidate) ? candidate : null;
}

function webUrl(value) {
  const url = text(value, 2000);
  if (!url) return null;
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:" ? url.slice(0, 500) : null;
  } catch {
    return null;
  }
}

function dateOf(value) {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function secondsOf(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value < 0 || value > MAX_SECONDS_ON_SITE) return null;
  return Math.round(value);
}

/** Returns a storage-ready object, or null when the click is not a lead. */
export function parseLeadBody(body) {
  if (!body || typeof body !== "object") return null;
  const eventType = body.eventType;
  if (!EVENT_TYPES.has(eventType)) return null;

  const target = canonicalTarget(eventType, body.target);
  if (!target) return null;

  const eventId = clip(body.eventId, 80);
  if (eventId && !EVENT_ID_PATTERN.test(eventId)) return null;

  const gclid = optionalClickId(body.gclid);
  const gbraid = optionalClickId(body.gbraid);
  const wbraid = optionalClickId(body.wbraid);
  if (
    (body.gclid && !gclid) ||
    (body.gbraid && !gbraid) ||
    (body.wbraid && !wbraid)
  ) {
    return null;
  }

  return {
    eventId,
    eventType,
    branch: canonicalBranch(eventType, target),
    target,
    pagePath: cleanPagePath(body.pagePath),
    services: servicesOf(eventType, body.services),
    gclid,
    gbraid,
    wbraid,
    language: clip(body.language, 40),
    timezone: clip(body.timezone, 80),
    screen: screenOf(body.screen),
    referrer: clip(body.referrer, 500),
    visitId: matching(body.visitId, VISIT_ID_PATTERN),
    landingUrl: webUrl(body.landingUrl),
    landingReferrer: text(body.landingReferrer, 500),
    landedAt: dateOf(body.landedAt),
    pageUrl: webUrl(body.pageUrl),
    utmSource: text(body.utmSource, 200),
    utmMedium: text(body.utmMedium, 200),
    utmCampaign: text(body.utmCampaign, 200),
    utmContent: text(body.utmContent, 200),
    utmTerm: text(body.utmTerm, 200),
    fbclid: matching(body.fbclid, AD_CLICK_ID_PATTERN),
    ttclid: matching(body.ttclid, AD_CLICK_ID_PATTERN),
    msclkid: matching(body.msclkid, AD_CLICK_ID_PATTERN),
    placement: matching(body.placement, PLACEMENT_PATTERN),
    secondsOnSite: secondsOf(body.secondsOnSite),
  };
}
