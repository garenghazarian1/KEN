/**
 * Hard intent gate for the assistant.
 *
 * Zenoti-controlled topics (payments, booking accounts, cancellations,
 * "book me for...") must never reach the LLM answer path. This gate matches
 * them with regex and returns the fixed escalation template instead.
 */

import {
  ESCALATION_INTENTS,
  ASSISTANT_FAQ,
  buildWhatsAppActions,
  buildCallActions,
  buildDirectionsActions,
  BOOK_NOW_ACTION,
} from "@/data/assistantFaq";
import { stores } from "@/data/stores";

const COMPILED_INTENTS = ESCALATION_INTENTS.map((intent) => ({
  ...intent,
  regexes: intent.patterns.map((p) => new RegExp(p, "i")),
}));

function matchesFaqKeyword(text, keyword) {
  if (!keyword) return false;
  // Prevent short Latin hints such as "app" from matching "appointment".
  if (/^[a-z0-9_-]+$/i.test(keyword)) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(text);
  }
  return text.includes(keyword);
}

/** Reason-specific prefilled WhatsApp messages so the team gets context. */
const WHATSAPP_MESSAGES = {
  payment:
    "Hello KEN Beauty Center, I need help with a payment/billing issue (from the website chat).",
  booking_account:
    "Hello KEN Beauty Center, I need help with my booking account (from the website chat).",
  cancel_reschedule:
    "Hello KEN Beauty Center, I need to change or cancel an appointment (from the website chat).",
  book_for_me:
    "Hello KEN Beauty Center, I would like to book a service (from the website chat).",
};

/**
 * Detect a hard-escalation intent in a user message.
 * @param {string} text
 * @returns {{ reason: string, reply: string, actions: Array }|null}
 */
export function detectEscalation(text) {
  if (!text) return null;
  const normalized = text.toLowerCase();
  const isArabic = /[\u0600-\u06ff]/.test(normalized);

  for (const intent of COMPILED_INTENTS) {
    if (intent.regexes.some((re) => re.test(normalized))) {
      const actions = [
        ...buildWhatsAppActions(WHATSAPP_MESSAGES[intent.reason]),
        ...buildCallActions(),
      ];
      // Booking-related intents also get the Book Now link.
      if (intent.reason === "book_for_me" || intent.reason === "booking_account") {
        actions.unshift(BOOK_NOW_ACTION);
      }
      return {
        reason: intent.reason,
        reply: isArabic && intent.replyAr ? intent.replyAr : intent.reply,
        actions,
      };
    }
  }
  return null;
}

/**
 * Resolve address/directions requests deterministically from the same store
 * data used by the Contact page. This prevents the model from paraphrasing
 * away an exact street address or substituting booking/contact information.
 * Pass the recent user-turn query so short follow-ups such as "Galleria" keep
 * the original address intent.
 */
export function resolveLocationRequest(text) {
  if (!text) return null;
  const normalized = text.toLowerCase();
  const asksForLocation =
    /\b(where|address|adress|location|located|directions?|map|find)\b/i.test(
      normalized
    ) ||
    /(العنوان|عنوان|الموقع|موقع|الاتجاهات|اتجاهات|الخريطة|خريطة|وين)/.test(
      normalized
    );
  if (!asksForLocation) return null;

  const wantsGalleria =
    /\b(galleria|galeria)\b/i.test(normalized) ||
    /(غاليريا|الجاليريا|المارية)/.test(normalized);
  const wantsRixos =
    /\brixos\b/i.test(normalized) || /(ريكسوس|الريكسوس)/.test(normalized);
  const selectedStores =
    wantsGalleria && !wantsRixos
      ? [stores[0]]
      : wantsRixos && !wantsGalleria
        ? [stores[1]]
        : stores;
  const isArabic = /[\u0600-\u06ff]/.test(normalized);

  const lines = selectedStores.map((store) => {
    const shortName = store.name.includes("Rixos")
      ? "Rixos Marina"
      : "The Galleria";
    return `${shortName}: ${store.street}, ${store.city}, ${store.country}.`;
  });

  return {
    reason: "location",
    reply: isArabic
      ? `عناوين فروع كين:\n${lines.join(
          "\n"
        )}\nاستخدم زر الاتجاهات أدناه لفتح خرائط Google.`
      : `${
          selectedStores.length === 1
            ? "Here is the exact branch address:"
            : "Here are the exact branch addresses:"
        }\n${lines.join("\n")}\nUse the directions button below to open Google Maps.`,
    actions: buildDirectionsActions(selectedStores),
  };
}

/**
 * Simple keyword scoring over the curated FAQ to pick grounding entries.
 * @param {string} text
 * @param {number} [limit=3]
 * @returns {Array<{ id: string, answer: string }>}
 */
export function matchFaqEntries(text, limit = 3) {
  if (!text) return [];
  const normalized = text.toLowerCase();

  return ASSISTANT_FAQ.map((entry) => {
    const score = entry.questions.reduce(
      (acc, keyword) =>
        matchesFaqKeyword(normalized, keyword) ? acc + 1 : acc,
      0
    );
    return { entry, score };
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => ({ id: entry.id, answer: entry.answer }));
}
