"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Briefcase, Calendar, Coffee, House } from "lucide-react";
import {
  BOOKING_URL,
  CAREERS_URL,
  NAVBAR_LOGO_DEFAULT_SRC,
} from "@/config/constants";
import ServicesMegaMenu from "@/components/loading/navbar/ServicesMegaMenu/ServicesMegaMenu";
import styles from "./MobileNavTop.module.css";
import { useHideNavOnScroll } from "./useHideNavOnScroll";

const LOGO_HOLD_MS = 5000;
const HOME_HOLD_MS = 2000;

export default function MobileNavTop() {
  const pathname = usePathname();
  const hidden = useHideNavOnScroll();
  const [showHome, setShowHome] = useState(false);
  const [markPaused, setMarkPaused] = useState(false);
  const drinksActive =
    pathname === "/drinks" || pathname.startsWith("/drinks/");
  const servicesActive =
    pathname === "/services" || pathname.startsWith("/services/");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return undefined;

    let timer = 0;
    const hold = showHome ? HOME_HOLD_MS : LOGO_HOLD_MS;

    const start = () => {
      window.clearTimeout(timer);
      if (document.hidden || markPaused) return;
      timer = window.setTimeout(() => {
        setShowHome((current) => !current);
      }, hold);
    };

    const onVisibility = () => {
      if (document.hidden) window.clearTimeout(timer);
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [markPaused, showHome]);

  return (
    <header
      className={styles.topBar}
      role="banner"
      data-hidden={hidden ? "true" : "false"}
      {...(hidden ? { inert: "" } : {})}
    >
      <nav
        className={styles.navList}
        aria-label="Primary actions"
      >
        <div className={styles.navItem}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label="Ken Beauty Salon home"
            onMouseEnter={() => setMarkPaused(true)}
            onMouseLeave={() => setMarkPaused(false)}
            onFocus={() => setMarkPaused(true)}
            onBlur={() => setMarkPaused(false)}
          >
            <span
              className={styles.mark}
              data-home={showHome ? "true" : "false"}
              aria-hidden="true"
            >
              <span className={`${styles.markLayer} ${styles.markLogo}`}>
                <Image
                  src={NAVBAR_LOGO_DEFAULT_SRC}
                  alt=""
                  width={44}
                  height={44}
                  className={styles.logo}
                  style={{ width: "44px", height: "44px", objectFit: "contain" }}
                  priority
                />
              </span>
              <span className={`${styles.markLayer} ${styles.markHome}`}>
                <House size={22} strokeWidth={1} className={styles.icon} />
              </span>
            </span>
          </Link>
        </div>
        <div className={styles.navItem}>
          <ServicesMegaMenu variant="topbar" isActive={servicesActive} />
        </div>
        <div className={styles.navItem}>
          <Link
            href="/drinks"
            className={styles.actionLink}
            aria-label="Drinks menu"
            aria-current={drinksActive ? "page" : undefined}
          >
            <Coffee size={22} strokeWidth={1} className={styles.icon} aria-hidden />
            <span className={styles.label}>Drinks</span>
          </Link>
        </div>
        <div className={styles.navItem}>
          <a
            href={CAREERS_URL}
            className={styles.actionLink}
            aria-label="Jobs"
          >
            <Briefcase size={22} strokeWidth={1} className={styles.icon} aria-hidden />
            <span className={styles.label}>Jobs</span>
          </a>
        </div>
        <div className={styles.navItem}>
          <a
            href={BOOKING_URL}
            className={styles.actionLink}
            aria-label="Book"
          >
            <Calendar size={22} strokeWidth={1} className={styles.icon} aria-hidden />
            <span className={styles.label}>Book</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
