"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { formatCampaignPrice, tCampaign } from "@/lib/business/campaigns";
import styles from "./OfferPromo.module.css";

const REVEAL_DELAY_MS = 2000;
const VISIBLE_MS = 12000;

/** Remaining time until Dubai end-of-day on the campaign's last date. */
function getRemaining(endsOn) {
  const target = new Date(`${endsOn}T23:59:59+04:00`).getTime();
  if (!Number.isFinite(target)) return null;
  const diff = target - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (value) => String(value).padStart(2, "0");

/**
 * Centered glass campaign takeover.
 * Reveals after 2s, holds 12s, then minimizes to a tappable water-drop.
 *
 * @param {"hero"|"page"} variant - `hero` overlays the hero section only and
 *   leaves its CTA bar clear; `page` floats fixed over any other route.
 */
export default function OfferPromo({
  campaign,
  locale = "en",
  variant = "hero",
}) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState("pending");
  const [remaining, setRemaining] = useState(null);
  const minimizeTimer = useRef(null);

  const scheduleMinimize = useCallback(() => {
    if (minimizeTimer.current) clearTimeout(minimizeTimer.current);
    minimizeTimer.current = setTimeout(
      () => setPhase("minimized"),
      VISIBLE_MS
    );
  }, []);

  useEffect(() => {
    const revealTimer = setTimeout(() => setPhase("open"), REVEAL_DELAY_MS);
    return () => clearTimeout(revealTimer);
  }, []);

  useEffect(() => {
    if (phase !== "open") return undefined;
    scheduleMinimize();
    return () => {
      if (minimizeTimer.current) clearTimeout(minimizeTimer.current);
    };
  }, [phase, scheduleMinimize]);

  useEffect(() => {
    if (phase !== "open" || !campaign?.endsOn) return undefined;
    setRemaining(getRemaining(campaign.endsOn));
    const tick = setInterval(
      () => setRemaining(getRemaining(campaign.endsOn)),
      1000
    );
    return () => clearInterval(tick);
  }, [phase, campaign?.endsOn]);

  useEffect(() => {
    if (phase !== "open") return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setPhase("minimized");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase]);

  if (!campaign) return null;

  const discount = campaign.discountPercent ?? 50;
  const theme = tCampaign(campaign.theme, locale);
  const primaryCta = tCampaign(campaign.primaryCta, locale);
  const weekly = campaign.weeklyOffer;
  const endsLabel = tCampaign(campaign.endsLabel, locale);
  const bestSaving = campaign.packages.reduce((best, pkg) => {
    const saving = pkg.originalPrice - pkg.promoPrice;
    return saving > best ? saving : best;
  }, 0);

  const holdOpen = () => {
    if (minimizeTimer.current) clearTimeout(minimizeTimer.current);
  };

  return (
    <div
      className={`${styles.layer}${
        variant === "page" ? ` ${styles.layerFixed}` : ""
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {phase === "open" ? (
          <motion.div
            key="open"
            className={styles.backdrop}
            role="dialog"
            aria-label={theme}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
            onMouseEnter={holdOpen}
            onTouchStart={holdOpen}
          >
            <motion.div
              className={styles.card}
              initial={
                reduceMotion ? false : { opacity: 0, scale: 0.92, y: 18 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.7, y: 120 }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 260, damping: 22 }
              }
            >
              <button
                type="button"
                className={styles.close}
                onClick={() => setPhase("minimized")}
                aria-label="Minimize offer"
              >
                <X size={18} aria-hidden />
              </button>

              <p className={styles.ribbon}>
                <Sparkles size={14} aria-hidden />
                <span>{theme}</span>
              </p>

              <div className={styles.discountRow}>
                <span className={styles.discount}>{discount}%</span>
                <span className={styles.discountSide}>
                  <span className={styles.off}>OFF</span>
                  <span className={styles.kicker}>
                    {tCampaign(campaign.heroKicker, locale)}
                  </span>
                </span>
              </div>

              <p className={styles.lead}>{primaryCta}</p>

              {bestSaving > 0 ? (
                <p className={styles.saving}>
                  Save up to{" "}
                  <strong>{formatCampaignPrice(bestSaving, "AED", locale)}</strong>{" "}
                  on signature packages
                </p>
              ) : null}

              <ul className={styles.deals} role="list">
                {campaign.packages.map((pkg) => (
                  <li key={pkg.id} className={styles.deal}>
                    <span className={styles.dealName}>
                      {tCampaign(pkg.name, locale)}
                    </span>
                    <span className={styles.dealPrices}>
                      <span className={styles.promo}>
                        {formatCampaignPrice(
                          pkg.promoPrice,
                          pkg.currency,
                          locale
                        )}
                      </span>
                      <s className={styles.original}>
                        {formatCampaignPrice(
                          pkg.originalPrice,
                          pkg.currency,
                          locale
                        )}
                      </s>
                    </span>
                  </li>
                ))}
              </ul>

              {remaining ? (
                <div className={styles.countdown} aria-live="off">
                  <span className={styles.countdownLabel}>Ends in</span>
                  <span className={styles.countdownUnits}>
                    <span className={styles.unit}>{pad(remaining.days)}d</span>
                    <span className={styles.unit}>{pad(remaining.hours)}h</span>
                    <span className={styles.unit}>
                      {pad(remaining.minutes)}m
                    </span>
                    <span className={styles.unit}>
                      {pad(remaining.seconds)}s
                    </span>
                  </span>
                </div>
              ) : (
                <p className={styles.countdownLabel}>{endsLabel}</p>
              )}

              <Link
                href="/offers"
                className={styles.cta}
                onClick={() => setPhase("minimized")}
              >
                Grab the offer
              </Link>

              {weekly ? (
                <p className={styles.weekly}>
                  {tCampaign(weekly.title, locale)} —{" "}
                  {tCampaign(weekly.description, locale)}
                </p>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {phase === "minimized" ? (
          <motion.button
            key="pill"
            type="button"
            className={styles.pill}
            onClick={() => setPhase("open")}
            aria-label={`${theme} — reopen offer`}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 320, damping: 20 }
            }
          >
            <span className={styles.ripple} aria-hidden />
            <span className={styles.ripple} aria-hidden />
            <span className={styles.ripple} aria-hidden />
            <span className={styles.pillDiscount}>{discount}%</span>
            <span className={styles.pillText}>OFF</span>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
