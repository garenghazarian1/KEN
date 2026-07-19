"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { CONTACT } from "@/config/constants";
import styles from "./DraggableWhatsAppButton.module.css";

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
  const constraintsRef = useRef(null);
  const buttonRef = useRef(null);
  const draggedRef = useRef(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

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
    setMounted(true);
    setPosition(readSavedPosition());
  }, []);

  // After first paint (and on resize), pull any saved off-screen offset back in.
  useEffect(() => {
    if (!mounted) return undefined;

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
  }, [mounted]);

  const handleDragEnd = (_, info) => {
    applyClamped({
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    });
  };

  const handleClick = (e) => {
    if (draggedRef.current) {
      // This click is the tail of a drag gesture — cancel navigation once,
      // then clear the flag so the next real tap opens WhatsApp.
      e.preventDefault();
      draggedRef.current = false;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div ref={constraintsRef} className={styles.constraints}>
      <motion.a
        ref={buttonRef}
        href={CONTACT.whatsapp.url()}
        className={styles.button}
        aria-label="Contact us on WhatsApp"
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
        <FaWhatsapp size={30} aria-hidden className={styles.icon} />
      </motion.a>
    </div>
  );
}
