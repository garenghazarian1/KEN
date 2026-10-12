"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { CONTACT } from "@/config/constants";
import { recordOutbound } from "@/lib/leads/trackLead";
import { tCampaign } from "@/lib/business/campaigns";
import styles from "./CampaignPoster.module.css";

function linesOf(field, locale = "en") {
  const value = field?.[locale] || field?.en;
  if (Array.isArray(value) && value.length) return value;
  const text = tCampaign(field, locale);
  return text ? [text] : [];
}

/**
 * Editorial campaign band. Copy comes from the active campaign.
 * The book link opens WhatsApp with that campaign's message.
 */
export default function CampaignPoster({ campaign, placement = "home" }) {
  const [open, setOpen] = useState(false);
  if (!campaign) return null;

  const titleLines = linesOf(campaign.titleLines);
  const offer = tCampaign(campaign.primaryCta);
  const offerAr = tCampaign(campaign.primaryCta, "ar");
  const note = tCampaign(campaign.heroSubtitle);
  const bookLabel = tCampaign(campaign.bookLabel) || "Book";
  const message = tCampaign(campaign.bookMessage) || offer;
  const href = CONTACT.whatsapp.url(message);
  const serviceName = offer || tCampaign(campaign.theme);
  const details = Array.isArray(campaign.details) ? campaign.details : [];
  const readMore = tCampaign(campaign.readMoreLabel) || "Read more";
  const readLess = tCampaign(campaign.readLessLabel) || "Read less";

  return (
    <section
      className={`${styles.band}${placement === "page" ? ` ${styles.page}` : ""}`}
      aria-labelledby={`${campaign.id}-title`}
    >
      <div className={styles.copy}>
        <p className={styles.mark} lang="en">
          <span className={styles.markName}>KEN</span>
          <span className={styles.markScript}>Beauty Salon</span>
        </p>

        <h2 id={`${campaign.id}-title`} className={styles.title}>
          {titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        {offer ? <p className={styles.offer}>{offer}</p> : null}

        {offerAr && offerAr !== offer ? (
          <p className={styles.offerAr} lang="ar" dir="rtl">
            {offerAr}
          </p>
        ) : null}

        {note ? <p className={styles.note}>*{note}</p> : null}
      </div>

      <a
        href={href}
        className={styles.book}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          recordOutbound(href, {
            branch: "galleria",
            gtm: true,
            gtmBranch: "Galleria",
            placement: campaign.id,
            services: [{ id: campaign.id, name: serviceName }],
          })
        }
      >
        {bookLabel}
      </a>

      <div className={styles.ribbon} aria-hidden="true">
        <Image
          src="/pink-october-ribbon.png"
          alt=""
          width={420}
          height={633}
          className={styles.ribbonImage}
        />
      </div>

      {details.length ? (
        <div className={styles.explain}>
          <button
            type="button"
            className={styles.readMore}
            aria-expanded={open}
            aria-controls={`${campaign.id}-details`}
            onClick={() => {
              setOpen((value) => {
                const next = !value;
                if (next) {
                  const reduce = window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                  ).matches;
                  window.setTimeout(() => {
                    document
                      .getElementById(`${campaign.id}-details`)
                      ?.scrollIntoView({
                        block: "nearest",
                        behavior: reduce ? "auto" : "smooth",
                      });
                  }, reduce ? 0 : 280);
                }
                return next;
              });
            }}
          >
            {open ? readLess : readMore}
            <ChevronDown
              size={16}
              aria-hidden
              className={open ? styles.chevronOpen : styles.chevron}
            />
          </button>
          <div
            id={`${campaign.id}-details`}
            className={`${styles.detailsClip}${open ? ` ${styles.detailsOpen}` : ""}`}
          >
            <div className={styles.details}>
              {details.map((item) => {
                const title = tCampaign(item.title);
                const body = tCampaign(item.body);
                const bodyAr = tCampaign(item.body, "ar");
                return (
                  <article key={item.id} className={styles.detail}>
                    <h3 className={styles.detailTitle}>{title}</h3>
                    <p className={styles.detailBody}>{body}</p>
                    {bodyAr && bodyAr !== body ? (
                      <p className={styles.detailAr} lang="ar" dir="rtl">
                        {bodyAr}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
