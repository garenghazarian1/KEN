/**
 * Turn phones, emails, URLs, and known salon addresses in plain text into
 * clickable React link nodes. Safe: only wraps matched spans; never parses HTML.
 */

import { getGoogleMapsUrl, stores } from "@/data/stores";
import {
  BOOKING_URL,
  CARD_URL,
  CAREERS_URL,
  BASE_URL,
  WHATSAPP_CONTACTS,
  APP_STORES,
  CONTACT,
} from "@/config/constants";

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const URL_RE = /https?:\/\/[^\s<>"')\]]+/gi;
/** UAE-style and general international phones as the assistant tends to write them. */
const PHONE_RE =
  /(?:\+|00)?971[\s-]?(?:\d[\s-]?){8,9}|\+\d{1,3}[\s-]?(?:\d[\s-]?){6,14}\d/g;

const WHATSAPP_DIGITS = new Set(
  WHATSAPP_CONTACTS.map((c) => c.number.replace(/\D/g, ""))
);
const KNOWN_PHONE_DIGITS = new Set([
  ...stores.flatMap((store) => [
    digitsOnly(store.phone),
    digitsOnly(store.mobile),
    digitsOnly(store.whatsapp),
  ]),
  digitsOnly(CONTACT.primaryPhone),
  digitsOnly(CONTACT.primaryMobile),
]);
const KNOWN_EMAILS = new Set([
  CONTACT.email.toLowerCase(),
  ...stores.map((store) => store.email.toLowerCase()),
]);
const TRUSTED_URLS = [
  BOOKING_URL,
  CARD_URL,
  CAREERS_URL,
  BASE_URL,
  APP_STORES.googlePlay,
  APP_STORES.appleAppStore,
];
const TRUSTED_HOSTS = new Set(
  TRUSTED_URLS.map((url) => new URL(url).hostname.toLowerCase())
);

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function telHref(raw) {
  const cleaned = raw.replace(/[^\d+]/g, "");
  if (!cleaned) return null;
  if (cleaned.startsWith("+")) return `tel:${cleaned}`;
  if (cleaned.startsWith("971")) return `tel:+${cleaned}`;
  if (cleaned.startsWith("00")) return `tel:+${cleaned.slice(2)}`;
  return `tel:${cleaned}`;
}

function phoneHref(raw) {
  const digits = digitsOnly(raw);
  if (!KNOWN_PHONE_DIGITS.has(digits)) return null;
  if (WHATSAPP_DIGITS.has(digits)) {
    return `https://wa.me/${digits}`;
  }
  return telHref(raw);
}

function trustedUrl(raw) {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" &&
      (TRUSTED_HOSTS.has(url.hostname.toLowerCase()) ||
        url.hostname.toLowerCase() === "wa.me")
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

/** Longest streets first so partial shorter matches don't win. */
const ADDRESS_ENTRIES = stores
  .map((store) => ({
    street: store.street,
    href: getGoogleMapsUrl(store),
  }))
  .sort((a, b) => b.street.length - a.street.length);

const KNOWN_PATHS = [
  { match: /\/contact\b/gi, href: `${BASE_URL}/contact` },
  { match: /\/services\b/gi, href: `${BASE_URL}/services` },
];

function stripTrailingPunct(url) {
  return url.replace(/[.,;:!?)]+$/, "");
}

/**
 * Collect non-overlapping match ranges.
 * @param {string} text
 * @returns {Array<{ start: number, end: number, href: string, label: string }>}
 */
function collectMatches(text) {
  /** @type {Array<{ start: number, end: number, href: string, label: string }>} */
  const matches = [];

  const pushIfFree = (start, end, href, label) => {
    if (start < 0 || end <= start || !href) return;
    if (matches.some((m) => !(end <= m.start || start >= m.end))) return;
    matches.push({ start, end, href, label });
  };

  for (const re of [URL_RE, EMAIL_RE, PHONE_RE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      const raw = m[0];
      if (re === URL_RE) {
        const clean = stripTrailingPunct(raw);
        pushIfFree(m.index, m.index + clean.length, trustedUrl(clean), clean);
      } else if (re === EMAIL_RE) {
        const email = raw.toLowerCase();
        pushIfFree(
          m.index,
          m.index + raw.length,
          KNOWN_EMAILS.has(email) ? `mailto:${raw}` : null,
          raw
        );
      } else {
        pushIfFree(m.index, m.index + raw.length, phoneHref(raw), raw);
      }
    }
  }

  for (const { street, href } of ADDRESS_ENTRIES) {
    let from = 0;
    const lower = text.toLowerCase();
    const needle = street.toLowerCase();
    while (from < text.length) {
      const idx = lower.indexOf(needle, from);
      if (idx === -1) break;
      pushIfFree(idx, idx + street.length, href, text.slice(idx, idx + street.length));
      from = idx + street.length;
    }
  }

  for (const { match, href } of KNOWN_PATHS) {
    match.lastIndex = 0;
    let m;
    while ((m = match.exec(text)) !== null) {
      pushIfFree(m.index, m.index + m[0].length, href, m[0]);
    }
  }

  for (const url of TRUSTED_URLS) {
    try {
      const hostPath = url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
      if (!hostPath) continue;
      let from = 0;
      const lower = text.toLowerCase();
      const needle = hostPath.toLowerCase();
      while (from < text.length) {
        const idx = lower.indexOf(needle, from);
        if (idx === -1) break;
        pushIfFree(
          idx,
          idx + hostPath.length,
          url,
          text.slice(idx, idx + hostPath.length)
        );
        from = idx + hostPath.length;
      }
    } catch {
      // ignore bad URLs
    }
  }

  return matches.sort((a, b) => a.start - b.start);
}

/**
 * @param {string} text
 * @param {string} [linkClassName]
 * @returns {Array<string|import('react').ReactElement>}
 */
export function linkifyToNodes(text, linkClassName) {
  if (!text) return [""];
  const matches = collectMatches(text);
  if (!matches.length) return [text];

  /** @type {Array<string|import('react').ReactElement>} */
  const nodes = [];
  let cursor = 0;
  let key = 0;

  for (const m of matches) {
    if (m.start > cursor) nodes.push(text.slice(cursor, m.start));
    const isExternal = /^https?:/i.test(m.href);
    nodes.push(
      <a
        key={`l${key++}`}
        href={m.href}
        className={linkClassName}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        aria-label={isExternal ? `${m.label} (opens in a new tab)` : undefined}
      >
        {m.label}
      </a>
    );
    cursor = m.end;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}
