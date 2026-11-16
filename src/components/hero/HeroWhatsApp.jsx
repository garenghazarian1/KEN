"use client";

import { useEffect, useRef, useState } from "react";
import {
  floatingWhatsAppBaseHref,
  floatingWhatsAppHref,
  trackFloatingWhatsApp,
} from "@/components/DraggableWhatsAppButton/floatingWhatsApp";
import styles from "./Hero.modern.module.css";

export default function HeroWhatsApp({ className }) {
  const [href, setHref] = useState(floatingWhatsAppBaseHref);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  useEffect(() => {
    setHref(floatingWhatsAppHref());
  }, []);

  useEffect(() => {
    const reset = () => {
      busyRef.current = false;
      setBusy(false);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  function onClick(event) {
    setBusy(true);
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    requestAnimationFrame(() =>
      setTimeout(() => {
        const nextHref = floatingWhatsAppHref();
        trackFloatingWhatsApp(nextHref, "hero");
        setHref(nextHref);
        window.open(nextHref, "_blank", "noopener,noreferrer");
        window.setTimeout(() => {
          if (document.visibilityState === "visible") {
            busyRef.current = false;
            setBusy(false);
          }
        }, 4000);
      }, 0)
    );
  }

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-busy={busy || undefined}
      aria-label={busy ? "Opening…" : "WhatsApp"}
      onClick={onClick}
    >
      <span className={busy ? styles.slotHidden : styles.slot}>
        <svg
          className={styles.whatsappIcon}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.22-8.23 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.29z"
          />
        </svg>
        WhatsApp
      </span>
      <span className={busy ? styles.slot : styles.slotHidden}>
        <span className={styles.opening}>
          <span className={styles.spinner} aria-hidden="true" />
          Opening…
        </span>
      </span>
    </a>
  );
}
