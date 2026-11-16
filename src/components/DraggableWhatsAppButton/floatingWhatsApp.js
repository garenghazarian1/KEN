import { WHATSAPP_CONTACTS } from "@/config/constants";
import { buildWhatsAppUrl } from "@/lib/adsAttribution";
import { recordOutbound } from "@/lib/leads/trackLead";

/** Same branch, number, and prefilled text as the floating WhatsApp button. */
export const FLOATING_WHATSAPP = WHATSAPP_CONTACTS.find(
  (contact) => contact.shortLabel === "Rixos"
);

/** Href without client-only ad attribution, safe for server HTML. */
export function floatingWhatsAppBaseHref() {
  return `https://wa.me/${FLOATING_WHATSAPP.number}?text=${encodeURIComponent(
    FLOATING_WHATSAPP.message
  )}`;
}

export function floatingWhatsAppHref() {
  return buildWhatsAppUrl({
    number: FLOATING_WHATSAPP.number,
    message: FLOATING_WHATSAPP.message,
  });
}

export function trackFloatingWhatsApp(href, placement = "floating") {
  recordOutbound(href, {
    branch: "rixos",
    gtm: true,
    gtmBranch: "Rixos",
    placement,
  });
}
