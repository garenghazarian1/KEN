import { CAMPAIGNS, CAMPAIGN_TIMEZONE } from "@/data/campaigns";

/**
 * YYYY-MM-DD in the campaign timezone (defaults to Asia/Dubai).
 * @param {Date} [date]
 * @param {string} [timeZone]
 * @returns {string}
 */
export function getZonedDateKey(date = new Date(), timeZone = CAMPAIGN_TIMEZONE) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * @param {{ startsOn: string, endsOn: string, timezone?: string }} campaign
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isCampaignActive(campaign, now = new Date()) {
  if (!campaign?.startsOn || !campaign?.endsOn) return false;
  const key = getZonedDateKey(now, campaign.timezone || CAMPAIGN_TIMEZONE);
  return key >= campaign.startsOn && key <= campaign.endsOn;
}

/**
 * @param {Date} [now]
 * @returns {typeof CAMPAIGNS[number] | null}
 */
export function getActiveCampaign(now = new Date()) {
  return CAMPAIGNS.find((campaign) => isCampaignActive(campaign, now)) || null;
}

/**
 * @param {{ en: string, ar?: string } | string | null | undefined} value
 * @param {string} [locale]
 * @returns {string}
 */
export function tCampaign(value, locale = "en") {
  if (value == null) return "";
  if (typeof value === "string") return value;
  const lang = locale?.startsWith("ar") ? "ar" : "en";
  return value[lang] || value.en || "";
}

/**
 * @param {number} amount
 * @param {string} [currency]
 * @param {string} [locale]
 * @returns {string}
 */
export function formatCampaignPrice(amount, currency = "AED", locale = "en") {
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} ${currency}`;
}
