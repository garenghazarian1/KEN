/**
 * Catalog query understanding: map guest phrasing → search terms.
 *
 * Guests say "barber cut", "guy haircut", "قص شعر رجالي". The live catalog may
 * list "Men's Haircut" under Barber. This module expands the guest question into
 * catalog-friendly keywords. Prices still come only from MiniSearch hits — never
 * from the rewriter.
 *
 * Two layers:
 * 1) Deterministic synonym rules (fast, offline, EN+AR) — general salon intents
 * 2) Optional gpt-4.1-mini keyword rewrite when OPENAI_API_KEY is set
 */

import OpenAI from "openai";

const REWRITE_MODEL = "gpt-4.1-mini";

/**
 * General salon intents — not a hard-coded service list.
 * Each rule adds catalog-oriented keywords when the guest phrasing matches.
 */
export const CATALOG_SYNONYM_RULES = [
  {
    id: "mens_barber_cut",
    match:
      /\b(barber|men'?s?|mens|gentleman|guy|male|him|his)\b.{0,40}\b(cut|haircut|hair\s*cut|trim)\b|\b(cut|haircut|hair\s*cut|trim)\b.{0,40}\b(barber|men'?s?|mens|gentleman|guy|male)\b|\bbarber\s*cut\b/i,
    terms: ["barber", "men", "men's", "haircut", "cut", "trim", "gentleman"],
  },
  {
    id: "mens_barber_ar",
    match: /(حلاق|رجالي|للرجال|قص شعر|شعر رجال)/,
    terms: ["barber", "men", "haircut", "حلاق", "رجالي", "قص"],
  },
  {
    id: "womens_haircut",
    match:
      /\b(women'?s?|womens|lady|ladies|female|her|girl)\b.{0,40}\b(cut|haircut|trim|style)\b|\b(cut|haircut)\b.{0,40}\b(women'?s?|lady|ladies)\b/i,
    terms: ["women", "ladies", "haircut", "cut", "trim", "hair"],
  },
  {
    id: "blowdry",
    match: /\b(blow\s*-?\s*dry|blowout|blow\s*out|wash\s*and\s*blow|سيشوار|سيشوار)\b/i,
    terms: ["blow", "dry", "blowout", "wash", "سيشوار"],
  },
  {
    id: "color",
    match:
      /\b(hair\s*colou?r|dye|highlights?|balayage|ombre|toner|lived.?in|صبغ|لون شعر|هايلايت)\b/i,
    terms: ["color", "colour", "highlights", "balayage", "toner", "dye", "صبغ"],
  },
  {
    id: "nails",
    match:
      /\b(manicure|pedicure|nails?|gel|acrylic|hard\s*gel|polish|اظافر|أظافر|مانيكير|بديكير)\b/i,
    terms: ["nails", "manicure", "pedicure", "gel", "polish", "أظافر"],
  },
  {
    id: "facial",
    match: /\b(facial|face\s*clean|deep\s*cleans|skin\s*care|بشرة|تنظيف بشرة|فيشل)\b/i,
    terms: ["facial", "cleansing", "skin", "بشرة", "تنظيف"],
  },
  {
    id: "lashes_brows",
    match:
      /\b(lash(es)?|brow|eyebrow|lamination|lift|رموش|حواجب|ليفت)\b/i,
    terms: ["lash", "brow", "eyebrow", "lamination", "lift", "رموش", "حواجب"],
  },
  {
    id: "solarium",
    match: /\b(solarium|tan|tanning|sunbed|سولاريوم|تان)\b/i,
    terms: ["solarium", "tan", "tanning", "سولاريوم"],
  },
  {
    id: "price_intent",
    match:
      /\b(how\s+much|price|cost|charge|fee|كم سعر|بكم|سعر|ثمن)\b/i,
    terms: [],
  },
];

/**
 * Deterministic keyword expansion from guest phrasing.
 * @param {string} query
 * @returns {{ terms: string[], matchedRuleIds: string[] }}
 */
