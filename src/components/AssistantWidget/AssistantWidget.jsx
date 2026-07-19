"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { X } from "lucide-react";
import { ASSISTANT_AVATAR_SRC } from "@/config/constants";
import {
  ASSISTANT_LAUNCHER_TIP_MS,
  ASSISTANT_LAUNCHER_TIPS,
} from "@/data/assistantUi";
import styles from "./AssistantWidget.module.css";

/** Panel is lazy-loaded on first open to keep First Load JS small. */
const AssistantPanel = dynamic(() => import("./AssistantPanel"), {
  loading: () => <div className={styles.panelLoading}>Loading assistant…</div>,
});

const TIP_CHAR_MS = 28;
const TIP_EXIT_MS = 380;

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [tipIndex, setTipIndex] = useState(null);
  const [typedTip, setTypedTip] = useState("");
  const [tipPhase, setTipPhase] = useState("idle"); // idle | typing | hold | exit
  const launcherRef = useRef(null);
  const tipsDoneRef = useRef(false);

  useEffect(() => {
    let step = 0;
    let exitTimer = 0;
    setTipIndex(0);

    const id = window.setInterval(() => {
      if (tipsDoneRef.current) {
        window.clearInterval(id);
        return;
      }
      step += 1;
      setTipPhase("exit");
      window.clearTimeout(exitTimer);
      exitTimer = window.setTimeout(() => {
        if (step >= ASSISTANT_LAUNCHER_TIPS.length) {
          tipsDoneRef.current = true;
          setTipIndex(null);
          window.clearInterval(id);
          return;
        }
        setTipIndex(step);
      }, TIP_EXIT_MS);
    }, ASSISTANT_LAUNCHER_TIP_MS);

    return () => {
      window.clearInterval(id);
      window.clearTimeout(exitTimer);
    };
  }, []);

  useEffect(() => {
    if (!open || tipsDoneRef.current) return;
    tipsDoneRef.current = true;
    setTipPhase("exit");
    const t = window.setTimeout(() => setTipIndex(null), TIP_EXIT_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (tipIndex === null) {
      setTypedTip("");
      setTipPhase("idle");
      return;
    }
    if (open) return;

    const full = ASSISTANT_LAUNCHER_TIPS[tipIndex] ?? "";
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setTypedTip(full);
      setTipPhase("hold");
      return;
    }

    setTypedTip("");
    setTipPhase("typing");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTypedTip(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(id);
        setTipPhase("hold");
      }
    }, TIP_CHAR_MS);

    return () => window.clearInterval(id);
  }, [tipIndex, open]);

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

  const tipFull =
    tipIndex !== null ? ASSISTANT_LAUNCHER_TIPS[tipIndex] : null;
  const showTip = tipFull !== null;

  return (
    <div className={styles.root}>
      {everOpened && (
        <div
          id="ken-assistant-panel"
          className={`${styles.panelWrapper} ${open ? styles.panelOpen : styles.panelClosed}`}
          role="dialog"
          aria-label="Ani, Ken Beauty Assistant"
          aria-hidden={!open}
          inert={open ? undefined : ""}
        >
          <AssistantPanel isOpen={open} onClose={close} />
        </div>
      )}
      {showTip && (
        <button
          type="button"
          className={`${styles.launcherTip} ${
            tipPhase === "exit" ? styles.launcherTipExit : ""
          }`}
          onClick={toggle}
          aria-label={`${tipFull} Open chat with Ani`}
        >
          <span className={styles.launcherTipGlass} aria-hidden="true" />
          <span className={styles.launcherTipBadge} aria-hidden="true">
            Ani AI
          </span>
          <span className={styles.launcherTipText} aria-live="polite">
            {typedTip}
            {tipPhase === "typing" && (
              <span className={styles.launcherTipCursor} aria-hidden="true" />
            )}
          </span>
        </button>
      )}
      <div className={`${styles.launcherShell} ${open ? styles.launcherShellOpen : ""}`}>
        <span className={styles.launcherGlow} aria-hidden="true" />
        <span className={styles.launcherRing} aria-hidden="true" />
        <button
          type="button"
          ref={launcherRef}
          className={styles.launcher}
          onClick={toggle}
          aria-expanded={open}
          aria-controls="ken-assistant-panel"
          aria-label={open ? "Close Ani" : "Chat with Ani"}
          title="Ani — Ken Beauty Assistant"
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
    </div>
  );
}
