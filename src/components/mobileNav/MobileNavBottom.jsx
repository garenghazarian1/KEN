"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Home,
  Users,
  Mail,
  Images,
  CreditCard,
  Phone,
  MessageCircle,
} from "lucide-react";
import { CARD_URL, getTelLink } from "@/config/constants";
import { stores } from "@/data/stores";
import {
  buildWhatsAppUrl,
  trackWhatsAppClick,
} from "@/lib/adsAttribution";
import styles from "./MobileNavBottom.module.css";

const mobileNavLinks = [
  { label: "Home", path: "/", icon: Home },
  { label: "About us", path: "/about", icon: Users },
  { label: "Contact", path: "/contact", icon: Mail, opensSheet: true },
  { label: "Gallery", path: "/gallery", icon: Images },
  { label: "Card", path: CARD_URL, icon: CreditCard, external: true },
];

function branchLabel(name) {
  if (name.includes("Galleria")) return "The Galleria";
  if (name.includes("Rixos")) return "Rixos Marina";
  return name;
}

export default function MobileNavBottom() {
  const pathname = usePathname();
  const panelId = useId();
  const contactButtonRef = useRef(null);
  const panelRef = useRef(null);
  const wasOpenRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      panelRef.current?.focus();
      return;
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      contactButtonRef.current?.focus();
    }
  }, [open]);

  const closeSheet = () => setOpen(false);

  return (
    <nav
      className={styles.bottomBar}
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className={styles.navList}>
        {mobileNavLinks.map(({ label, path, icon: Icon, external, opensSheet }) => {
          const isActive =
            !external &&
            (path === "/"
              ? pathname === "/"
              : pathname === path || pathname.startsWith(path + "/"));
          return (
            <li key={path} className={styles.navItem}>
              {opensSheet ? (
                <button
                  ref={contactButtonRef}
                  type="button"
                  className={styles.link}
                  aria-expanded={open}
                  aria-controls={panelId}
                  aria-current={isActive && !open ? "page" : undefined}
                  onClick={() => setOpen((current) => !current)}
                >
                  <Icon size={22} className={styles.icon} aria-hidden />
                  <span className={styles.label}>{label}</span>
                </button>
              ) : external ? (
                <a href={path} className={styles.link} onClick={closeSheet}>
                  <Icon size={22} className={styles.icon} aria-hidden />
                  <span className={styles.label}>{label}</span>
                </a>
              ) : (
                <Link
                  href={path}
                  className={styles.link}
                  aria-current={isActive ? "page" : undefined}
                  onClick={closeSheet}
                >
                  <Icon size={22} className={styles.icon} aria-hidden />
                  <span className={styles.label}>{label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${panelId}-title`}
            tabIndex={-1}
          >
            <div className={styles.atmosphere} aria-hidden="true">
              <Image
                src="/portfolio/portfolioA001.webp"
                alt=""
                fill
                className={styles.atmosphereImage}
                sizes="100vw"
                priority
              />
            </div>

            <div className={styles.sheetInner}>
              <header className={styles.sheetHeader}>
                <p className={styles.eyebrow}>Ken Beauty Salon</p>
                <h2 id={`${panelId}-title`} className={styles.sheetTitle}>
                  Call us
                </h2>
                <p className={styles.sheetLead}>
                  Choose a branch. Numbers open your phone; WhatsApp opens a chat.
                </p>
              </header>

              <ul className={styles.branchList}>
                {stores.map((store) => {
                  const label = branchLabel(store.name);
                  const whatsappDigits = store.whatsapp.replace(/[\s+]/g, "");
                  return (
                    <li key={store._id} className={styles.branch}>
                      <h3 className={styles.branchName}>{label}</h3>
                      <a
                        href={getTelLink(store.phone)}
                        className={styles.numberRow}
                      >
                        <Phone size={18} aria-hidden />
                        <span className={styles.numberMeta}>
                          <span className={styles.numberKind}>Landline</span>
                          <span className={styles.numberValue}>{store.phone}</span>
                        </span>
                      </a>
                      <a
                        href={getTelLink(store.mobile)}
                        className={styles.numberRow}
                      >
                        <Phone size={18} aria-hidden />
                        <span className={styles.numberMeta}>
                          <span className={styles.numberKind}>Mobile</span>
                          <span className={styles.numberValue}>{store.mobile}</span>
                        </span>
                      </a>
                      <a
                        href={buildWhatsAppUrl({
                          number: whatsappDigits,
                          message: `Hello KEN Beauty Center (${label}), I would like to book a service.`,
                        })}
                        className={styles.whatsappRow}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackWhatsAppClick({
                            branch: label,
                            number: whatsappDigits,
                          })
                        }
                      >
                        <MessageCircle size={18} aria-hidden />
                        <span>WhatsApp {label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/contact"
                className={styles.pageLink}
                onClick={closeSheet}
              >
                <span>Visit contact page</span>
                <ArrowUpRight size={16} aria-hidden />
              </Link>
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}
