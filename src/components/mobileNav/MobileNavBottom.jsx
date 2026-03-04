"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Mail, Images, CreditCard } from "lucide-react";
import { CARD_URL } from "@/config/constants";
import styles from "./MobileNavBottom.module.css";

const mobileNavLinks = [
  { label: "Home", path: "/", icon: Home },
  { label: "About us", path: "/about", icon: Users },
  { label: "Contact", path: "/contact", icon: Mail },
  { label: "Gallery", path: "/gallery", icon: Images },
  { label: "Card", path: CARD_URL, icon: CreditCard, external: true },
];

export default function MobileNavBottom() {
  const pathname = usePathname();

  return (
    <nav className={styles.bottomBar} role="navigation" aria-label="Main navigation">
      <ul className={styles.navList}>
        {mobileNavLinks.map(({ label, path, icon: Icon, external }) => {
          const isActive =
            !external &&
            (path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(path + "/"));
          return (
            <li key={path} className={styles.navItem}>
              {external ? (
                <a
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <Icon size={22} className={styles.icon} aria-hidden />
                  <span className={styles.label}>{label}</span>
                </a>
              ) : (
                <Link
                  href={path}
                  className={styles.link}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={22} className={styles.icon} aria-hidden />
                  <span className={styles.label}>{label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
