"use client";

import { useRef } from "react";
import Image from "next/image";
import CampaignFilm from "@/components/campaign/CampaignFilm";
import CampaignPoster from "@/components/campaign/CampaignPoster";
import HeroPress from "@/components/hero/HeroPress";
import { heroSlides } from "@/components/hero/heroSlides";
import { useReveal } from "@/components/useReveal";
import styles from "./Hero.modern.module.css";

function GalleryStack() {
  return (
    <div className={styles.galleryStack}>
      {heroSlides.map((slide) => (
        <article key={slide.image} className={styles.galleryItem} data-reveal="">
          <div className={styles.itemMedia}>
            <Image
              src={slide.image}
              alt={slide.title}
              className={styles.itemImage}
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
              loading="lazy"
            />
          </div>
          <div className={styles.itemCopy}>
            <h3 className={styles.contentTitle}>{slide.title}</h3>
            <p className={styles.contentSubtitle}>{slide.subtitle}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function HeroModern({ campaign = null }) {
  const rootRef = useRef(null);
  useReveal(rootRef);

  return (
    <div ref={rootRef}>
      {campaign?.media ? (
        <CampaignFilm campaign={campaign} />
      ) : campaign && !campaign.packages?.length ? (
        <CampaignPoster campaign={campaign} />
      ) : null}

      <section className={styles.gallerySection}>
        <div className={styles.sectionHeader} data-reveal="up">
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleMain}>Our</span>{" "}
            <span className={styles.titleAccent}>Work</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Browse our services — scroll to explore each look
          </p>
        </div>

        <GalleryStack />

        <div className={styles.welcome} data-reveal="">
          <div className={styles.welcomeCopy}>
            <h2 className={styles.cardTitle}>Welcome to Excellence</h2>
            <div className={styles.cardText}>
              <p>
                Visit our luxurious salon in the heart of the UAE to discover a
                world where brilliance and beauty meet. Our team of specialists
                is committed to providing a wide range of services, including
                hair styling and transformation for both men and women, nails,
                facials, and solarium treatments.
              </p>
              <p>
                We stand out as the top beauty salon in the United Arab Emirates
                because of our dedication to quality, professionalism, and
                customer satisfaction. Embrace the pleasure that you deserve and
                love an unforgettable experience that will leave you feeling
                healthy and brilliant.
              </p>
            </div>
          </div>
          <div className={styles.welcomeCta}>
            <HeroPress
              className={styles.welcomeLink}
              href="/services"
              label="Explore services"
            >
              Explore Services
            </HeroPress>
          </div>
        </div>
      </section>
    </div>
  );
}
