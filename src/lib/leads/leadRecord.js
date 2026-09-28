const GALLERIA_DIGITS = "971503043570";
const RIXOS_DIGITS = "971555570029";
export const SALON_EMAIL = "info@ken-salon.com";

const EVENT_TYPES = new Set(["whatsapp", "phone", "email", "directions"]);

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

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
  if (digits === GALLERIA_DIGITS) return "galleria";
  if (digits === RIXOS_DIGITS) return "rixos";
  return null;
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

/** Returns a storage-ready object, or null when the click is not a lead. */
export function parseLeadBody(body) {
  if (!body || typeof body !== "object") return null;
  const eventType = body.eventType;
  if (!EVENT_TYPES.has(eventType)) return null;

  let target = clip(body.target, 300);
  if (eventType === "email") {
    if (String(target || "").toLowerCase() !== SALON_EMAIL) return null;
    target = SALON_EMAIL;
  }
  if (!target) return null;

  const branch =
    body.branch === "galleria" || body.branch === "rixos" ? body.branch : null;

  return {
    eventType,
    branch,
    target,
    pagePath: clip(body.pagePath, 300),
    services: servicesOf(eventType, body.services),
    gclid: clip(body.gclid, 200),
    gbraid: clip(body.gbraid, 200),
    wbraid: clip(body.wbraid, 200),
    language: clip(body.language, 40),
    timezone: clip(body.timezone, 80),
    screen: screenOf(body.screen),
    referrer: clip(body.referrer, 500),
  };
}
