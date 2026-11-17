"use client";

import { useEffect, useState } from "react";
import { BOOKING_OPEN_EVENT } from "./bookingList";

export default function BookingDockGate() {
  const [Dock, setDock] = useState(null);
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = (open) => {
      if (open) setStartOpen(true);
      import("./BookingDock").then((mod) => {
        if (!cancelled) setDock(() => mod.default);
      });
    };
    const onOpen = () => load(true);
    const onShow = () => load(false);
    window.addEventListener(BOOKING_OPEN_EVENT, onOpen);
    window.addEventListener("pointerdown", onShow, { passive: true });
    window.addEventListener("keydown", onShow);
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => load(false), { timeout: 2000 })
      : window.setTimeout(() => load(false), 1);
    return () => {
      cancelled = true;
      window.removeEventListener(BOOKING_OPEN_EVENT, onOpen);
      window.removeEventListener("pointerdown", onShow);
      window.removeEventListener("keydown", onShow);
      if (window.cancelIdleCallback && window.requestIdleCallback) {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle);
      }
    };
  }, []);

  if (!Dock) return null;
  return <Dock startOpen={startOpen} />;
}
