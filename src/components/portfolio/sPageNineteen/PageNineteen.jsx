"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PageNineteen.modern.module.css";

const services = [
  { num: "01", title: "Hair Styling", text: "Let our expert stylists craft timeless blowouts and intricate updos. Signature haircuts tailored to your unique style and personality." },
  { num: "02", title: "Hair Coloring", text: "Masters in creating natural-looking highlights and breathtaking balayage. Bespoke color solutions that embrace your individuality." },
  { num: "03", title: "Hair Treatments", text: "Indulgent treatments to replenish and rejuvenate your locks. Deep conditioning and keratin treatments for healthy hair growth." },
  { num: "04", title: "Hair Extensions", text: "Premium extensions with seamless blend and natural finish. Length or volume to take your look to celebrity status." },
  { num: "05", title: "Bridal Hairstyles", text: "Unforgettable bridal hairstyles that enhance your natural beauty. Sophisticated updos to romantic waves." },
  { num: "06", title: "Hair Curling & Straightening", text: "Perfect balance of sleekness or bounce. Expert techniques guarantee lasting results." },
  { num: "07", title: "Makeup Services", text: "Camera-ready looks with natural and glamorous styles. Flawless finish for any occasion." },
  { num: "08", title: "Nail Care", text: "Luxurious nail care with impeccable finishes. Classic manicures to trendy nail art." },
  { num: "09", title: "Solarium", text: "Sun-kissed glow without harmful UV exposure. Safe way to achieve a bronzed complexion." },
  { num: "10", title: "Eyebrows Styling", text: "Perfectly groomed eyebrows tailored to your features. Natural shapes to bold arches." },
  { num: "11", title: "Facials", text: "Customized facials for your skincare needs. Glowing, refreshed, and revitalized skin." },
  { num: "12", title: "VIP Room", text: "Exclusive VIP room with personalized service. Luxury surroundings for a premium experience." },
];

export default function PageNineteen() {
  const [currentAd, setCurrentAd] = useState(0);

  // Cycle through ads every 3 seconds
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
          src="/portfolio/description04.mp4"
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
          
          {/* Progress dots */}
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
            Our <span className={styles.titleAccent}>Services</span>
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
              transition={{ duration: 0.4, delay: index * 0.05 }}
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
