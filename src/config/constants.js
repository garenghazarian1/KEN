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

// Admin system (public business API + careers)
export const ADMIN_PUBLIC_BASE_URL = "https://beauty-admin-mauve.vercel.app";

// Public business API slug for service catalog, prices, etc.
export const BUSINESS_SLUG = "ken-beauty-salon";

export const BUSINESS_CURRENCY = "AED";

// Careers / open roles (hosted on Superuser admin app)
export const CAREERS_URL =
  `${ADMIN_PUBLIC_BASE_URL}/en/careers/company/ken-beauty-salon`;

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

/**
 * WhatsApp booking contacts — one entry per branch / number.
 * Add more objects here when new branches open.
 */
export const WHATSAPP_CONTACTS = [
  {
    label: "Galleria Al Maryah Island",
    number: "971503043570",
    formatted: "+971 50 304 3570",
    message: "Hello KEN Beauty Center (Galleria), I would like to book a service.",
  },
  {
    label: "Rixos Hotel Marina",
    number: "971555570029",
    formatted: "+971 55 557 0029",
    message: "Hello KEN Beauty Center (Rixos), I would like to book a service.",
  },
];

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
  googleTagManager: {
    id: "GTM-M3QMMNGZ",
  },
  tidio: {
    scriptUrl: "//code.tidio.co/wuxjaut5j0iru5lnq6efealcjpqmlyhw.js",
  },
  instagram: {
    embedScript: "https://www.instagram.com/embed.js",
    lightwidget:
      "https://cdn.lightwidget.com/widgets/0df751793acd50a8a639c5a6d27cadeb.html",
  },
};

/** Canonical Ken Salon brand mark (source of all generated icons). */
export const BRAND_LOGO_SRC = "/salon-logo-2026.jpg";

/** AI assistant face avatar (UAE woman portrait — AI look, no hijab). */
export const ASSISTANT_AVATAR_SRC = "/assistant/ken-assistant-avatar.webp?v=2";
export const ASSISTANT_AVATAR_FALLBACK_SRC = "/assistant/ken-assistant-avatar.png?v=2";

// Image URLs (for metadata, structured data, etc.)
export const IMAGES = {
  logo: `${BASE_URL}${BRAND_LOGO_SRC}`,
  hero: `${BASE_URL}/hero04.jpg`,
  get favicon() {
    return `${BASE_URL}${FAVICON_ROOT_URL}`;
  },
};

/** Navbar / loading mark (transparent PNG). */
export const NAVBAR_LOGO_DEFAULT_SRC = "/logo03.png";

/**
 * Icon cache-bust revisions — bump all three together when replacing logos.
 * Full checklist: docs/BRAND_ICONS.md (includes graphify update + deploy).
 */
/** Bump when replacing tab / shortcut favicon assets so browsers refetch. */
export const FAVICON_REVISION = 2;

export const FAVICON_ICO_URL = `/favicon-for-app/favicon.ico?v=${FAVICON_REVISION}`;
export const FAVICON_SVG_URL = `/favicon-for-app/favicon.svg?v=${FAVICON_REVISION}`;
export const FAVICON_96_URL = `/favicon-for-app/favicon-96x96.png?v=${FAVICON_REVISION}`;
/** Root fallback for crawlers and direct /favicon.ico requests. */
export const FAVICON_ROOT_URL = `/favicon.ico?v=${FAVICON_REVISION}`;

/** Next.js metadata.icons entries for layout.jsx. */
export const METADATA_FAVICON_ICONS = [
  { url: FAVICON_ICO_URL, sizes: "48x48" },
  { url: FAVICON_SVG_URL, type: "image/svg+xml" },
  { url: FAVICON_96_URL, sizes: "96x96", type: "image/png" },
];

/** Bump when replacing `public/favicon-for-app/apple-touch-icon.png` so clients refetch. */
export const APPLE_TOUCH_ICON_REVISION = 2;

/** Safari / iOS Add to Home Screen (`rel="apple-touch-icon"`). */
export const APPLE_TOUCH_ICON_URL = `/favicon-for-app/apple-touch-icon.png?v=${APPLE_TOUCH_ICON_REVISION}`;

/** Bump when changing PWA manifest fields or launcher PNGs under `public/favicon-for-app/`. */
export const WEB_APP_MANIFEST_REVISION = 2;

/** Web app manifest for Chrome / Android install and launcher icons. */
export const WEB_APP_MANIFEST_URL = `/favicon-for-app/site.webmanifest?v=${WEB_APP_MANIFEST_REVISION}`;

/** PWA launcher PNG paths (keep in sync with site.webmanifest icon src). */
export const PWA_ICON_192_URL = `/favicon-for-app/web-app-manifest-192x192.png?v=${WEB_APP_MANIFEST_REVISION}`;
export const PWA_ICON_512_URL = `/favicon-for-app/web-app-manifest-512x512.png?v=${WEB_APP_MANIFEST_REVISION}`;

// Helper function to format phone number for tel: links
// Removes spaces, dashes, parentheses, and other formatting
// Ensures iOS WebView compatibility by keeping + prefix and removing all non-numeric characters except +
export const formatPhoneForTel = (phone) => {
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
  return cleaned;
};

// iOS WebView compatible tel: link handler
// Some iOS WebViews require special handling for tel: links
export const getTelLink = (phone) => {
  const formatted = formatPhoneForTel(phone);
  if (!formatted) return "#";
  // Ensure tel: protocol is properly formatted for iOS
  return `tel:${formatted}`;
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
