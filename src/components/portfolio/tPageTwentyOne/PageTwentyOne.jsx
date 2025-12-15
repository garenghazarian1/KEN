"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PageTwentyOne.modern.module.css";

const services = [
  { num: "01", title: "Regular Cut", text: "Fresh and polished look with expertly executed haircuts. Tailored to your style, leaving you sharp and confident." },
  { num: "02", title: "Shaving", text: "Ultimate grooming with classic shaving. Precise techniques and high-quality products for smooth, refreshed skin." },
  { num: "03", title: "Beard Trim Line-Up", text: "Professional beard trimming and lining. Sculpted to perfection, enhancing your facial features." },
  { num: "04", title: "Beard Dyeing", text: "Enhanced color and definition for your beard. Natural-looking results that complement your style." },
  { num: "05", title: "Manicure & Pedicure", text: "Pampering session designed for men. Groomed and buffed nails for hands and feet." },
  { num: "06", title: "Facials", text: "Rejuvenating treatments for men's skincare. Refreshed, hydrated, and glowing skin." },
];

export default function PageTwentyOne() {
  const [currentAd, setCurrentAd] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero with Full Video */}
      <section className={styles.heroSection}>
        <video
          src="/portfolio/description05.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={styles.video}
        />
        
        {/* Cycling Ad Card */}
        <div className={styles.adContainer}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAd}
              className={styles.adCard}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className={styles.adNum}>{services[currentAd].num}</span>
              <h3 className={styles.adTitle}>{services[currentAd].title}</h3>
              <p className={styles.adText}>{services[currentAd].text}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className={styles.adDots}>
            {services.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentAd ? styles.dotActive : ""}`}
                onClick={() => setCurrentAd(index)}
                aria-label={`View service ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className={styles.listSection}>
        <motion.div
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.titleText}>
            Men&apos;s <span className={styles.titleAccent}>Grooming</span>
          </h2>
        </motion.div>

        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <motion.article
              key={service.num}
              className={styles.serviceCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <span className={styles.serviceNum}>{service.num}</span>
              <h3 className={styles.serviceHeader}>{service.title}</h3>
              <p className={styles.serviceText}>{service.text}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
