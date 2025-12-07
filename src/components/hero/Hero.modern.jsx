"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { CONTACT, BOOKING_URL } from "@/config/constants";
import styles from "./Hero.modern.module.css";

const images = [
  "/heroGridImage/hero001.jpg",
  "/heroGridImage/hero002.jpg",
  "/heroGridImage/hero003.jpg",
  "/heroGridImage/hero004.jpg",
  "/heroGridImage/hero007.jpg",
  "/heroGridImage/hero008.jpg",
  "/heroGridImage/hero009.jpg",
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

export default function HeroModern() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Modern Hero Section - Full Screen Video Background */}
      <section className={styles.heroSection}>
        {/* Video Background */}
        <div className={styles.videoBackground}>
          <video
            src="/hero-vid-01.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={styles.heroVideo}
          />
          <div className={styles.videoOverlay} />
        </div>

        {/* Hero Content - Centered Modern Layout */}
        <div className={styles.heroContent}>
          <motion.div
            className={styles.contentWrapper}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Decorative Icon */}
            <motion.div
              className={styles.decorativeIcon}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            >
              <Sparkles size={40} />
            </motion.div>

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
                href={CONTACT.whatsapp.url()}
                target="_blank"
                rel="noopener noreferrer"
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

        {/* Simple Scroll Image Stack - Reliable Approach */}
        <div className={styles.scrollStackContainer}>
          {images.map((image, index) => {
            const description = descriptions[index] || descriptions[0];

            return (
              <motion.section
                key={index}
                className={styles.stackSection}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.8 }}
              >
                {/* Image Container */}
                <motion.div
                  className={styles.stackImageContainer}
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className={styles.stackImageWrapper}>
                    <Image
                      src={image}
                      alt={description.title}
                      className={styles.stackImage}
                      width={1200}
                      height={800}
                      loading={index < 2 ? "eager" : "lazy"}
                      priority={index === 0}
                    />
                  </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                  className={styles.stackContent}
                  initial={{ opacity: 0, x: "-50%", y: "calc(-50% + 30px)" }}
                  whileInView={{ opacity: 1, x: "-50%", y: "-50%" }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <motion.div
                    className={styles.contentIcon}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles size={32} />
                  </motion.div>
                  <h3 className={styles.contentTitle}>{description.title}</h3>
                  <p className={styles.contentSubtitle}>
                    {description.subtitle}
                  </p>
                </motion.div>
              </motion.section>
            );
          })}
        </div>

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
            <Link href={BOOKING_URL} className={styles.cardButton}>
              <span>Explore Services</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
