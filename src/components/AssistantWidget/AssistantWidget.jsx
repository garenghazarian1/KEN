"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { X } from "lucide-react";
import { ASSISTANT_AVATAR_SRC } from "@/config/constants";
import styles from "./AssistantWidget.module.css";

/** Panel is lazy-loaded on first open to keep First Load JS small. */
const AssistantPanel = dynamic(() => import("./AssistantPanel"), {
  loading: () => <div className={styles.panelLoading}>Loading assistant…</div>,
});

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const launcherRef = useRef(null);

  const toggle = () => {
    setOpen((prev) => {
      if (prev) requestAnimationFrame(() => launcherRef.current?.focus());
      return !prev;
    });
    setEverOpened(true);
  };

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  };

  return (
    <div className={styles.root}>
      {everOpened && (
        <div
          id="ken-assistant-panel"
          className={`${styles.panelWrapper} ${open ? styles.panelOpen : styles.panelClosed}`}
          role="dialog"
          aria-label="Ken Beauty Assistant"
          aria-hidden={!open}
          inert={open ? undefined : ""}
        >
          <AssistantPanel isOpen={open} onClose={close} />
        </div>
      )}
      <button
        type="button"
        ref={launcherRef}
        className={styles.launcher}
        onClick={toggle}
        aria-expanded={open}
        aria-controls="ken-assistant-panel"
        aria-label={open ? "Close assistant" : "Chat with Ken Beauty Assistant"}
        title="Ken Beauty Assistant"
      >
        {open ? (
          <span className={styles.launcherClose}>
            <X size={22} aria-hidden="true" />
          </span>
        ) : (
          <Image
            src={ASSISTANT_AVATAR_SRC}
            alt=""
            width={56}
            height={56}
            className={styles.launcherFace}
          />
        )}
      </button>
    </div>
  );
}
