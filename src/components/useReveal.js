"use client";

import { useEffect } from "react";

export function useReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const nodes = [...root.querySelectorAll("[data-reveal]")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.setAttribute("data-revealed", "true"));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-revealed", "true");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.28 },
    );
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, [rootRef]);
}
