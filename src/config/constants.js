/**
 * Application Constants
 *
 * Centralized configuration for URLs, contact information, and social media links.
 * This is the single source of truth for all application constants.
 *
 * Update these values to change URLs, phone numbers, or social links across the entire app.
 */

// Base URL Configuration
export const BASE_URL = "https://www.kenbeautysalon.com";

// Booking/Appointment URLs
export const BOOKING_URL = "https://kenbeauty.zenoti.com/webstoreNew/services";

// Ken Card (subscription / rewards)
export const CARD_URL = "https://card.kenbeautysalon.com/";

// Careers / open roles (hosted on Superuser admin app)
export const CAREERS_URL =
  "https://beauty-admin-mauve.vercel.app/en/careers/company/ken-beauty-salon";

// Contact Information
export const CONTACT = {
  primaryPhone: "+971 2 621 8802", // Galleria landline
  primaryMobile: "+971 50 304 3570", // Galleria mobile/WhatsApp
  email: "info@ken-salon.com",
  whatsapp: {
    number: "971503043570", // Galleria WhatsApp (no + for wa.me)
    formatted: "+971 50 304 3570",
    message:
      "Hello KEN Beauty Center, I would like to know more about your services.",
    url: (message = null) => {
      const msg = message || CONTACT.whatsapp.message;
      return `https://wa.me/${
        CONTACT.whatsapp.number
      }?text=${encodeURIComponent(msg)}`;
    },
  },
};

// Social Media Links
export const SOCIAL_MEDIA = {
  instagram: {
    beauty: "https://www.instagram.com/ken_beauty_ad",
    barbershop: "https://www.instagram.com/ken_barbershop.ad",
    ghazarian: "https://www.instagram.com/ken_ghazarian/",
  },
  tiktok: {
    beauty: "https://www.tiktok.com/@kenbeauty04",
    barbershop: "https://www.tiktok.com/@ken_barbershop.ad",
  },
  facebook: {
    beauty: "https://www.facebook.com/profile.php?id=100087593044512",
    barbershop: "https://www.facebook.com/profile.php?id=61570395518132",
  },
};

// Social Media Handles (for display)
export const SOCIAL_HANDLES = {
  instagram: {
    beauty: "ken_beauty_ad",
    barbershop: "ken_barbershop.ad",
    ghazarian: "ken_ghazarian",
  },
  tiktok: {
    barbershop: "@ken_barbershop.ad",
    beauty: "@kenbeauty04",
  },
  facebook: {
    beauty: "Ken Beauty Salon",
    barbershop: "Ken Barbershop",
  },
};

// Business Information
export const BUSINESS = {
  name: "Ken Beauty Salon",
  fullName: "Ken Beauty Salon | Beauty & Barber Services in Abu Dhabi",
  description:
    "Luxury beauty and barber services in Abu Dhabi including hair, nails, facials, and solarium treatments.",
  location: {
    city: "Abu Dhabi",
    country: "United Arab Emirates",
    countryCode: "AE",
  },
};

// App Store Links
export const APP_STORES = {
  googlePlay: "https://play.google.com/store/apps/details?id=com.kenbeautyapp",
  appleAppStore: "https://apps.apple.com/app/id6752693871",
  bundleId: "com.garenghazarian.kenbeautysalon",
  appleId: "6752693871",
};

// Third-Party Services
export const THIRD_PARTY = {
  tidio: {
    scriptUrl: "//code.tidio.co/wuxjaut5j0iru5lnq6efealcjpqmlyhw.js",
  },
  instagram: {
    embedScript: "https://www.instagram.com/embed.js",
    lightwidget:
      "https://cdn.lightwidget.com/widgets/0df751793acd50a8a639c5a6d27cadeb.html",
  },
};

// Image URLs (for metadata, structured data, etc.)
export const IMAGES = {
  get logo() {
    return getSpecialPeriodLogo()
      ? `${BASE_URL}/specialPeriodLogo/002.png`
      : `${BASE_URL}/logo01.png`;
  },
  hero: `${BASE_URL}/hero04.jpg`,
  favicon: `${BASE_URL}/favicon.ico`,
};

/** Navbar mark — always shown regardless of special periods. */
export const NAVBAR_LOGO_DEFAULT_SRC = "/logo03.png";

/** Bump when replacing `public/favicon-for-app/apple-touch-icon.png` so clients refetch. */
export const APPLE_TOUCH_ICON_REVISION = 1;

/** Safari / iOS Add to Home Screen (`rel="apple-touch-icon"`). */
export const APPLE_TOUCH_ICON_URL = `/favicon-for-app/apple-touch-icon.png?v=${APPLE_TOUCH_ICON_REVISION}`;

/** Bump when changing PWA manifest fields or launcher PNGs under `public/favicon-for-app/`. */
export const WEB_APP_MANIFEST_REVISION = 1;

/** Web app manifest for Chrome / Android install and launcher icons. */
export const WEB_APP_MANIFEST_URL = `/favicon-for-app/site.webmanifest?v=${WEB_APP_MANIFEST_REVISION}`;

/**
 * Temporary commemorative logo shown beside the Ken mark.
 * Inclusive calendar dates in Asia/Dubai timezone.
 */
