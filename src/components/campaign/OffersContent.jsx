"use client";

import Link from "next/link";
import { CONTACT } from "@/config/constants";
import { formatCampaignPrice, tCampaign } from "@/lib/business/campaigns";
import styles from "./OffersContent.module.css";

export default function OffersContent({ campaign, expired = false }) {
  if (!campaign) {
    return (
      <div className={styles.page}>
        <header className={styles.emptyHeader}>
          <p className={styles.badge}>Offers</p>
          <h1 className={styles.emptyTitle}>No active offers right now</h1>
          <Link href="/services" className={styles.bookBtn}>
            Discover our services
          </Link>
        </header>
      </div>
    );
  }

  const discount = campaign.discountPercent ?? 50;
  const theme = tCampaign(campaign.theme);
  const weekly = campaign.weeklyOffer;
  const bookUrl = (pkgName) =>
    CONTACT.whatsapp.url(
      pkgName
        ? `Hello KEN Beauty, I would like to book the ${pkgName}.`
        : "Hello KEN Beauty, I would like to book an August offer package."
    );

  return (
    <div className={styles.page}>
      <header className={styles.banner}>
        <p className={styles.badge}>
          {expired ? "Ended" : tCampaign(campaign.endsLabel)}
        </p>
        <p className={styles.discountLine}>
          <span className={styles.discount}>{discount}%</span>
          <span className={styles.off}>OFF</span>
        </p>
        <h1 className={styles.bannerTitle}>{theme}</h1>
      </header>

      <section className={styles.packages} aria-label="Signature packages">
        {campaign.packages.map((pkg) => {
          const saving = pkg.originalPrice - pkg.promoPrice;
          const percent = Math.round((saving / pkg.originalPrice) * 100);
          const name = tCampaign(pkg.name);

          return (
            <article key={pkg.id} className={styles.card}>
              <div className={styles.cardTop}>
                <h2 className={styles.cardTitle}>{name}</h2>
                <span className={styles.savePill}>-{percent}%</span>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.promoPrice}>
                  {formatCampaignPrice(pkg.promoPrice, pkg.currency)}
                </span>
                <s className={styles.originalPrice}>
                  {formatCampaignPrice(pkg.originalPrice, pkg.currency)}
                </s>
                <span className={styles.saveText}>
                  Save {formatCampaignPrice(saving, pkg.currency)}
                </span>
              </div>

              <ul className={styles.inclusions}>
                {pkg.inclusions.map((item, index) => (
                  <li key={`${pkg.id}-${index}`}>{tCampaign(item)}</li>
                ))}
              </ul>

              <a
                href={bookUrl(name)}
                className={styles.bookBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book this package
              </a>
            </article>
          );
        })}
      </section>

      {weekly ? (
        <section className={styles.weekly} aria-label="Weekly offer">
          <span className={styles.weeklyPercent}>
            -{weekly.discountPercent}%
          </span>
          <div className={styles.weeklyBody}>
            <h2 className={styles.weeklyTitle}>{tCampaign(weekly.title)}</h2>
            <p className={styles.weeklyDesc}>{tCampaign(weekly.description)}</p>
            <p className={styles.weeklyMeta}>
              {tCampaign(weekly.constraint)} · {tCampaign(weekly.duration)}
            </p>
          </div>
        </section>
      ) : null}

      <p className={styles.footNote}>{tCampaign(campaign.heroSubtitle)}</p>

      <Link href="/services" className={styles.secondaryLink}>
        Discover our services
      </Link>
    </div>
  );
}
