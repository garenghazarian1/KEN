/**
 * Catalog grounding for the assistant with a server-side cache.
 *
 * The services page intentionally fetches `no-store`; the chat route must not
 * hit the admin API on every message, so the built catalog + MiniSearch index
 * are cached in module scope for CATALOG_TTL_MS.
 *
 * The admin public API catalog is the ONLY source of truth for services/prices.
 */

import {
  getServiceCatalog,
  buildServiceSections,
} from "@/lib/business/serviceCatalog";
import {
  buildServiceSearchCatalog,
  searchServices,
} from "@/lib/business/serviceSearch";

const CATALOG_TTL_MS = 10 * 60 * 1000;

const OVERVIEW_RE =
  /\b(service|services|offer|offers|treatment|treatments|menu|what do you|catalog|price list|pricelist)\b/i;

/** Drink questions should use FAQ grounding, not the service-catalog overview. */
const DRINKS_QUERY_RE =
  /\b(drink|drinks|beverage|beverages|coffee|tea|mojito|cappuccino|latte|espresso|juice)\b/i;

const localeCaches = new Map();

async function loadCatalog(locale) {
  const { services } = await getServiceCatalog(locale);
  const sections = buildServiceSections(services);
  return {
    search: buildServiceSearchCatalog(sections),
    sections,
  };
}

async function getCachedCatalog(locale) {
  const now = Date.now();
  const cache = localeCaches.get(locale) || {
    data: null,
    expiresAt: 0,
    promise: null,
  };
  if (cache.data && now < cache.expiresAt) return cache.data;

  if (!cache.promise) {
    cache.promise = loadCatalog(locale)
      .then((data) => {
        localeCaches.set(locale, {
          data,
          expiresAt: Date.now() + CATALOG_TTL_MS,
          promise: null,
        });
        return data;
      })
      .catch((err) => {
        cache.promise = null;
        localeCaches.set(locale, cache);
        throw err;
      });
    localeCaches.set(locale, cache);
  }
  return cache.promise;
}

function formatItem({ item, categoryTitle, subcategoryTitle }) {
  const parts = [
    `- ${item.name}`,
    subcategoryTitle
      ? `(${categoryTitle} › ${subcategoryTitle})`
      : `(${categoryTitle})`,
  ];
  if (item.priceLabel) parts.push(`— ${item.priceLabel}`);
  if (item.priceDisplayType === "sale" && item.priceCompareAtLabel) {
    parts.push(`(was ${item.priceCompareAtLabel})`);
  }
  if (item.durationMinutes) parts.push(`— approx. ${item.durationMinutes} min`);
  return parts.join(" ");
}

function formatCategoryOverview(sections) {
  if (!sections?.length) return "";
  const lines = sections.map((section) => {
    const itemCount =
      (section.items?.length ?? 0) +
      (section.groups?.reduce((n, g) => n + (g.items?.length ?? 0), 0) ?? 0);
    const groupNames = section.groups?.map((g) => g.title).filter(Boolean) ?? [];
    const detail = groupNames.length
      ? ` — includes: ${groupNames.slice(0, 8).join(", ")}`
      : "";
    return `- ${section.title} (${itemCount} services)${detail}`;
  });
  return `Live catalog categories from the admin API (source of truth — only mention these categories and the matching services below; do not invent others):\n${lines.join("\n")}`;
}

/**
 * Search the catalog and return a compact plain-text context block.
 * Returns { context: string, sources: string[] }.
 * @param {string} query
 * @param {number} [limit=8]
 */
export async function buildCatalogContext(query, limit = 8) {
  try {
    const locale = /[\u0600-\u06ff]/.test(query || "") ? "ar" : "en";
    const { search, sections } = await getCachedCatalog(locale);
    const parts = [];
    const sources = [];

    if (OVERVIEW_RE.test(query || "") && !DRINKS_QUERY_RE.test(query || "")) {
      const overview = formatCategoryOverview(sections);
      if (overview) {
        parts.push(overview);
        sources.push("catalog:overview");
      }
    }

    const hits = searchServices(search, query, limit);
    if (hits.length) {
      parts.push(
        `Matching services from the live Ken Beauty Salon catalog (prices are exact — quote priceLabel verbatim):\n${hits.map(formatItem).join("\n")}`
      );
      sources.push(...hits.map((h) => `catalog:${h.item.id}`));
    }

    return { context: parts.join("\n\n"), sources, available: true };
  } catch (error) {
    // Catalog unavailable — the assistant must say it can't confirm prices.
    console.error("assistant catalog unavailable:", error);
    return { context: "", sources: [], available: false };
  }
}
