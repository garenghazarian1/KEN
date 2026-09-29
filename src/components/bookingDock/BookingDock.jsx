"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { WHATSAPP_CONTACTS } from "@/config/constants";
import { buildWhatsAppUrl, trackWhatsAppClick } from "@/lib/adsAttribution";
import { recordOutbound } from "@/lib/leads/trackLead";
import { useHideNavOnScroll } from "@/components/mobileNav/useHideNavOnScroll";
import FitName from "@/components/fitName/FitName";
import { bookingMessage } from "@/components/serviceMenu/BookingGuide";
import {
  BOOKING_OPEN_EVENT,
  useBookingServices,
  toggleBookingService,
} from "./bookingList";
import styles from "./BookingDock.module.css";

function plainWhatsAppUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export default function BookingDock() {
  const services = useBookingServices();
  const navHidden = useHideNavOnScroll();
  const [open, setOpen] = useState(false);
  const [hrefByNumber, setHrefByNumber] = useState(null);
  const panelRef = useRef(null);
  const focusIdRef = useRef(null);
  const wasOpen = useRef(false);
  const serviceKey = services.map((service) => service.id).join("\n");
  const countLabel = `${services.length} ${services.length === 1 ? "service" : "services"}`;

  useEffect(() => {
    const onOpen = (event) => {
      focusIdRef.current = event.detail?.id ?? focusIdRef.current;
      setOpen(true);
    };
    window.addEventListener(BOOKING_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(BOOKING_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (services.length) return;
    setOpen(false);
  }, [services.length]);

  useEffect(() => {
    document.body.dataset.bookingBar =
      services.length > 0 && !open ? "true" : "false";
    return () => {
      delete document.body.dataset.bookingBar;
    };
  }, [open, services.length]);

  useEffect(() => {
    if (!services.length) {
      setHrefByNumber(null);
      return;
    }
    const next = {};
    for (const contact of WHATSAPP_CONTACTS) {
      next[contact.number] = buildWhatsAppUrl({
        number: contact.number,
        message: bookingMessage(contact.shortLabel, services),
      });
    }
    setHrefByNumber(next);
  }, [serviceKey, services]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    const id = focusIdRef.current;
    if (!id) return;
    const button = document.querySelector(
      `[data-book-service="${CSS.escape(String(id))}"]`,
    );
    if (button instanceof HTMLElement) button.focus();
  }, [open]);

  return (
    <>
      <div
        ref={panelRef}
        className={styles.bookingSheet}
        data-open={open && services.length > 0 ? "true" : "false"}
        role={open && services.length > 0 ? "dialog" : undefined}
        aria-modal={open && services.length > 0 ? "true" : undefined}
        aria-hidden={open && services.length > 0 ? undefined : true}
        aria-labelledby="booking-sheet-title"
        tabIndex={-1}
      >
        <div className={styles.bookingSheetPanel}>
          <h2 id="booking-sheet-title" className={styles.bookingTitle}>
            Your booking
          </h2>
          <p className={styles.bookingLead}>
            We send these names on WhatsApp. The salon replies with the time.
          </p>
          <ul className={styles.bookList} aria-label="Chosen services">
            {services.map((service) => (
              <li key={service.id} className={styles.bookItem}>
                <FitName className={styles.bookItemName} text={service.name}>
                  {service.name}
                </FitName>
                <button
                  type="button"
                  className={styles.bookRemove}
                  aria-label={`Remove ${service.name} from booking`}
                  onClick={() => {
                    focusIdRef.current = service.id;
                    toggleBookingService(service);
                  }}
                >
                  <X size={16} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={styles.continueAdding}
            onClick={() => setOpen(false)}
          >
            Continue adding
          </button>
          <div className={styles.bookBranches}>
            {WHATSAPP_CONTACTS.map((contact) => {
              const message = bookingMessage(contact.shortLabel, services);
              const href =
                hrefByNumber?.[contact.number] ??
                plainWhatsAppUrl(contact.number, message);
              return (
                <a
                  key={contact.number}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.bookBranch}
                  aria-label={`Book at ${contact.shortLabel} on WhatsApp`}
                  onClick={() => {
                    trackWhatsAppClick({
                      branch: contact.shortLabel,
                      number: contact.number,
                    });
                    recordOutbound(href, {
                      branch:
                        contact.shortLabel === "Rixos" ? "rixos" : "galleria",
                      services: services.map((service) => ({
                        id: service.id,
                        name: service.name,
                      })),
                    });
                  }}
                >
                  Book at {contact.shortLabel}
                </a>
              );
            })}
          </div>
        </div>
      </div>
      {services.length > 0 && !open ? (
        <button
          type="button"
          className={styles.bookingBar}
          data-nav-hidden={navHidden ? "true" : "false"}
          onClick={() => setOpen(true)}
        >
          <span className={styles.bookingBarIcon} aria-hidden>
            <ShoppingBag size={16} strokeWidth={1.5} />
          </span>
          <span className={styles.bookingBarLabel}>
            Your booking · {countLabel}
          </span>
        </button>
      ) : null}
    </>
  );
}
