"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { CONTACT } from "@/config/constants";
import styles from "./DraggableWhatsAppButton.module.css";

const STORAGE_KEY = "ken-whatsapp-position";
const DRAG_THRESHOLD = 8;

export default function DraggableWhatsAppButton() {
  const constraintsRef = useRef(null);
  const draggedRef = useRef(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPosition(JSON.parse(saved));
      }
    } catch {
      // Ignore corrupt saved position
    }
  }, []);

  const handleDragEnd = (_, info) => {
    const next = {
      x: position.x + info.offset.x,
      y: position.y + info.offset.y,
    };
    setPosition(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore quota errors
    }
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
        href={CONTACT.whatsapp.url()}
        className={styles.button}
        aria-label="Contact us on WhatsApp"
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
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
