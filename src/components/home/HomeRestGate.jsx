"use client";

import { useEffect, useState } from "react";
import styles from "@/app/mainPage.module.css";

export default function HomeRestGate({ campaign }) {
  const [HomeRest, setHomeRest] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      import("./HomeRest").then((mod) => {
        if (!cancelled) setHomeRest(() => mod.default);
      });
    };
    window.addEventListener("pointerdown", load, { once: true, passive: true });
    window.addEventListener("keydown", load, { once: true });
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 1500 })
      : window.setTimeout(load, 1);
    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", load);
      window.removeEventListener("keydown", load);
      if (window.cancelIdleCallback && window.requestIdleCallback) {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle);
      }
    };
  }, []);

  if (!HomeRest) return <div className={styles.belowReserve} aria-hidden="true" />;
  return <HomeRest campaign={campaign} />;
}