export function expandWithSynonyms(query) {
  const text = query || "";
  const terms = new Set();
  const matchedRuleIds = [];

  for (const rule of CATALOG_SYNONYM_RULES) {
    if (!rule.match.test(text)) continue;
    matchedRuleIds.push(rule.id);
    for (const term of rule.terms) terms.add(term);
  }

  return { terms: [...terms], matchedRuleIds };
}

/**
 * Ask the chat model for catalog search keywords only (no prices).
 * @param {string} query
 * @param {{ openai?: import("openai").default, model?: string }} [options]
 * @returns {Promise<string[]>}
 */
export async function rewriteCatalogQueryWithLlm(query, options = {}) {
  const trimmed = (query || "").trim();
  if (!trimmed) return [];

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey && !options.openai) return [];

  const openai = options.openai || new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: options.model || REWRITE_MODEL,
    temperature: 0,
    max_tokens: 80,
    messages: [
      {
        role: "system",
        content: `You help search a beauty salon service catalog.
Given a guest question (English or Arabic), return ONLY a JSON array of 3 to 8 short search keywords that would match service or category names in a salon catalog.
Include gender/category hints when relevant (e.g. men, barber, haircut, women, nails, facial).
Never invent prices, durations, or service names as facts — keywords for search only.
No markdown, no explanation — JSON array of strings only.`,
      },
      { role: "user", content: trimmed },
    ],
  });

  const raw = completion.choices?.[0]?.message?.content?.trim() || "";
  return parseKeywordArray(raw);
}

/**
 * @param {string} raw
 * @returns {string[]}
 */
export function parseKeywordArray(raw) {
  if (!raw) return [];
  try {
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");
    const slice =
      start >= 0 && end > start ? raw.slice(start, end + 1) : raw;
    const parsed = JSON.parse(slice);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => String(item || "").trim())
      .filter((item) => item.length > 0 && item.length < 40)
      .slice(0, 10);
  } catch {
    return raw
      .split(/[\n,]+/)
      .map((part) => part.replace(/^[\s*"-]+|[\s*"-]+$/g, "").trim())
      .filter((part) => part.length > 1 && part.length < 40)
      .slice(0, 10);
  }
}

/**
 * Build the search string used for MiniSearch.
 * Always applies synonyms; optionally adds LLM keywords.
 * @param {string} query
 * @param {{ openai?: import("openai").default, skipLlm?: boolean }} [options]
 * @returns {Promise<{ searchQuery: string, terms: string[], matchedRuleIds: string[], usedLlm: boolean }>}
 */
export async function expandCatalogQueryForSearch(query, options = {}) {
  const original = (query || "").trim();
  const { terms: synonymTerms, matchedRuleIds } = expandWithSynonyms(original);
  const terms = new Set();

  // Keep distinctive words from the original question (drop filler).
  for (const token of original.split(/\s+/)) {
    const clean = token.replace(/[^\p{L}\p{N}%'-]+/gu, "");
    if (clean.length < 2) continue;
    if (
      /^(how|much|is|the|a|an|for|do|you|have|what|please|can|i|my|me|about|كم|سعر|بكم|ما|هو|هي)$/i.test(
        clean
      )
    ) {
      continue;
    }
    terms.add(clean);
  }
  for (const term of synonymTerms) terms.add(term);

  let usedLlm = false;
  if (!options.skipLlm) {
    try {
      const llmTerms = await rewriteCatalogQueryWithLlm(original, options);
      if (llmTerms.length) {
        usedLlm = true;
        for (const term of llmTerms) terms.add(term);
      }
    } catch (error) {
      console.error("assistant catalog query rewrite failed:", error);
    }
  }

  const list = [...terms];
  return {
    searchQuery: list.length ? list.join(" ") : original,
    terms: list,
    matchedRuleIds,
    usedLlm,
  };
}
