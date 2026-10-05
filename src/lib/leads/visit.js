/**
 * First-touch visit for the lead writer. Saved once per browser session in
 * sessionStorage and never overwritten. Separate from the 90-day ads store.
 */

const STORAGE_KEY = "ken_first_visit";

const LANDING_PARAMS = {
  utmSource: "utm_source",
  utmMedium: "utm_medium",
  utmCampaign: "utm_campaign",
  utmContent: "utm_content",
  utmTerm: "utm_term",
  fbclid: "fbclid",
  ttclid: "ttclid",
  msclkid: "msclkid",
};

export function createId() {
  try {
    return window.crypto.randomUUID();
  } catch {
    return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`;
  }
}

function readVisit() {
  try {
    const visit = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY));
    return visit && typeof visit === "object" ? visit : null;
  } catch {
    return null;
  }
}

/** Save the first page of this session. Safe to call on every load. */
export function captureFirstVisit() {
  if (typeof window === "undefined" || readVisit()) return;
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        visitId: createId(),
        landingUrl: window.location.href,
        landingReferrer: document.referrer || null,
        landedAt: new Date().toISOString(),
      }),
    );
  } catch {
    // Private mode or quota: the click is still recorded without a visit.
  }
}

/** Remove the saved visit after tracking consent is declined. */
export function clearFirstVisit() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

/** First-touch fields for one click. Every field is null when no visit exists. */
export function visitFields() {
  const visit = (typeof window !== "undefined" && readVisit()) || {};
  const landedMs = Date.parse(visit.landedAt);

  let params = new URLSearchParams();
  try {
    params = new URL(visit.landingUrl).searchParams;
  } catch {
    // No usable landing URL.
  }

  return {
    visitId: visit.visitId || null,
    landingUrl: visit.landingUrl || null,
    landingReferrer: visit.landingReferrer || null,
    landedAt: visit.landedAt || null,
    secondsOnSite: Number.isNaN(landedMs)
      ? null
      : Math.max(0, Math.round((Date.now() - landedMs) / 1000)),
    ...Object.fromEntries(
      Object.entries(LANDING_PARAMS).map(([field, param]) => [
        field,
        params.get(param) || null,
      ]),
    ),
  };
}
