"use client";

import { useEffect, useState } from "react";

/** Hide chrome while scrolling down; show it while scrolling up or near the top. */
export function useHideNavOnScroll() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const latest = window.scrollY;
        const delta = latest - last;
        last = latest;
        setHidden((prev) => {
          if (latest < 48) return false;
          if (delta > 6) return true;
          if (delta < -6) return false;
          return prev;
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return hidden;
}
