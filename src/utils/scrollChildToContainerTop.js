/**
 * Scroll a child so its top lines up with the visible top of a scroll container.
 * Used so accordion triggers stay on screen under a sticky header.
 */

/**
 * @param {{
 *   scrollTop: number,
 *   scrollHeight: number,
 *   clientHeight: number,
 *   getBoundingClientRect: () => { top: number },
 * }} container
 * @param {{ getBoundingClientRect: () => { top: number } }} child
 * @returns {number}
 */
export function getScrollTopToAlign(container, child) {
  const delta =
    child.getBoundingClientRect().top - container.getBoundingClientRect().top;
  const target = container.scrollTop + delta;
  const max = Math.max(0, container.scrollHeight - container.clientHeight);
  return Math.max(0, Math.min(target, max));
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

/**
 * Smoothly scroll `child` to the top of `container`.
 * @param {HTMLElement | null | undefined} container
 * @param {HTMLElement | null | undefined} child
 * @param {{ duration?: number }} [options]
 * @returns {() => void} cancel
 */
export function scrollChildToContainerTop(
  container,
  child,
  { duration = 620 } = {},
) {
  if (!container || !child) return () => {};

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const to = getScrollTopToAlign(container, child);
  if (reduceMotion || duration <= 0) {
    container.scrollTop = to;
    return () => {};
  }

  const from = container.scrollTop;
  if (from === to) return () => {};

  let raf = 0;
  const start = performance.now();

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    container.scrollTop = from + (to - from) * easeOutCubic(t);
    if (t < 1) raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
