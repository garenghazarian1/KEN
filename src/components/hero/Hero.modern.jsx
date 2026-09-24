"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import OfferPromo from "@/components/campaign/OfferPromo";
import styles from "./Hero.modern.module.css";

const HERO_VIDEO_SRC = "/hero-vid-01.mp4";
const HERO_VIDEO_POSTER = "/hero-vid-01-poster.jpg";
const HERO_VIDEO_PROPS = {
  autoPlay: true,
  muted: true,
  loop: true,
  playsInline: true,
  preload: "auto",
  poster: HERO_VIDEO_POSTER,
  fetchPriority: "high",
};

const slides = [
  {
    image: "/heroGridImage/hero001.webp",
    title: "Hair Styling Excellence",
    subtitle: "Transform your look with our expert stylists",
  },
  {
    image: "/heroGridImage/hero002.webp",
    title: "Hair Coloring & Makeup",
    subtitle: "Transform your look with vibrant colors and flawless makeup",
  },
  {
    image: "/heroGridImage/hero003.webp",
    title: "Facial Treatments",
    subtitle: "Rejuvenate and refresh your skin",
  },
  {
    image: "/heroGridImage/hero004.webp",
    title: "Complete Makeover",
    subtitle: "Your beauty journey starts here",
  },
  {
    image: "/heroGridImage/hero007.webp",
    title: "Men's Grooming",
    subtitle: "Professional styling for gentlemen",
  },
  {
    image: "/heroGridImage/hero008.webp",
    title: "Men's Barbershop",
    subtitle: "Professional haircuts and grooming services",
  },
  {
    image: "/heroGridImage/hero009.webp",
    title: "Luxury Experience",
    subtitle: "Where beauty meets perfection",
  },
];

const rise = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function GalleryStack() {
  return (
    <div className={styles.galleryStack}>
      {slides.map((slide) => (
        <motion.article
          key={slide.image}
          className={styles.galleryItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.28 }}
          variants={rise}
        >
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
        </motion.article>
      ))}
    </div>
  );
}

export default function HeroModern({ campaign = null }) {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.media}>
          <video
            src={HERO_VIDEO_SRC}
            className={styles.heroVideo}
            data-hero-video=""
            {...HERO_VIDEO_PROPS}
          />
        </div>

        {campaign ? <OfferPromo campaign={campaign} /> : null}

        <div className={styles.copy}>
          <motion.h1
            className={styles.mainTitle}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.titleLine1}>Your Beauty</span>
            <span className={styles.titleLine2}>Haven</span>
          </motion.h1>
          <p className={styles.subtitle}>
            Discover luxury beauty services in the heart of the UAE
          </p>
        </div>

        <div className={styles.ctaBar}>
          <Link href="/services" className={styles.discoverLink}>
            Discover our services
          </Link>
        </div>
      </section>

      {/* Gallery Section — stacked images, free scroll */}
      <section className={styles.gallerySection}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleMain}>Our</span>{" "}
            <span className={styles.titleAccent}>Work</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Browse our services — scroll to explore each look
          </p>
        </motion.div>

        <GalleryStack />

        {/* Content Card */}
        <motion.div
          className={styles.welcome}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={rise}
        >
          <div className={styles.copy}>
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
          <div className={styles.ctaBar}>
            <Link href="/services" className={styles.discoverLink}>
              Explore Services
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
