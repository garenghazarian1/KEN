"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Briefcase } from "lucide-react";
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

const STACK_STEP_MOBILE = 0.62;
const STACK_STEP_DESKTOP = 0.48;

function getStackMetrics() {
  const viewportHeight = window.innerHeight;
  const stepRatio =
    window.innerWidth <= 768 ? STACK_STEP_MOBILE : STACK_STEP_DESKTOP;
  const scrollStep = viewportHeight * stepRatio;
  const pinScrollDistance = (images.length - 1) * scrollStep;
  const containerHeight = viewportHeight + pinScrollDistance;

  return { viewportHeight, scrollStep, pinScrollDistance, containerHeight };
}

const STACK_BG_BLUR = 24;

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function easeOutCubic(value) {
  return 1 - (1 - value) ** 3;
}

function getLayerMotion(index, stackProgress) {
  const delta = stackProgress - index;

  // Incoming image: eased slide up, foreground stays sharp
  if (delta < 0) {
    const enterProgress = clamp01(1 + delta);
    const easedEnter = easeOutCubic(enterProgress);
    return {
      translateY: (1 - easedEnter) * 100,
      bgBlurExtra: 0,
      contentOpacity:
        enterProgress > 0.72
          ? clamp01((enterProgress - 0.72) / 0.28)
          : 0,
    };
  }

  // Outgoing layer: extra background blur only after mostly covered
  const coverAmount = clamp01(delta);
  const blurStart = 0.88;
  let bgBlurExtra = 0;

  if (coverAmount > blurStart) {
    const blurProgress = (coverAmount - blurStart) / (1 - blurStart);
    bgBlurExtra = Math.min(12, blurProgress * 12);
  }

  return {
    translateY: 0,
    bgBlurExtra,
    contentOpacity: coverAmount < 0.9 ? 1 - coverAmount / 0.9 : 0,
  };
}

function applyStackMotion(layerRefs, bgRefs, contentRefs, stackProgress) {
  images.forEach((_, index) => {
    const layer = layerRefs.current[index];
    const bg = bgRefs.current[index];
    const content = contentRefs.current[index];
    if (!layer) return;

    const motion = getLayerMotion(index, stackProgress);
    layer.style.transform = `translate3d(0, ${motion.translateY}%, 0)`;

    if (bg) {
      bg.style.filter = `blur(${STACK_BG_BLUR + motion.bgBlurExtra}px)`;
    }

    if (content) {
      content.style.opacity = String(motion.contentOpacity);
      content.style.visibility =
        motion.contentOpacity > 0.01 ? "visible" : "hidden";
    }
  });
}

function GalleryImageStack() {
  const containerRef = useRef(null);
  const layerRefs = useRef([]);
  const bgRefs = useRef([]);
  const contentRefs = useRef([]);
  const pinModeRef = useRef("before");
  const containerHeightRef = useRef(0);
  const [pinMode, setPinMode] = useState("before");
  const [containerHeight, setContainerHeight] = useState(0);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const height = getStackMetrics().containerHeight;
    containerHeightRef.current = height;
    setContainerHeight(height);
    applyStackMotion(layerRefs, bgRefs, contentRefs, 0);
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateStack = () => {
      const container = containerRef.current;
      if (!container) return;

      const { scrollStep, pinScrollDistance, containerHeight: height } =
        getStackMetrics();
      const scrollY = window.scrollY;
      const containerTop =
        scrollY + container.getBoundingClientRect().top;
      const pinEnd = containerTop + pinScrollDistance;

      if (height !== containerHeightRef.current) {
        containerHeightRef.current = height;
        setContainerHeight(height);
      }

      if (scrollY < containerTop) {
        if (pinModeRef.current !== "before") {
          pinModeRef.current = "before";
          setPinMode("before");
        }
        applyStackMotion(layerRefs, bgRefs, contentRefs, 0);
        return;
      }

      if (scrollY >= pinEnd) {
        if (pinModeRef.current !== "after") {
          pinModeRef.current = "after";
          setPinMode("after");
        }
        applyStackMotion(
          layerRefs,
          bgRefs,
          contentRefs,
          images.length - 1
        );
        return;
      }

      if (pinModeRef.current !== "fixed") {
        pinModeRef.current = "fixed";
        setPinMode("fixed");
      }

      const progress = Math.min(
        pinScrollDistance,
        Math.max(0, scrollY - containerTop)
      );
      const nextProgress = progress / scrollStep;
      applyStackMotion(layerRefs, bgRefs, contentRefs, nextProgress);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateStack);
    };

    updateStack();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateStack);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateStack);
    };
  }, []);

  const viewportClassName = [
    styles.stackViewport,
    pinMode === "fixed" && styles.stackViewportFixed,
    pinMode === "after" && styles.stackViewportAfter,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className={styles.scrollStackPin}
      style={containerHeight ? { height: `${containerHeight}px` } : undefined}
    >
      <div className={viewportClassName}>
        {images.map((image, index) => {
          const description = descriptions[index] || descriptions[0];

          return (
            <div
              key={image}
              ref={(element) => {
                layerRefs.current[index] = element;
              }}
              className={styles.stackLayer}
              style={{ zIndex: index + 1 }}
            >
              <div
                ref={(element) => {
                  bgRefs.current[index] = element;
                }}
                className={styles.stackImageBg}
                style={{
                  filter: `blur(${STACK_BG_BLUR}px)`,
                }}
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

              <div
                ref={(element) => {
                  contentRefs.current[index] = element;
                }}
                className={styles.stackContent}
                style={{
                  opacity: index === 0 ? 1 : 0,
                  visibility: index === 0 ? "visible" : "hidden",
                }}
                aria-hidden={index !== 0}
              >
                <h3 className={styles.contentTitle}>{description.title}</h3>
                <p className={styles.contentSubtitle}>{description.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
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
        >
          <motion.div
            className={styles.scrollDot}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
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
            <span className={styles.titleMain}>Your Beauty</span>{" "}
            <span className={styles.titleAccent}>Haven</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Discover luxury beauty services in the heart of the UAE
          </p>
        </motion.div>

        <GalleryImageStack />

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
