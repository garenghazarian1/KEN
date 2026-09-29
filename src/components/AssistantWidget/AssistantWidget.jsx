"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { X } from "lucide-react";
import { ASSISTANT_AVATAR_SRC } from "@/config/constants";
import {
  ASSISTANT_LAUNCHER_TIP_MS,
  getAssistantLauncherTips,
} from "@/data/assistantUi";
import styles from "./AssistantWidget.module.css";
import { useAfterHeroVideo } from "@/components/hero/useAfterHeroVideo";
import { useHideNavOnScroll } from "@/components/mobileNav/useHideNavOnScroll";

/** Panel is lazy-loaded on first open to keep First Load JS small. */
const AssistantPanel = dynamic(() => import("./AssistantPanel"), {
  loading: () => <div className={styles.panelLoading}>Loading assistant…</div>,
});

const TIP_CHAR_MS = 28;
const TIP_EXIT_MS = 380;

const AssistantContext = createContext(null);

export function useAssistant() {
  const value = useContext(AssistantContext);
  if (!value) {
    throw new Error("Assistant controls must render inside AssistantProvider");
  }
  return value;
}

export function AssistantProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [tipIndex, setTipIndex] = useState(null);
  const [typedTip, setTypedTip] = useState("");
  const [tipPhase, setTipPhase] = useState("idle"); // idle | typing | hold | exit
  const launcherRef = useRef(null);
  const videoFirst = useAfterHeroVideo();
  const tipsDoneRef = useRef(false);
  const tipsRef = useRef(null);
  if (!tipsRef.current) tipsRef.current = getAssistantLauncherTips();
  const launcherTips = tipsRef.current;

  useEffect(() => {
    if (!videoFirst) return undefined;
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
        if (step >= launcherTips.length) {
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
  }, [launcherTips.length, videoFirst]);

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

    const full = launcherTips[tipIndex] ?? "";
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
  }, [tipIndex, open, launcherTips]);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      if (prev) requestAnimationFrame(() => launcherRef.current?.focus());
      return !prev;
    });
    setEverOpened(true);
  }, []);

  const close = useCallback((options) => {
    setOpen((prev) => {
      if (prev && options?.focus !== false) {
        requestAnimationFrame(() => launcherRef.current?.focus());
      }
      return false;
    });
  }, []);

  const tipFull = tipIndex !== null ? launcherTips[tipIndex] : null;
  const showTip = tipFull !== null;

  const value = useMemo(
    () => ({
      open,
      everOpened,
      toggle,
      close,
      launcherRef,
      showTip,
      tipFull,
      typedTip,
      tipPhase,
    }),
    [open, everOpened, toggle, close, showTip, tipFull, typedTip, tipPhase]
  );

  return (
    <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
  );
}

export function AssistantNavButton({ onActivate }) {
  const {
    open,
    toggle,
    launcherRef,
    showTip,
    tipFull,
    typedTip,
    tipPhase,
  } = useAssistant();

  const activate = () => {
    onActivate?.();
    toggle();
  };

  return (
    <div className={styles.navSlot}>
      {showTip && (
        <div className={styles.navTipAnchor}>
          <button
            type="button"
            className={`${styles.launcherTip} ${
              tipPhase === "exit" ? styles.launcherTipExit : ""
            }`}
            onClick={activate}
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
        </div>
      )}
      <button
        type="button"
        ref={launcherRef}
        className={styles.navButton}
        onClick={activate}
        aria-expanded={open}
        aria-controls="ken-assistant-panel"
        aria-label={open ? "Close Ani" : "Chat with Ani"}
        title="Ani — Ken Beauty Assistant"
      >
        {open ? (
          <span className={styles.navClose}>
            <X size={22} strokeWidth={1} aria-hidden="true" />
          </span>
        ) : (
          <Image
            src={ASSISTANT_AVATAR_SRC}
            alt=""
            width={28}
            height={28}
            className={styles.navFace}
            priority
          />
        )}
        <span className={styles.navLabel}>Ani</span>
      </button>
    </div>
  );
}

export default function AssistantWidget() {
  const { open, everOpened, close } = useAssistant();
  const navHidden = useHideNavOnScroll();

  if (!everOpened) return null;

  return (
    <div
      className={styles.root}
      data-nav-hidden={navHidden && !open ? "true" : "false"}
    >
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
    </div>
  );
}
