/**
 * Catalog grounding for the assistant with a server-side cache.
 *
 * The services page intentionally fetches `no-store`; the chat route must not
 * hit the admin API on every message, so the built catalog + MiniSearch index
 * are cached in module scope for CATALOG_TTL_MS.
 *
 * The admin public API catalog is the ONLY source of truth for services/prices.
 * Guest phrasing is expanded via synonyms + optional LLM keywords before search
 * (`catalogQueryExpand.js`) so "barber cut" can still hit "Men's Haircut".
 */

import {
  getServiceCatalog,
  buildServiceSections,
} from "@/lib/business/serviceCatalog";
import {
  buildServiceSearchCatalog,
  searchServices,
} from "@/lib/business/serviceSearch";
import { isCampaignQuery } from "@/lib/assistant/campaignContext";
import { expandCatalogQueryForSearch } from "@/lib/assistant/catalogQueryExpand";

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
 * Merge MiniSearch results from the raw guest query and the expanded keywords.
 * Higher score wins when the same service appears twice.
 * @param {Array} a
 * @param {Array} b
 * @param {number} limit
 */
function mergeHits(a, b, limit) {
  const byId = new Map();
  for (const hit of [...a, ...b]) {
    const id = hit.item?.id;
    if (!id) continue;
    const prev = byId.get(id);
    if (!prev || (hit.score ?? 0) > (prev.score ?? 0)) {
      byId.set(id, hit);
    }
  }
  return [...byId.values()]
    .sort((x, y) => (y.score ?? 0) - (x.score ?? 0))
    .slice(0, limit);
}

/**
 * Search the catalog and return a compact plain-text context block.
 * Returns { context: string, sources: string[], available: boolean }.
 * @param {string} query
 * @param {number} [limit=8]
 * @param {{ skipLlm?: boolean }} [options]
 */
export async function buildCatalogContext(query, limit = 8, options = {}) {
  try {
    const locale = /[\u0600-\u06ff]/.test(query || "") ? "ar" : "en";
    const { search, sections } = await getCachedCatalog(locale);
    const parts = [];
    const sources = [];

    if (
      OVERVIEW_RE.test(query || "") &&
      !DRINKS_QUERY_RE.test(query || "") &&
      !isCampaignQuery(query || "")
    ) {
      const overview = formatCategoryOverview(sections);
      if (overview) {
        parts.push(overview);
        sources.push("catalog:overview");
      }
    }

    const expanded = await expandCatalogQueryForSearch(query || "", {
      skipLlm: options.skipLlm === true,
    });
    const directHits = searchServices(search, query || "", limit);
    const expandedHits =
      expanded.searchQuery && expanded.searchQuery !== (query || "").trim()
        ? searchServices(search, expanded.searchQuery, limit)
        : [];
    const hits = mergeHits(directHits, expandedHits, limit);

    if (hits.length) {
      parts.push(
        `Matching services from the live Ken Beauty Salon catalog (prices are exact — quote priceLabel verbatim):\n${hits.map(formatItem).join("\n")}`
      );
      sources.push(...hits.map((h) => `catalog:${h.item.id}`));
      if (expanded.usedLlm || expanded.matchedRuleIds.length) {
        sources.push("catalog:query_expand");
      }
    }

    return { context: parts.join("\n\n"), sources, available: true };
  } catch (error) {
    // Catalog unavailable — the assistant must say it can't confirm prices.
    console.error("assistant catalog unavailable:", error);
    return { context: "", sources: [], available: false };
  }
}
