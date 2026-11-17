"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const RESET_MS = 4000;

function resetIfVisible(reset) {
  if (document.visibilityState !== "visible") return;
  reset();
}

export function isPlainClick(event) {
  if (!event) return true;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }
  if (typeof event.button === "number" && event.button !== 0) return false;
  return true;
}

export function paintThen(work) {
  requestAnimationFrame(() => {
    setTimeout(work, 0);
  });
}

export function planPress({ event, locked, external = false, release = false }) {
  if (!isPlainClick(event)) {
    return { prevent: false, resetIn: RESET_MS, taken: false };
  }
  if (locked) {
    return { prevent: true, resetIn: null, taken: false };
  }
  return {
    prevent: true,
    resetIn: !release && external ? RESET_MS : null,
    taken: true,
  };
}

export function beginPress({
  event,
  work,
  locked,
  external = false,
  release = false,
  setBusy,
  afterPaint,
  arm,
  reset,
  onLock,
}) {
  setBusy(true);
  const liveHref = event?.currentTarget?.href;
  const plan = planPress({ event, locked, external, release });
  if (plan.prevent) event?.preventDefault();
  if (!plan.taken) {
    if (plan.resetIn) arm(plan.resetIn);
    return plan;
  }
  onLock?.();
  afterPaint(() => {
    const result = work?.({ href: liveHref });
    if (release || result === "stay") reset();
    else if (plan.resetIn) arm(plan.resetIn);
  });
  return plan;
}

export function usePressFeedback() {
  const pathname = usePathname();
  const [pressPath, setPressPath] = useState(null);
  const lockPathRef = useRef(null);
  const timerRef = useRef(0);

  if (pressPath !== null && pressPath !== pathname) {
    setPressPath(null);
  }

  const busy = pressPath === pathname;

  const reset = useCallback(() => {
    window.clearTimeout(timerRef.current);
    lockPathRef.current = null;
    setPressPath(null);
  }, []);

  const arm = useCallback(
    (ms) => {
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        resetIfVisible(reset);
      }, ms);
    },
    [reset],
  );

  useEffect(() => {
    lockPathRef.current = null;
    window.clearTimeout(timerRef.current);
  }, [pathname]);

  useEffect(() => {
    const onPageShow = () => reset();
    const onVisible = () => resetIfVisible(reset);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearTimeout(timerRef.current);
    };
  }, [reset]);

  const showPressed = useCallback(() => {
    setPressPath(pathname);
    arm(RESET_MS);
  }, [arm, pathname]);

  const press = useCallback(
    (event, work, options = {}) => {
      beginPress({
        event,
        work,
        locked: lockPathRef.current === pathname,
        external: Boolean(options.external),
        release: Boolean(options.release),
        setBusy: () => setPressPath(pathname),
        afterPaint: paintThen,
        arm,
        reset,
        onLock: () => {
          lockPathRef.current = pathname;
        },
      });
    },
    [arm, pathname, reset],
  );

  return { busy, press, showPressed };
}
