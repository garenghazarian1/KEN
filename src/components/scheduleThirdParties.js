"use client";

const IDLE_MS = 5000;
const waiters = new Set();
let armed = false;
let started = false;

function flush() {
  if (started) return;
  started = true;
  requestAnimationFrame(() => {
    setTimeout(() => {
      waiters.forEach((run) => run());
      waiters.clear();
    }, 0);
  });
}

function arm() {
  if (armed || typeof window === "undefined") return;
  armed = true;
  const onInteract = () => flush();
  for (const type of ["pointerdown", "keydown", "scroll", "touchstart"]) {
    window.addEventListener(type, onInteract, { passive: true, once: true });
  }
  window.setTimeout(() => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => flush(), { timeout: 1500 });
      return;
    }
    flush();
  }, IDLE_MS);
}

/** First interaction, or idle at least 5s after load. Work runs after paint. */
export function whenThirdParties(run) {
  if (typeof window === "undefined") return;
  if (started) {
    run();
    return;
  }
  waiters.add(run);
  arm();
}
