"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./DraggableWhatsAppButton.module.css";
import {
  floatingWhatsAppBaseHref,
  floatingWhatsAppHref,
  trackFloatingWhatsApp,
} from "./floatingWhatsApp";

const STORAGE_KEY = "ken-whatsapp-position";
const DRAG_THRESHOLD = 8;

function readSavedPosition() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { x: 0, y: 0 };
    const parsed = JSON.parse(saved);
    if (
      typeof parsed?.x === "number" &&
      typeof parsed?.y === "number" &&
      Number.isFinite(parsed.x) &&
      Number.isFinite(parsed.y)
    ) {
      return { x: parsed.x, y: parsed.y };
    }
  } catch {
    // Ignore corrupt saved position
  }
  return { x: 0, y: 0 };
}

function persistPosition(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota errors
  }
}

/**
 * Pull a painted button fully back inside its constraints box.
 * Uses the real getBoundingClientRect (works with Framer transforms).
 */
function clampIntoConstraints(buttonEl, constraintsEl, pos) {
  if (!buttonEl || !constraintsEl) return pos;

  const box = constraintsEl.getBoundingClientRect();
  const rect = buttonEl.getBoundingClientRect();
  let { x, y } = pos;

  if (rect.right > box.right) x -= rect.right - box.right;
  if (rect.left < box.left) x += box.left - rect.left;
  if (rect.bottom > box.bottom) y -= rect.bottom - box.bottom;
  if (rect.top < box.top) y += box.top - rect.top;

  return { x, y };
}

export default function DraggableWhatsAppButton() {
  const pathname = usePathname();
  const constraintsRef = useRef(null);
  const buttonRef = useRef(null);
  const draggedRef = useRef(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [placed, setPlaced] = useState(false);
  const [whatsappHref, setWhatsappHref] = useState(floatingWhatsAppBaseHref);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const applyClamped = (pos) => {
    const clamped = clampIntoConstraints(
      buttonRef.current,
      constraintsRef.current,
      pos
    );
    setPosition(clamped);
    persistPosition(clamped);
    return clamped;
  };

  useEffect(() => {
    setPosition(readSavedPosition());
    setWhatsappHref(floatingWhatsAppHref());
    setPlaced(true);
  }, []);

  useEffect(() => {
    if (!placed) return undefined;

    const clampNow = () => {
      setPosition((prev) => {
        const clamped = clampIntoConstraints(
          buttonRef.current,
          constraintsRef.current,
          prev
        );
        if (clamped.x === prev.x && clamped.y === prev.y) return prev;
        persistPosition(clamped);
        return clamped;
      });
    };

    const raf = requestAnimationFrame(clampNow);
    window.addEventListener("resize", clampNow);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", clampNow);
    };
  }, [placed]);

  const handleDragEnd = (_, info) => {
    applyClamped({
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    });
  };

  useEffect(() => {
    const reset = () => {
      busyRef.current = false;
      setBusy(false);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  useEffect(() => {
    busyRef.current = false;
    setBusy(false);
  }, [pathname]);

  useLayoutEffect(() => {
    return () => {
      busyRef.current = false;
      setBusy(false);
    };
  }, []);

  const handleClick = (e) => {
    if (draggedRef.current) {
      // This click is the tail of a drag gesture — cancel navigation once,
      // then clear the flag so the next real tap opens WhatsApp.
      e.preventDefault();
      draggedRef.current = false;
      return;
    }

    setBusy(true);
    e.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    requestAnimationFrame(() =>
      setTimeout(() => {
        const nextHref = floatingWhatsAppHref();
        trackFloatingWhatsApp(nextHref);
        setWhatsappHref(nextHref);
        window.open(nextHref, "_blank", "noopener,noreferrer");
        window.setTimeout(() => {
          if (document.visibilityState === "visible") {
            busyRef.current = false;
            setBusy(false);
          }
        }, 4000);
      }, 0)
    );
  };

  return (
    <div ref={constraintsRef} className={styles.constraints}>
      <motion.a
        ref={buttonRef}
        href={whatsappHref}
        className={styles.button}
        aria-label={busy ? "Opening…" : "Contact Rixos on WhatsApp"}
        aria-busy={busy || undefined}
        target="_blank"
        rel="noopener noreferrer"
        drag
        dragConstraints={constraintsRef}
        dragElastic={0}
        dragMomentum={false}
        style={{ x: position.x, y: position.y, touchAction: "none" }}
        onTapStart={() => {
          // Reset at the start of every press (onDragStart does NOT fire on a
          // plain tap, so without this the flag stays stuck `true` after a drag
          // and permanently blocks the click).
          draggedRef.current = false;
        }}
        onDragStart={() => {
          draggedRef.current = false;
        }}
        onDrag={(_, info) => {
          if (
            Math.abs(info.offset.x) > DRAG_THRESHOLD ||
            Math.abs(info.offset.y) > DRAG_THRESHOLD
          ) {
            draggedRef.current = true;
          }
        }}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
      >
        {busy ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : (
          <FaWhatsapp size={30} aria-hidden className={styles.icon} />
        )}
      </motion.a>
    </div>
  );
}
