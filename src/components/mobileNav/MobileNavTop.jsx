"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Briefcase, Calendar, Coffee, Scissors } from "lucide-react";
import {
  BOOKING_URL,
  CAREERS_URL,
  NAVBAR_LOGO_DEFAULT_SRC,
} from "@/config/constants";
import styles from "./MobileNavTop.module.css";

export default function MobileNavTop() {
  const pathname = usePathname();
  const drinksActive =
    pathname === "/drinks" || pathname.startsWith("/drinks/");
  const servicesActive =
    pathname === "/services" || pathname.startsWith("/services/");

  return (
    <header className={styles.topBar} role="banner">
      <Link
        href="/"
        className={styles.logoLink}
        aria-label="Ken Beauty Salon home"
      >
        <Image
          src={NAVBAR_LOGO_DEFAULT_SRC}
          alt="Ken Beauty Salon logo"
          width={44}
          height={44}
          className={styles.logo}
          style={{ width: "44px", height: "44px", objectFit: "contain" }}
          priority
        />
      </Link>
      <div className={styles.navActions}>
        <Link
          href="/services"
          className={styles.actionLink}
          aria-label="Services"
          aria-current={servicesActive ? "page" : undefined}
        >
          <Scissors size={22} className={styles.icon} aria-hidden />
          <span className={styles.label}>Services</span>
        </Link>
        <Link
          href="/drinks"
          className={styles.actionLink}
          aria-label="Drinks menu"
          aria-current={drinksActive ? "page" : undefined}
        >
          <Coffee size={22} className={styles.icon} aria-hidden />
          <span className={styles.label}>Drinks</span>
        </Link>
        <a
          href={CAREERS_URL}
          className={styles.actionLink}
          aria-label="Jobs"
        >
          <Briefcase size={22} className={styles.icon} aria-hidden />
          <span className={styles.label}>Jobs</span>
        </a>
        <a
          href={BOOKING_URL}
          className={`${styles.actionLink} ${styles.bookLink}`}
          aria-label="Book now"
        >
          <Calendar size={22} className={styles.icon} aria-hidden />
          <span className={styles.label}>Book now</span>
        </a>
      </div>
    </header>
  );
}