export const SPECIAL_PERIOD_LOGO = {
  startDate: "2026-04-11",
  endDate: "2026-05-11",
  src: "/specialPeriodLogo/002.png",
};

/** Returns the special-period logo path during the active window, or null outside it. */
export function getSpecialPeriodLogo(now = new Date()) {
  const ymd = now.toLocaleDateString("en-CA", { timeZone: "Asia/Dubai" });
  const { startDate, endDate, src } = SPECIAL_PERIOD_LOGO;
  if (ymd >= startDate && ymd <= endDate) return src;
  return null;
}

// Helper function to format phone number for tel: links
// Removes spaces, dashes, parentheses, and other formatting
// Ensures iOS WebView compatibility by keeping + prefix and removing all non-numeric characters except +
export const formatPhoneForTel = (phone) => {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/00795e88-14ee-400a-b1a2-968f12c43d91", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "constants.js:113",
      message: "formatPhoneForTel called",
      data: { input: phone },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion
  if (!phone) return "";
  // Remove all characters except digits and +
  let cleaned = phone.replace(/[^\d+]/g, "");
  // Ensure + is at the start if present, remove any other + signs
  if (cleaned.includes("+")) {
    cleaned = "+" + cleaned.replace(/\+/g, "");
  }
  // For iOS WebView, ensure the number starts with + for international format
  // If no + and starts with country code, add +
  if (!cleaned.startsWith("+") && cleaned.length > 7) {
    // If it looks like an international number without +, add it
    if (cleaned.startsWith("971")) {
      cleaned = "+" + cleaned;
    }
  }
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/00795e88-14ee-400a-b1a2-968f12c43d91", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "constants.js:128",
      message: "formatPhoneForTel result",
      data: { input: phone, output: cleaned },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion
  return cleaned;
};

// iOS WebView compatible tel: link handler
// Some iOS WebViews require special handling for tel: links
export const getTelLink = (phone) => {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/00795e88-14ee-400a-b1a2-968f12c43d91", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "constants.js:133",
      message: "getTelLink called",
      data: { input: phone },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "B",
    }),
  }).catch(() => {});
  // #endregion
  const formatted = formatPhoneForTel(phone);
  if (!formatted) return "#";
  // Ensure tel: protocol is properly formatted for iOS
  const telLink = `tel:${formatted}`;
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/00795e88-14ee-400a-b1a2-968f12c43d91", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "constants.js:137",
      message: "getTelLink result",
      data: { input: phone, formatted, telLink },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "B",
    }),
  }).catch(() => {});
  // #endregion
  return telLink;
};

// Detect if running in iOS WebView (App Store app)
export const isIOSWebView = () => {
  if (typeof window === "undefined") return false;
  const userAgent =
    window.navigator.userAgent || window.navigator.vendor || window.opera;
  // Check for iOS
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  // Check if it's a WebView (not Safari)
  const isWebView =
    isIOS && !/Safari/.test(userAgent) && /AppleWebKit/.test(userAgent);
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/00795e88-14ee-400a-b1a2-968f12c43d91", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "constants.js:150",
      message: "isIOSWebView check",
      data: { userAgent, isIOS, isWebView },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "C",
    }),
  }).catch(() => {});
  // #endregion
  return isWebView;
};

// Detect if running in Android WebView (Google Play app, Chrome Custom Tabs, etc.)
export const isAndroidWebView = () => {
  if (typeof window === "undefined") return false;
  const userAgent =
    window.navigator.userAgent || window.navigator.vendor || window.opera;
  // Check for Android
  const isAndroid = /android/i.test(userAgent);
  // Check if it's a WebView (not Chrome browser)
  // Common Android WebView indicators: wv, WebView, or specific app user agents
  const isWebView =
    isAndroid &&
    (/wv/i.test(userAgent) ||
      /WebView/i.test(userAgent) ||
      !/Chrome/i.test(userAgent));
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/00795e88-14ee-400a-b1a2-968f12c43d91", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "constants.js:167",
      message: "isAndroidWebView check",
      data: { userAgent, isAndroid, isWebView },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "C",
    }),
  }).catch(() => {});
  // #endregion
  return isWebView;
};

// Handle phone click: let the native navigation happen in the same tick.
// Do NOT preventDefault or re-navigate in JS; WebViews block delayed tel: opens.
export const handlePhoneClick = (phone) => {
  // Optional: lightweight analytics that won't block navigation
  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const data = JSON.stringify({ event: "click_phone", phone });
      navigator.sendBeacon("/api/track", data);
    }
  } catch (_) {
    // Best-effort only
  }
  // Return true to allow native tel: handling
  return true;
};

// Helper function to get full URL
export const getFullUrl = (path) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}/${cleanPath}`;
};

// Helper function to get social media array for structured data
export const getSocialMediaArray = () => [
  SOCIAL_MEDIA.instagram.beauty,
  SOCIAL_MEDIA.instagram.barbershop,
  SOCIAL_MEDIA.tiktok.barbershop,
  SOCIAL_MEDIA.tiktok.beauty,
  SOCIAL_MEDIA.facebook.beauty,
  SOCIAL_MEDIA.facebook.barbershop,
];
