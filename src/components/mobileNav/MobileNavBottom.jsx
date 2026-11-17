"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Users,
  Mail,
  Images,
  CreditCard,
  Phone,
  MessageCircle,
} from "lucide-react";
import {
  AssistantNavButton,
  useAssistant,
} from "@/components/AssistantWidget/AssistantWidget";
import { CARD_URL, getTelLink } from "@/config/constants";
import { stores } from "@/data/stores";
import { buildWhatsAppUrl } from "@/lib/adsAttribution";
import { branchKey } from "@/lib/leads/leadRecord";
import { recordOutbound } from "@/lib/leads/trackLead";
import glassStyles from "@/components/IphoneGlass/iphoneGlass.module.css";
import styles from "./MobileNavBottom.module.css";
import pressStyles from "./pressFeedback.module.css";
import PressLink from "./PressLink";
import { usePressFeedback } from "./usePressFeedback";
import { useHideNavOnScroll } from "./useHideNavOnScroll";

const mobileNavLinks = [
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
  const skipContactFocusRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { open: assistantOpen, close: closeAssistant } = useAssistant();
  const { busy: contactBusy, press } = usePressFeedback();
  const hidden = useHideNavOnScroll() && !open && !assistantOpen;

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
      if (skipContactFocusRef.current) {
        skipContactFocusRef.current = false;
        return;
      }
      contactButtonRef.current?.focus();
    }
  }, [open]);

  const closeSheet = () => setOpen(false);

  return (
    <nav
      className={styles.bottomBar}
      role="navigation"
      aria-label="Main navigation"
      data-hidden={hidden ? "true" : "false"}
      {...(hidden ? { inert: true } : {})}
    >
      <div
        className={`${glassStyles.surface} ${glassStyles.sheet}`}
        aria-hidden="true"
      />
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <AssistantNavButton
            onActivate={() => {
              skipContactFocusRef.current = true;
              setOpen(false);
            }}
          />
        </li>
        {mobileNavLinks.map(({ label, path, icon: Icon, external, opensSheet }) => {
          const isActive =
            !external &&
            (pathname === path || pathname.startsWith(`${path}/`));
          return (
            <li key={path} className={styles.navItem}>
              {opensSheet ? (
                <button
                  ref={contactButtonRef}
                  type="button"
                  className={`${styles.link} ${pressStyles.press} ${pressStyles.bar}`}
                  aria-expanded={open}
                  aria-controls={panelId}
                  aria-busy={contactBusy || undefined}
                  aria-current={isActive && !open ? "page" : undefined}
                  onClick={(event) => {
                    press(
                      event,
                      () => {
                        setOpen((current) => !current);
                        closeAssistant({ focus: false });
                      },
                      { release: true },
                    );
                  }}
                >
                  <Icon size={22} strokeWidth={1} className={styles.icon} aria-hidden />
                  <span className={styles.label}>{label}</span>
                </button>
              ) : external ? (
                <PressLink
                  href={path}
                  external
                  showOpening
                  insetFocus
                  className={styles.link}
                  onAction={closeSheet}
                >
                  <Icon size={22} strokeWidth={1} className={styles.icon} aria-hidden />
                  <span className={styles.label}>{label}</span>
                </PressLink>
              ) : (
                <PressLink
                  href={path}
                  insetFocus
                  className={styles.link}
                  aria-current={isActive ? "page" : undefined}
                  onAction={closeSheet}
                >
                  <Icon size={22} strokeWidth={1} className={styles.icon} aria-hidden />
                  <span className={styles.label}>{label}</span>
                </PressLink>
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
            <div className={styles.sheetPhoto}>
              <Image
                src="/portfolio/portfolioA001.webp"
                alt=""
                fill
                className={styles.atmosphereImage}
                sizes="100vw"
              />
              <div className={styles.sheetPhotoScrim} aria-hidden="true" />
              <h2 id={`${panelId}-title`} className={styles.sheetTitle}>
                Call us
              </h2>
            </div>

            <div className={styles.sheetInner}>
              <header className={styles.sheetHeader}>
                <p className={styles.eyebrow}>Ken Beauty Salon</p>
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
                      <PressLink
                        href={getTelLink(store.phone)}
                        external
                        showOpening
                        className={styles.numberRow}
                        onAction={() =>
                          recordOutbound(getTelLink(store.phone), {
                            branch: branchKey(store.name),
                          })
                        }
                      >
                        <Phone size={18} aria-hidden />
                        <span className={styles.numberMeta}>
                          <span className={styles.numberKind}>Landline</span>
                          <span className={styles.numberValue}>{store.phone}</span>
                        </span>
                      </PressLink>
                      <PressLink
                        href={getTelLink(store.mobile)}
                        external
                        showOpening
                        className={styles.numberRow}
                        onAction={() =>
                          recordOutbound(getTelLink(store.mobile), {
                            branch: branchKey(store.name),
                          })
                        }
                      >
                        <Phone size={18} aria-hidden />
                        <span className={styles.numberMeta}>
                          <span className={styles.numberKind}>Mobile</span>
                          <span className={styles.numberValue}>{store.mobile}</span>
                        </span>
                      </PressLink>
                      <PressLink
                        href={buildWhatsAppUrl({
                          number: whatsappDigits,
                          message: `Hello KEN Beauty Center (${label}), I would like to book a service.`,
                        })}
                        external
                        blank
                        showOpening
                        className={styles.whatsappRow}
                        onAction={(liveHref) => {
                          recordOutbound(liveHref, {
                            branch: branchKey(store.name),
                            gtm: true,
                            gtmBranch: label,
                          });
                        }}
                      >
                        <MessageCircle size={18} aria-hidden />
                        <span>WhatsApp {label}</span>
                      </PressLink>
                    </li>
                  );
                })}
              </ul>

              <PressLink
                href="/contact"
                className={styles.pageLink}
                onAction={closeSheet}
              >
                <span>Visit contact page</span>
                <ArrowUpRight size={16} aria-hidden />
              </PressLink>
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}
