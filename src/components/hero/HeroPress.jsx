"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Hero.modern.module.css";

function Opening() {
  return (
    <span className={styles.opening}>
      <span className={styles.spinner} aria-hidden="true" />
      Opening…
    </span>
  );
}

export default function HeroPress({
  href,
  className,
  children,
  tabIndex,
  label,
  photo = false,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  useEffect(() => {
    const reset = () => {
      busyRef.current = false;
      setBusy(false);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  useEffect(() => {
    busyRef.current = false;
    setBusy(false);
  }, [pathname]);

  useLayoutEffect(() => {
    return () => {
      busyRef.current = false;
      setBusy(false);
    };
  }, []);

  function onClick(event) {
    setBusy(true);
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    requestAnimationFrame(() =>
      setTimeout(() => {
        router.push(href);
      }, 0)
    );
  }

  return (
    <Link
      href={href}
      prefetch
      className={className}
      tabIndex={tabIndex}
      aria-label={busy ? "Opening…" : label}
      aria-busy={busy || undefined}
      onClick={onClick}
    >
      {photo ? (
        <>
          {children}
          <span className={busy ? styles.photoOpening : styles.photoOpeningOff}>
            <Opening />
          </span>
        </>
      ) : (
        <>
          <span className={busy ? styles.slotHidden : styles.slot}>{children}</span>
          <span className={busy ? styles.slot : styles.slotHidden}>
            <Opening />
          </span>
        </>
      )}
    </Link>
  );
}
