"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { WHATSAPP_CONTACTS } from "@/config/constants";
import { buildWhatsAppUrl } from "@/lib/adsAttribution";
import { branchFromDigits } from "@/lib/leads/leadRecord";
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

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function BookingDock() {
  const services = useBookingServices();
  const navHidden = useHideNavOnScroll();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const barRef = useRef(null);
  const returnFocusRef = useRef(null);
  const wasOpen = useRef(false);
  const activeOpen = open && services.length > 0;
  const countLabel = `${services.length} ${services.length === 1 ? "service" : "services"}`;

  useEffect(() => {
    const onOpen = () => {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
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

  const hrefByNumber = useMemo(
    () =>
      Object.fromEntries(
        WHATSAPP_CONTACTS.map((contact) => [
          contact.number,
          buildWhatsAppUrl({
            number: contact.number,
            message: bookingMessage(contact.shortLabel, services),
          }),
        ]),
      ),
    [services],
  );

  useEffect(() => {
    if (!activeOpen) return undefined;
    const panel = panelRef.current;
    if (!panel) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.focus();

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = [...panel.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
        (element) =>
          element instanceof HTMLElement &&
          !element.hidden &&
          element.getAttribute("aria-hidden") !== "true",
      );
      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;
      if (
        event.shiftKey &&
        (current === panel || current === first || !panel.contains(current))
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [activeOpen]);

  useEffect(() => {
    if (activeOpen) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    if (target?.isConnected) target.focus();
    else barRef.current?.focus();
  }, [activeOpen]);

  const closeSheet = () => setOpen(false);

  const openFromBar = () => {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setOpen(true);
  };

  const currentWhatsAppUrl = (contact) =>
    buildWhatsAppUrl({
      number: contact.number,
      message: bookingMessage(contact.shortLabel, services),
    });

  return (
    <>
      <div
        ref={panelRef}
        className={styles.bookingSheet}
        data-open={activeOpen ? "true" : "false"}
        role={activeOpen ? "dialog" : undefined}
        aria-modal={activeOpen ? "true" : undefined}
        aria-hidden={activeOpen ? undefined : true}
        aria-labelledby="booking-sheet-title"
        aria-describedby="booking-sheet-lead"
        inert={activeOpen ? undefined : ""}
        tabIndex={-1}
      >
        <div className={styles.bookingSheetPanel}>
          <div className={styles.bookingHead}>
            <h2 id="booking-sheet-title" className={styles.bookingTitle}>
              Your booking
            </h2>
            <button
              type="button"
              className={styles.closeSheet}
              aria-label="Close"
              onClick={closeSheet}
            >
              <X size={18} aria-hidden />
            </button>
          </div>
          <p id="booking-sheet-lead" className={styles.bookingLead}>
            We send these names on WhatsApp. The salon replies with the time.
          </p>
          <ul className={styles.bookList} aria-label="Chosen services">
            {services.map((service) => (
              <li key={service.id} className={styles.bookItem}>
                <FitName className={styles.bookItemName}>
                  {service.name}
                </FitName>
                <button
                  type="button"
                  className={styles.bookRemove}
                  aria-label={`Remove ${service.name} from booking`}
                  onClick={() => toggleBookingService(service)}
                >
                  <X size={16} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={styles.continueAdding}
            onClick={closeSheet}
          >
            Continue adding
          </button>
          <div className={styles.bookBranches}>
            {WHATSAPP_CONTACTS.map((contact) => {
              const href = hrefByNumber[contact.number];
              return (
                <a
                  key={contact.number}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.bookBranch}
                  aria-label={`Book at ${contact.shortLabel} on WhatsApp`}
                  onClick={(event) => {
                    const nextHref = currentWhatsAppUrl(contact);
                    recordOutbound(nextHref, {
                      branch: branchFromDigits(contact.number),
                      gtm: true,
                      gtmBranch: contact.shortLabel,
                      services: services.map((service) => ({
                        id: service.id,
                        name: service.name,
                      })),
                    });
                    if (nextHref !== href) {
                      event.preventDefault();
                      window.open(nextHref, "_blank", "noopener,noreferrer");
                    }
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
          ref={barRef}
          type="button"
          className={styles.bookingBar}
          data-nav-hidden={navHidden ? "true" : "false"}
          onClick={openFromBar}
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
