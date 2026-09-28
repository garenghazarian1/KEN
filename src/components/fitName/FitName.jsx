"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./FitName.module.css";

function fitName(el) {
  if (!el || el.clientWidth < 8) return;
  el.style.fontSize = "";
  const ceiling = parseFloat(getComputedStyle(el).fontSize);
  if (!ceiling) return;
  const previousWeight = el.style.fontWeight;
  el.style.fontWeight = "500";
  if (el.scrollWidth <= el.clientWidth + 1) {
    el.style.fontWeight = previousWeight;
    return;
  }
  let low = 1;
  let high = ceiling;
  let best = low;
  while (high - low > 0.25) {
    const mid = (low + high) / 2;
    el.style.fontSize = `${mid}px`;
    if (el.scrollWidth > el.clientWidth + 1) high = mid;
    else {
      best = mid;
      low = mid;
    }
  }
  el.style.fontSize = `${best}px`;
  el.style.fontWeight = previousWeight;
}

export default function FitName({ className, text, children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let fitting = false;
    const fit = () => {
      if (fitting) return;
      fitting = true;
      fitName(el);
      fitting = false;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    if (el.parentElement) observer.observe(el.parentElement);
    return () => observer.disconnect();
  }, [text]);

  const classes = className ? `${styles.root} ${className}` : styles.root;
  return (
    <span ref={ref} className={classes}>
      {children}
    </span>
  );
}
