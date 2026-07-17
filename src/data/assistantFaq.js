/**
 * Assistant knowledge base — curated FAQ + hard escalation templates.
 *
 * Accuracy rules:
 * - Prices and services always come from the live catalog, never from here.
 * - Zenoti (booking accounts, payments, cancellations) is a third-party system
 *   we do NOT control: those intents are never answered by the model — they get
 *   a fixed escalation template pointing to WhatsApp / phone.
 */

import {
  BOOKING_URL,
  CARD_URL,
  CAREERS_URL,
  CONTACT,
  WHATSAPP_CONTACTS,
  APP_STORES,
} from "@/config/constants";
import { getGoogleMapsUrl, stores } from "@/data/stores";

/** Action button types the widget understands. */
export const ACTION_TYPES = {
  BOOK: "book",
  WHATSAPP: "whatsapp",
  CALL: "call",
  LINK: "link",
};

/** Reusable CTA builders (single source of truth for assistant actions). */
export function buildWhatsAppActions(message = null) {
  return WHATSAPP_CONTACTS.map((contact) => ({
    type: ACTION_TYPES.WHATSAPP,
    label: `WhatsApp — ${contact.label}`,
    url: `https://wa.me/${contact.number}?text=${encodeURIComponent(
      message || contact.message
    )}`,
  }));
}

export function buildCallActions() {
  return stores.map((store) => ({
    type: ACTION_TYPES.CALL,
    label: `Call — ${store.name.includes("Rixos") ? "Rixos Marina" : "The Galleria"}`,
    url: `tel:${store.mobile.replace(/[^\d+]/g, "")}`,
  }));
}

export function buildDirectionsActions(selectedStores = stores) {
  return selectedStores.map((store) => ({
    type: ACTION_TYPES.LINK,
    label: `Directions — ${
      store.name.includes("Rixos") ? "Rixos Marina" : "The Galleria"
    }`,
    url: getGoogleMapsUrl(store),
  }));
}

export const BOOK_NOW_ACTION = {
  type: ACTION_TYPES.BOOK,
  label: "Book Now (online)",
  url: BOOKING_URL,
};

/**
 * Hard escalation intents. If a user message matches, the model is NOT called:
 * the fixed reply + CTAs are returned and the conversation is marked handed_off.
 * Patterns are case-insensitive regex sources.
 */
export const ESCALATION_INTENTS = [
  {
    reason: "payment",
    patterns: [
      "pay(ment|ing|é)?",
      "refund",
      "charge(d|s)?",
      "card (was )?(declin|reject|fail)",
      "declin(e|ed)",
      "double.?(charge|payment)",
      "billing",
      "invoice",
      "money (back|taken)",
      "transaction",
      "مشكلة.{0,15}(دفع|بطاق)",
      "استرداد",
      "تم خصم.{0,15}(مرتين|مبلغ)",
      "البطاقة.{0,15}(مرفوض|رفضت|لا تعمل)",
      "فاتورة",
    ],
    reply:
      "Payments and billing run through our booking system (Zenoti), which we can't access from this chat. Please contact the salon directly — the team will sort it out with you personally. Send your name and a short description of what happened (a screenshot helps).",
    replyAr:
      "تتم إدارة المدفوعات والفواتير عبر نظام الحجز (Zenoti)، ولا يمكننا الوصول إليه من هذه المحادثة. يرجى التواصل مباشرة مع الصالون عبر واتساب أو الهاتف وإرسال اسمك ووصف مختصر للمشكلة، وستساعدك الإدارة.",
  },
  {
    reason: "booking_account",
    patterns: [
      "(register|sign ?up|create).{0,20}account",
      "(log ?in|login|sign ?in)",
      "password",
      "zenoti.{0,20}(account|profile|app)",
      "account.{0,20}(problem|issue|locked|blocked)",
      "verify.{0,20}(email|phone|account)",
      "otp",
      "تسجيل.{0,10}(دخول|حساب)",
      "كلمة.{0,5}المرور",
      "رمز.{0,10}(التحقق|التأكيد)",
      "مشكلة.{0,15}الحساب",
    ],
    reply:
      "Booking accounts are managed by our booking system (Zenoti), which we can't access from this chat. You can book online as a guest via Book Now, or message the salon on WhatsApp and the team will help you directly.",
    replyAr:
      "تتم إدارة حسابات الحجز عبر نظام Zenoti، ولا يمكننا الوصول إليها من هذه المحادثة. يمكنك الحجز كزائر عبر رابط الحجز، أو التواصل مع الصالون عبر واتساب للحصول على المساعدة.",
  },
  {
    reason: "cancel_reschedule",
    patterns: [
      "cancel(l?ation|l?ing|l?ed)?",
      "re.?schedul(e|ing|ed)",
      "change.{0,25}(appointment|booking|time|date)",
      "move.{0,20}(appointment|booking)",
      "no.?show",
      "late.{0,15}(fee|policy|arriv)",
      "deposit",
      "(إلغاء|الغاء).{0,15}(موعد|حجز)?",
      "(تغيير|تأجيل|تعديل).{0,15}(الموعد|الحجز)",
      "عدم.{0,10}الحضور",
      "عربون",
    ],
    reply:
      "Changes and cancellations are handled directly by the salon team through the booking system. Please message us on WhatsApp or call the branch with your name and appointment time, and they'll take care of it right away.",
    replyAr:
      "يتولى فريق الصالون مباشرةً تعديل المواعيد وإلغاءها عبر نظام الحجز. يرجى التواصل مع الفرع عبر واتساب أو الهاتف وإرسال اسمك ووقت الموعد، وسيتولى الفريق مساعدتك.",
  },
  {
    reason: "book_for_me",
    patterns: [
      "book (me|an|a |it|now for)",
      "make.{0,15}(appointment|booking|reservation)",
      "reserve.{0,15}(slot|time|appointment)",
      "appointment (for|on|at|tomorrow|today)",
      "availab(le|ility).{0,25}(slot|time|today|tomorrow|week)",
      "(احجز|حجز).{0,10}(لي|موعد)",
      "(أريد|اريد).{0,10}(حجز|موعد)",
      "موعد.{0,10}(اليوم|غدا|غداً)",
    ],
    reply:
      "I can't complete bookings inside this chat, but it only takes a minute: use Book Now to pick your branch, service, and time online — or message the branch on WhatsApp with your preferred day and time and they'll confirm it for you.",
    replyAr:
      "لا يمكنني إتمام الحجز داخل المحادثة، لكن يمكنك استخدام رابط الحجز لاختيار الفرع والخدمة والوقت، أو إرسال اليوم والوقت المفضلين إلى الفرع عبر واتساب وسيؤكد الفريق الحجز معك.",
  },
];

