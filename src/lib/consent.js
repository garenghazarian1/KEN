export const COOKIE_CONSENT_KEY = "cookieConsent";
export const COOKIE_CONSENT_CHANGE_EVENT = "ken-cookie-consent-change";

export function readCookieConsent() {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return value === "accepted" || value === "declined" ? value : null;
}

export function writeCookieConsent(value) {
  if (typeof window === "undefined") return;
  if (value !== "accepted" && value !== "declined") return;
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_CHANGE_EVENT, { detail: value }),
  );
}
