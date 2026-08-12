/**
 * Campaign grounding for the assistant.
 *
 * Active promo packages in `src/data/campaigns.js` are the ONLY source of truth
 * for August (and future) campaign packages, Hot Tuesday, and promo prices.
 * Ordinary à-la-carte services/prices still come from the live admin catalog.
 */

import {
  formatCampaignPrice,
  getActiveCampaign,
  tCampaign,
} from "@/lib/business/campaigns";

/** English campaign keywords — word boundaries are safe in Latin script. */
const CAMPAIGN_QUERY_EN_RE =
  /\b(august|offers|promo|promotion|package|packages|discount|hot\s*tuesday|mermaid|glow\s*up|princess\s*hands|50\s*%|save\s+now|special\s+offer)\b/i;

/**
 * Arabic campaign keywords. Do NOT use `\b` — Arabic script has no word
 * boundaries that JS `\b` understands, so `\bباقة\b` never matches.
 */
const CAMPAIGN_QUERY_AR_RE =
  /(أغسطس|اغسطس|عرض|عروض|باقة|باقات|خصم|الثلاثاء|حورية|البحر|جلو|الأميرة|الاميرة)/;

/**
 * @param {string} [query]
 * @returns {boolean}
 */
export function isCampaignQuery(query) {
  const text = query || "";
  return CAMPAIGN_QUERY_EN_RE.test(text) || CAMPAIGN_QUERY_AR_RE.test(text);
}

/**
 * Compact bilingual grounding block for the system prompt.
 * @param {object|null|undefined} campaign
 * @returns {string}
 */
export function formatCampaignContext(campaign) {
  if (!campaign) return "";

  const themeEn = tCampaign(campaign.theme, "en");
  const themeAr = tCampaign(campaign.theme, "ar");
  const ctaEn = tCampaign(campaign.primaryCta, "en");
  const ctaAr = tCampaign(campaign.primaryCta, "ar");
  const path = campaign.path || "/offers";

  const packageLines = (campaign.packages || []).map((pkg) => {
    const nameEn = tCampaign(pkg.name, "en");
    const nameAr = tCampaign(pkg.name, "ar");
    const promo = formatCampaignPrice(pkg.promoPrice, pkg.currency, "en");
    const original = formatCampaignPrice(pkg.originalPrice, pkg.currency, "en");
    const inclusions = (pkg.inclusions || [])
      .map((item) => {
        const en = tCampaign(item, "en");
        const ar = tCampaign(item, "ar");
        return ar && ar !== en ? `${en} / ${ar}` : en;
      })
      .join("; ");
    return `- ${nameEn} / ${nameAr}: ${promo} (was ${original}). Includes: ${inclusions}`;
  });

  const weekly = campaign.weeklyOffer;
  const weeklyLine = weekly
    ? `Weekly offer: ${tCampaign(weekly.title, "en")} / ${tCampaign(
        weekly.title,
        "ar"
      )} — ${tCampaign(weekly.description, "en")} / ${tCampaign(
        weekly.description,
        "ar"
      )}. Constraint: ${tCampaign(weekly.constraint, "en")}. Duration: ${tCampaign(
        weekly.duration,
        "en"
      )}.`
    : "";

  return [
    `Active campaign (source of truth for promotional packages and promo prices only — quote these package prices exactly; do not invent other packages):`,
    `Theme: ${themeEn} / ${themeAr}`,
    `Primary CTA: ${ctaEn} / ${ctaAr}`,
    `Valid ${campaign.startsOn} → ${campaign.endsOn} (${campaign.timezone || "Asia/Dubai"}), both Abu Dhabi branches.`,
    `Details page: ${path}`,
    `Signature packages:`,
    ...packageLines,
    weeklyLine,
    `Hot Tuesday excludes the August Special Packages. For ordinary single services (not these packages), use the live service catalog prices. Direct guests to ${path} or WhatsApp to book a package.`,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Build campaign context when the guest asks about offers/packages.
 * Returns { context, sources, available } — same shape as catalog grounding.
 * @param {string} query
 * @param {Date} [now]
 */
export function buildCampaignContext(query, now = new Date()) {
  const campaign = getActiveCampaign(now);

  if (!campaign) {
    return { context: "", sources: [], available: false };
  }

  if (!isCampaignQuery(query)) {
    return { context: "", sources: [], available: true };
  }

  const context = formatCampaignContext(campaign);
  return {
    context,
    sources: [`campaign:${campaign.id}`],
    available: true,
  };
}
