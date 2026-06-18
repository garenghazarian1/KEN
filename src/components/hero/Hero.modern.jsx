"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Briefcase, ChevronDown } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { BOOKING_URL, CAREERS_URL } from "@/config/constants";
import styles from "./Hero.modern.module.css";

const HERO_VIDEO_SRC = "/hero-vid-01.mp4";
const HERO_VIDEO_PROPS = {
  autoPlay: true,
  muted: true,
  loop: true,
  playsInline: true,
  preload: "auto",
};

const images = [
  "/heroGridImage/hero001.webp",
  "/heroGridImage/hero002.webp",
  "/heroGridImage/hero003.webp",
  "/heroGridImage/hero004.webp",
  "/heroGridImage/hero007.webp",
  "/heroGridImage/hero008.webp",
  "/heroGridImage/hero009.webp",
];

const descriptions = [
  {
    title: "Hair Styling Excellence",
    subtitle: "Transform your look with our expert stylists",
  },
  {
    title: "Hair Coloring & Makeup",
    subtitle: "Transform your look with vibrant colors and flawless makeup",
  },
  {
    title: "Facial Treatments",
    subtitle: "Rejuvenate and refresh your skin",
  },
  {
    title: "Complete Makeover",
    subtitle: "Your beauty journey starts here",
  },
  {
    title: "Men's Grooming",
    subtitle: "Professional styling for gentlemen",
  },
  {
    title: "Men's Barbershop",
    subtitle: "Professional haircuts and grooming services",
  },
  {
    title: "Luxury Experience",
    subtitle: "Where beauty meets perfection",
  },
];

const STACK_BG_BLUR = 24;

const GALLERY_SWIPER_CONFIG = {
  direction: "vertical",
  slidesPerView: 1,
  speed: 420,
  resistanceRatio: 0.85,
  touchRatio: 1,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.2,
  followFinger: true,
  preventInteractionOnTransition: false,
  watchOverflow: true,
  grabCursor: true,
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
  mousewheel: {
    forceToAxis: true,
    sensitivity: 1,
    thresholdDelta: 40,
    thresholdTime: 350,
    releaseOnEdges: true,
  },
  pagination: {
    clickable: true,
    dynamicBullets: false,
  },
};

function GalleryCarousel() {
  return (
    <div className={styles.galleryCarousel}>
      <Swiper
        className={styles.gallerySwiper}
        modules={[Mousewheel, Pagination, Keyboard, A11y]}
        {...GALLERY_SWIPER_CONFIG}
        a11y={{
          prevSlideMessage: "Previous gallery image",
          nextSlideMessage: "Next gallery image",
        }}
      >
        {images.map((image, index) => {
          const description = descriptions[index] || descriptions[0];

          return (
            <SwiperSlide key={image} className={styles.gallerySlide}>
              <div className={styles.gallerySlideInner}>
                <div
                  className={styles.stackImageBg}
                  style={{ filter: `blur(${STACK_BG_BLUR}px)` }}
                  aria-hidden
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className={styles.stackImageBgImg}
                    sizes="100vw"
                    loading={index < 2 ? "eager" : "lazy"}
                    priority={index === 0}
                  />
                </div>

                <div className={styles.stackImageForeground}>
                  <Image
                    src={image}
                    alt={description.title}
                    className={styles.stackImageMain}
                    width={800}
                    height={800}
                    loading={index < 2 ? "eager" : "lazy"}
                    priority={index === 0}
                  />
                </div>

                <div className={styles.stackContent}>
                  <h3 className={styles.contentTitle}>{description.title}</h3>
                  <p className={styles.contentSubtitle}>{description.subtitle}</p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default function HeroModern() {
  return (
    <>
      {/* Modern Hero Section — blurred full-bleed + sharp centered video */}
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
          <Briefcase
            size={18}
            aria-hidden
            className={styles.careersBannerIcon}
          />
          <p className={styles.careersBannerText}>Are you looking for a job?</p>
          <a href={CAREERS_URL} className={styles.careersBannerButton}>
            <span>Apply here</span>
            <ArrowRight size={16} aria-hidden />
          </a>
        </motion.aside>

        {/* Hero Content - Centered Modern Layout */}
        <div className={styles.heroContent}>
          <motion.div
            className={styles.contentWrapper}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Main Title */}
            <motion.h1
              className={styles.mainTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className={styles.titleLine1}>Your Beauty</span>
              <span className={styles.titleLine2}>Haven</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Discover luxury beauty services in the heart of the UAE
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className={styles.ctaButtons}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link href={BOOKING_URL} className={styles.primaryButton}>
                <span>Book Appointment</span>
                <ArrowRight size={20} />
              </Link>
              <a
                href="https://wa.me/971503043570?text=Hello%20KEN%20Beauty%20Center%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
                className={styles.secondaryButton}
                aria-label="Contact us on WhatsApp"
              >
                <MessageCircle size={20} />
                <span>Chat with Us</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          aria-hidden
        >
          <span className={styles.scrollLabel}>Scroll</span>
          <motion.div
            className={styles.scrollChevron}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={22} strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </section>

      {/* Modern Carousel Gallery Section - 2025 Design */}
      <section className={styles.gallerySection}>
        {/* Section Header */}
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
            Browse our services — swipe to explore each look
          </p>
        </motion.div>

        <GalleryCarousel />

        {/* Content Card - Modern Glass Design */}
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
