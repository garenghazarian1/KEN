"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./FitName.module.css";

function pxSize(el, fontSize) {
  const previous = el.style.fontSize;
  el.style.fontSize = fontSize;
  const size = parseFloat(getComputedStyle(el).fontSize);
  el.style.fontSize = previous;
  return size;
}

function contentWidth(el) {
  const previous = {
    flex: el.style.flex,
    width: el.style.width,
    minWidth: el.style.minWidth,
    maxWidth: el.style.maxWidth,
  };
  el.style.flex = "0 0 auto";
  el.style.width = "max-content";
  el.style.minWidth = "0";
  el.style.maxWidth = "none";
  const width = el.getBoundingClientRect().width;
  el.style.flex = previous.flex;
  el.style.width = previous.width;
  el.style.minWidth = previous.minWidth;
  el.style.maxWidth = previous.maxWidth;
  return width;
}

function rowFits(nameEl, priceEl) {
  const previous = nameEl.style.whiteSpace;
  nameEl.style.whiteSpace = "nowrap";
  let fits;
  if (!priceEl) {
    fits = nameEl.scrollWidth <= nameEl.clientWidth + 1;
  } else {
    const row = nameEl.parentElement;
    if (!row) fits = nameEl.scrollWidth <= nameEl.clientWidth + 1;
    else {
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      fits = contentWidth(nameEl) + contentWidth(priceEl) + gap <= row.clientWidth + 1;
    }
  }
  nameEl.style.whiteSpace = previous;
  return fits;
}

function showFull(el) {
  el.style.whiteSpace = "normal";
  el.style.overflow = "visible";
  el.style.textOverflow = "clip";
}

function fitName(el, priceEl) {
  if (!el || el.clientWidth < 8) return;
  el.style.fontSize = "";
  if (!priceEl) {
    showFull(el);
    return;
  }
  priceEl.style.fontSize = "";
  const nameCeiling = parseFloat(getComputedStyle(el).fontSize);
  if (!nameCeiling) return;
  const priceCeiling = priceEl
    ? parseFloat(getComputedStyle(priceEl).fontSize)
    : nameCeiling;
  const minPx = Math.min(pxSize(el, "var(--font-size-xs)") || nameCeiling, nameCeiling);
  const previousNameWeight = el.style.fontWeight;
  const previousPriceWeight = priceEl ? priceEl.style.fontWeight : "";
  el.style.fontWeight = "500";
  if (priceEl) priceEl.style.fontWeight = "500";

  const apply = (nameSize) => {
    const scale = nameSize / nameCeiling;
    el.style.fontSize = `${nameSize}px`;
    if (priceEl) priceEl.style.fontSize = `${priceCeiling * scale}px`;
  };

  if (rowFits(el, priceEl)) {
    el.style.fontWeight = previousNameWeight;
    if (priceEl) priceEl.style.fontWeight = previousPriceWeight;
    return;
  }

  let low = minPx;
  let high = nameCeiling;
  let best = low;
  while (high - low > 0.25) {
    const mid = (low + high) / 2;
    apply(mid);
    if (rowFits(el, priceEl)) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
  }
  apply(best);
  el.style.fontWeight = previousNameWeight;
  if (priceEl) priceEl.style.fontWeight = previousPriceWeight;
  if (rowFits(el, priceEl)) el.style.whiteSpace = "nowrap";
  else showFull(el);
}

export default function FitName({ className, text, syncPrice = false, children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let fitting = false;
    const fit = () => {
      if (fitting) return;
      fitting = true;
      const priceEl = syncPrice ? el.nextElementSibling : null;
      fitName(el, priceEl);
      fitting = false;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    if (el.parentElement) observer.observe(el.parentElement);
    return () => observer.disconnect();
  }, [syncPrice, text]);

  const classes = className ? `${styles.root} ${className}` : styles.root;
  return (
    <span ref={ref} className={classes}>
      {children}
    </span>
  );
}
