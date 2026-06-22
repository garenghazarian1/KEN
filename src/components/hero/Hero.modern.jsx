"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { CAREERS_URL } from "@/config/constants";
import styles from "./Hero.modern.module.css";

const HERO_VIDEO_SRC = "/hero-vid-01.mp4";
const HERO_VIDEO_PROPS = {
  autoPlay: true,
  muted: true,
  loop: true,
  playsInline: true,
  preload: "auto",
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

const STACK_BG_BLUR = 24;

const galleryItemVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const imageReveal = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const bgReveal = {
  hidden: { opacity: 1, scale: 1.08 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.85, ease: "easeOut" },
  },
};

const captionReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const galleryViewport = { once: true, amount: 0.2 };

function GalleryStack() {
  return (
    <div className={styles.galleryStack}>
      {slides.map((slide, index) => (
        <motion.div
          key={slide.image}
          className={styles.galleryItem}
          initial="hidden"
          whileInView="visible"
          viewport={galleryViewport}
          variants={galleryItemVariants}
        >
          <motion.div
            className={styles.stackImageBg}
            style={{ filter: `blur(${STACK_BG_BLUR}px)` }}
            aria-hidden
            variants={bgReveal}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              className={styles.stackImageBgImg}
              sizes="(max-width: 800px) 100vw, 800px"
              loading={index < 2 ? "eager" : "lazy"}
              priority={index === 0}
            />
          </motion.div>

          <motion.div className={styles.stackImageForeground} variants={imageReveal}>
            <Image
              src={slide.image}
              alt={slide.title}
              className={styles.stackImageMain}
              width={800}
              height={800}
              sizes="(max-width: 800px) 100vw, 800px"
              loading={index < 2 ? "eager" : "lazy"}
              priority={index === 0}
            />
          </motion.div>

          <motion.div className={styles.stackContent} variants={captionReveal}>
            <h3 className={styles.contentTitle}>{slide.title}</h3>
            <p className={styles.contentSubtitle}>{slide.subtitle}</p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

export default function HeroModern() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroMediaBg} aria-hidden>
          <video
            src={HERO_VIDEO_SRC}
            className={styles.heroVideoBg}
            {...HERO_VIDEO_PROPS}
          />
          <div className={styles.heroBgOverlay} />
        </div>

        <div className={styles.heroMediaForeground} aria-hidden>
          <video
            src={HERO_VIDEO_SRC}
            className={styles.heroVideoMain}
            {...HERO_VIDEO_PROPS}
          />
        </div>

        <div className={styles.heroOverlay} />

        <motion.aside
          className={styles.careersBanner}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          aria-label="Careers at Ken Beauty Salon"
        >
          <Briefcase size={18} aria-hidden className={styles.careersBannerIcon} />
          <p className={styles.careersBannerText}>Are you looking for a job?</p>
          <a href={CAREERS_URL} className={styles.careersBannerButton}>
            <span>Apply here</span>
            <ArrowRight size={16} aria-hidden />
          </a>
        </motion.aside>

        <div className={styles.heroContent}>
          <motion.div
            className={styles.contentWrapper}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className={styles.mainTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className={styles.titleLine1}>Your Beauty</span>
              <span className={styles.titleLine2}>Haven</span>
            </motion.h1>

            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Discover luxury beauty services in the heart of the UAE
            </motion.p>

            <motion.div
              className={styles.ctaWrapper}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className={styles.ctaButtons}>
                <Link href="/services" className={styles.discoverLink}>
                  Discover our services
                </Link>
                <a
                  href="https://wa.me/971503043570?text=Hello%20KEN%20Beauty%20Center%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
                  className={styles.secondaryButton}
                  aria-label="Contact us on WhatsApp"
                >
                  <FaWhatsapp size={30} className={styles.waIcon} aria-hidden />
                </a>
              </div>
            </motion.div>
          </motion.div>
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
          className={styles.contentCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>Welcome to Excellence</h2>
            <div className={styles.cardText}>
              <p className={styles.cardTextParagraph}>
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
            <Link href="/services" className={styles.cardButton}>
              <span>Explore Services</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
