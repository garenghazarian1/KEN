"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { BOOKING_URL } from "@/config/constants";
import styles from "./MobileNavTop.module.css";

export default function MobileNavTop() {
  return (
    <header className={styles.topBar} role="banner">
      <Link href="/" className={styles.logoLink} aria-label="Ken Beauty Salon home">
        <Image
          src="/logo03.png"
          alt="Ken Beauty Salon logo"
          width={44}
          height={44}
          className={styles.logo}
          style={{ width: "44px", height: "44px", objectFit: "contain" }}
          priority
        />
      </Link>
      <Link href={BOOKING_URL} className={styles.bookButton} aria-label="Book now">
        <Calendar size={18} aria-hidden />
        <span>Book now</span>
      </Link>
    </header>
  );
}
