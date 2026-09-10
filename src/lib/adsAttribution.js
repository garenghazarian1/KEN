/**
 * Google Ads click attribution helpers for WhatsApp CTAs.
 * Stores gclid / gbraid / wbraid from the landing URL so staff and analytics
 * can later tie a WhatsApp chat back to the original ad click.
 */

const STORAGE_KEY = "ken_ads_attribution";
const COOKIE_NAME = "ken_gclid";
const TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

const PARAM_KEYS = ["gclid", "gbraid", "wbraid"];

function canUseDom() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function readStored() {
  if (!canUseDom()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(payload) {
  if (!canUseDom()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota / private mode
  }

  try {
    if (payload.gclid) {
      const maxAge = Math.floor(TTL_MS / 1000);
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
        payload.gclid
      )}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
    }
  } catch {
    // Ignore cookie failures
  }
}

/**
 * Capture attribution params from the current URL (if present) and persist them.
 * Safe to call on every page load.
 */
export function captureAdsAttributionFromUrl() {
  if (!canUseDom()) return getAdsAttribution();

  try {
    const params = new URLSearchParams(window.location.search);
    const next = { ...(readStored() || {}) };
    let changed = false;

    for (const key of PARAM_KEYS) {
      const value = params.get(key);
      if (value && value.trim()) {
        next[key] = value.trim();
        changed = true;
      }
    }

    if (changed) {
      next.capturedAt = new Date().toISOString();
      next.expiresAt = Date.now() + TTL_MS;
      next.landingPath = `${window.location.pathname}${window.location.search}`;
      writeStored(next);
    }

    return getAdsAttribution();
  } catch {
    return getAdsAttribution();
  }
}

/** @returns {{ gclid?: string, gbraid?: string, wbraid?: string, capturedAt?: string, landingPath?: string } | null} */
export function getAdsAttribution() {
  return readStored();
}

/** Short ref staff can see in WhatsApp (prefer gclid). */
export function getAttributionRef() {
  const attrs = getAdsAttribution();
  if (!attrs) return null;
  return attrs.gclid || attrs.gbraid || attrs.wbraid || null;
}

/**
 * Append a compact attribution line to a WhatsApp prefilled message.
 */
export function withAttributionMessage(baseMessage) {
  const ref = getAttributionRef();
  const base =
    (baseMessage && String(baseMessage).trim()) ||
    "Hello KEN Beauty Center, I would like to know more about your services.";
  if (!ref) return base;
  // Keep it short so it stays readable in WhatsApp Business inbox
  return `${base}\n\nRef: ${ref}`;
}

/**
 * Build a wa.me URL with attribution baked into the prefilled text.
 */
export function buildWhatsAppUrl({ number, message } = {}) {
  const phone = String(number || "").replace(/[^\d]/g, "");
  const text = withAttributionMessage(message);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Fire a GTM/dataLayer event on WhatsApp click (does not replace existing TechSol tags).
 */
export function trackWhatsAppClick({ branch, number } = {}) {
  if (!canUseDom()) return;
  const attrs = getAdsAttribution() || {};
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "whatsapp_click",
      whatsapp_branch: branch || null,
      whatsapp_number: number || null,
      gclid: attrs.gclid || null,
      gbraid: attrs.gbraid || null,
      wbraid: attrs.wbraid || null,
    });
  } catch {
    // Best-effort only
  }
}
