"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { imagePriorityProps } from "@/lib/ui/imagePriority";
import { usePathname } from "next/navigation";
import { Briefcase, Calendar, Coffee, House, Scissors } from "lucide-react";
import {
  BOOKING_URL,
  CAREERS_PATH,
  NAVBAR_LOGO_DEFAULT_SRC,
} from "@/config/constants";
import glassStyles from "@/components/IphoneGlass/iphoneGlass.module.css";
import styles from "./MobileNavTop.module.css";
import pressStyles from "./pressFeedback.module.css";
import PressLink, { OpeningMark, openingName } from "./PressLink";
import { usePressFeedback } from "./usePressFeedback";
import { useHideNavOnScroll } from "./useHideNavOnScroll";
import { requestServicesOpen } from "@/components/loading/navbar/ServicesMegaMenu/servicesMenuOpen";

function inServicesSlot(event) {
  return Boolean(event?.target?.closest?.("[data-services-slot]"));
}

function loadServicesMenu() {
  return import("@/components/loading/navbar/ServicesMegaMenu/ServicesMegaMenu");
}

export function ServicesSlot({ servicesActive }) {
  const [Menu, setMenu] = useState(null);
  const { busy, press, showPressed } = usePressFeedback();
  const loaded = useRef(null);
  const alive = useRef(true);
  const touching = useRef(false);

  const showLoaded = useCallback((mod) => {
    if (!alive.current) return;
    loaded.current = mod;
    if (touching.current) return;
    setMenu(() => mod.default);
  }, []);

  const releaseTouch = () => {
    touching.current = false;
    if (loaded.current) showLoaded(loaded.current);
  };

  useEffect(() => {
    alive.current = true;
    const load = () => {
      loadServicesMenu().then(showLoaded);
    };
    const onShow = (event) => {
      if (inServicesSlot(event)) return;
      load();
    };
    window.addEventListener("pointerdown", onShow, { passive: true });
    window.addEventListener("keydown", onShow);
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 2500 })
      : window.setTimeout(load, 1);
    return () => {
      alive.current = false;
      window.removeEventListener("pointerdown", onShow);
      window.removeEventListener("keydown", onShow);
      if (window.cancelIdleCallback && window.requestIdleCallback) {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle);
      }
    };
  }, [showLoaded]);

  if (Menu) {
    return <Menu variant="topbar" isActive={servicesActive} />;
  }

  return (
    <button
      type="button"
      className={`${styles.actionLink} ${pressStyles.press} ${pressStyles.host} ${pressStyles.bar}`}
      data-services-slot=""
      aria-label={openingName(busy, "Services")}
      aria-current={servicesActive ? "page" : undefined}
      aria-busy={busy || undefined}
      onPointerDown={() => {
        showPressed();
        touching.current = true;
      }}
      onPointerCancel={releaseTouch}
      onPointerUp={() => {
        // Click runs before this microtask. A scroll never clicks, so the hold ends.
        queueMicrotask(() => {
          if (touching.current) releaseTouch();
        });
      }}
      onClick={(event) => {
        touching.current = false;
        press(event, () => {
          requestServicesOpen();
          if (loaded.current) showLoaded(loaded.current);
          else loadServicesMenu().then(showLoaded);
        });
      }}
    >
      <Scissors size={22} strokeWidth={1} className={styles.icon} aria-hidden />
      <span className={styles.label}>Services</span>
      <OpeningMark show={busy} />
    </button>
  );
}

const LOGO_HOLD_MS = 5000;
const HOME_HOLD_MS = 2000;

export default function MobileNavTop() {
  const pathname = usePathname();
  const hidden = useHideNavOnScroll();
  const [showHome, setShowHome] = useState(false);
  const [markPaused, setMarkPaused] = useState(false);
  const homeActive = pathname === "/";
  const drinksActive =
    pathname === "/drinks" || pathname.startsWith("/drinks/");
  const servicesActive =
    pathname === "/services" || pathname.startsWith("/services/");
  const careersActive =
    pathname === CAREERS_PATH || pathname.startsWith(`${CAREERS_PATH}/`);

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
      {...(hidden ? { inert: true } : {})}
    >
      <div
        className={`${glassStyles.surface} ${glassStyles.sheet}`}
        aria-hidden="true"
      />
      <nav
        className={styles.navList}
        aria-label="Primary actions"
      >
        <div className={styles.navItem}>
          <PressLink
            href="/"
            insetFocus
            className={styles.logoLink}
            aria-label="Ken Beauty Salon home"
            aria-current={homeActive ? "page" : undefined}
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
                  {...imagePriorityProps(false)}
                />
              </span>
              <span className={`${styles.markLayer} ${styles.markHome}`}>
                <House size={22} strokeWidth={1} className={styles.icon} />
              </span>
            </span>
          </PressLink>
        </div>
        <div className={styles.navItem} data-services-slot="">
          <ServicesSlot servicesActive={servicesActive} />
        </div>
        <div className={styles.navItem}>
          <PressLink
            href="/drinks"
            insetFocus
            className={styles.actionLink}
            aria-label="Drinks menu"
            aria-current={drinksActive ? "page" : undefined}
          >
            <Coffee size={22} strokeWidth={1} className={styles.icon} aria-hidden />
            <span className={styles.label}>Drinks</span>
          </PressLink>
        </div>
        <div className={styles.navItem}>
          <PressLink
            href={CAREERS_PATH}
            insetFocus
            className={styles.actionLink}
            aria-label="Jobs"
            aria-current={careersActive ? "page" : undefined}
          >
            <Briefcase size={22} strokeWidth={1} className={styles.icon} aria-hidden />
            <span className={styles.label}>Jobs</span>
          </PressLink>
        </div>
        <div className={styles.navItem}>
          <PressLink
            href={BOOKING_URL}
            external
            showOpening
            insetFocus
            className={styles.actionLink}
            aria-label="Book"
          >
            <Calendar size={22} strokeWidth={1} className={styles.icon} aria-hidden />
            <span className={styles.label}>Book</span>
          </PressLink>
        </div>
      </nav>
    </header>
  );
}