/**
 * Curated FAQ. `questions` are matching hints (lowercase keywords), `answer`
 * is approved copy the model may use verbatim as grounded context.
 */
export const ASSISTANT_FAQ = [
  {
    id: "locations",
    questions: ["where", "location", "address", "find you", "map", "branch", "galleria", "rixos", "abu dhabi"],
    answer: `Ken Beauty Salon has two branches in Abu Dhabi:
1) ${stores[0].name} — ${stores[0].street}, ${stores[0].city}. Directions: ${getGoogleMapsUrl(stores[0])}. Phone ${stores[0].phone}, WhatsApp ${stores[0].whatsapp}.
2) ${stores[1].name} — ${stores[1].street}, ${stores[1].city}. Directions: ${getGoogleMapsUrl(stores[1])}. Phone ${stores[1].phone}, WhatsApp ${stores[1].whatsapp}.`,
    actions: [],
  },
  {
    id: "contact",
    questions: ["contact", "phone", "call", "email", "whatsapp", "number", "reach"],
    answer: `You can reach Ken Beauty Salon by phone (${CONTACT.primaryPhone}), mobile/WhatsApp (${CONTACT.primaryMobile} for The Galleria, +971 55 557 0029 for Rixos Marina), or email (${CONTACT.email}). The contact page is at https://www.kenbeautysalon.com/contact.`,
    actions: [],
  },
  {
    id: "how_to_book",
    questions: ["how", "book", "booking", "appointment", "online", "reserve"],
    answer: `Bookings are made through our online booking page (Zenoti) at ${BOOKING_URL}: choose your branch, pick a service and time, and confirm. You can also book by WhatsApp — message the branch with the service and your preferred time. Bookings cannot be completed inside this chat.`,
    actions: [],
  },
  {
    id: "ken_card",
    questions: ["ken card", "loyalty", "rewards", "membership", "subscription", "points"],
    answer: `The Ken Card is our subscription / rewards program. Details and sign-up are at ${CARD_URL}. For questions about your card balance or benefits, please contact the salon directly.`,
    actions: [],
  },
  {
    id: "mobile_app",
    questions: ["app", "download", "android", "iphone", "ios", "play store", "app store"],
    answer: `The Ken Beauty Salon app is available on Google Play (${APP_STORES.googlePlay}) and the Apple App Store (${APP_STORES.appleAppStore}).`,
    actions: [],
  },
  {
    id: "careers",
    questions: ["job", "career", "work", "hiring", "vacancy", "apply", "position"],
    answer: `Open roles at Ken Beauty Salon are listed on our careers page: ${CAREERS_URL}. You can apply directly there.`,
    actions: [],
  },
  {
    id: "services_overview",
    questions: ["service", "offer", "treatment", "hair", "nail", "facial", "barber", "solarium", "what do you do"],
    answer:
      "Service names, prices, and durations come only from the live catalog on our Services page (admin API). Tell the guest you can look up any specific service and its current priceLabel from that catalog — do not invent a service list from memory.",
    actions: [],
  },
  {
    id: "opening_hours",
    questions: ["hour", "open", "close", "time", "when", "working"],
    answer:
      "Opening hours can vary by branch and season, so please confirm with the branch directly on WhatsApp or by phone before your visit.",
    actions: [],
  },
];

