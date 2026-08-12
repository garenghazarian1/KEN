/** Client-only assistant copy kept separate from the server knowledge base. */

import { getActiveCampaign, tCampaign } from "@/lib/business/campaigns";

export const ASSISTANT_WELCOME = {
  title: "Ani",
  greeting:
    "Hi, I'm Ani from Ken Beauty Salon! I can help with services, prices, complimentary drinks, our story, and locations.",
  namePrompt: "Your name (optional)",
  nameLabel: "Your name (optional)",
  nameSaveLabel: "Save",
  nameDismissLabel: "Dismiss name prompt",
  disclaimer:
    "Ani is an AI assistant; spoken replies use an AI-generated voice. For bookings, payments, and account issues our team helps you directly on WhatsApp or by phone.",
};

const BASE_QUICK_CHIPS = [
  "What services do you offer?",
  "What drinks do you have?",
  "Where are you located?",
  "How do I book?",
];

const BASE_LAUNCHER_TIPS = [
  "Ask me anything — we're here to serve you.",
  "Glow with us — explore treatments tailored to you.",
  "Prices, locations, booking tips — tap Ani now.",
];

/**
 * Quick chips for the panel. When a campaign is active, lead with an offer chip.
 * @param {Date} [now]
 * @returns {string[]}
 */
export function getAssistantQuickChips(now = new Date()) {
  const campaign = getActiveCampaign(now);
  if (!campaign) return BASE_QUICK_CHIPS;

  const offerChip =
    tCampaign(campaign.theme, "en") || "What August offers do you have?";
  return [`Tell me about ${offerChip}`, ...BASE_QUICK_CHIPS];
}

/**
 * Launcher tip rotation. When a campaign is active, include a promo tip first.
 * @param {Date} [now]
 * @returns {string[]}
 */
export function getAssistantLauncherTips(now = new Date()) {
  const campaign = getActiveCampaign(now);
  if (!campaign) return BASE_LAUNCHER_TIPS;

  const cta = tCampaign(campaign.primaryCta, "en");
  return [
    cta
      ? `${cta} — ask Ani about our August packages.`
      : "August offers are live — ask Ani about our packages.",
    ...BASE_LAUNCHER_TIPS,
  ];
}

/** @deprecated Prefer getAssistantQuickChips() so campaign chips stay in sync. */
export const ASSISTANT_QUICK_CHIPS = BASE_QUICK_CHIPS;

/** @deprecated Prefer getAssistantLauncherTips() so campaign tips stay in sync. */
export const ASSISTANT_LAUNCHER_TIPS = BASE_LAUNCHER_TIPS;

export const ASSISTANT_LAUNCHER_TIP_MS = 4200;
