"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "./PageTwentyThree.modern.module.css";

const celebImages = [
  "/portfolio/celeb/CelebAmeniEsseibii01.webp",
  "/portfolio/celeb/CelebArmanHovhannesyan.webp",
  "/portfolio/celeb/CelebHudaHusain01.webp",
  "/portfolio/celeb/CelebLoujainAdada01.webp",
  "/portfolio/celeb/CelebLoujainAdada02.webp",
  "/portfolio/celeb/CelebLoujainAdada03.webp",
  "/portfolio/celeb/CelebLoujainAdada04.webp",
  "/portfolio/celeb/CelebMahiraabdAlAziz01.webp",
  "/portfolio/celeb/CelebMahiraabdAlAziz02.webp",
  "/portfolio/celeb/CelebMahiraabdAlAziz03.webp",
  "/portfolio/celeb/CelebMahiraabdAlAziz04.webp",
  "/portfolio/celeb/CelebMahiraabdAlAziz05.webp",
  "/portfolio/celeb/CelebMahiraabdAlAziz06.webp",
  "/portfolio/celeb/CelebMahiraabdAlAziz07.webp",
  "/portfolio/celeb/CelebMartinaStrong.webp",
  "/portfolio/celeb/CelebModelRoz.webp",
  "/portfolio/celeb/CelebModelRoz01.webp",
  "/portfolio/celeb/CelebNishanDerharoutyounian01.webp",
  "/portfolio/celeb/CelebNishanDerharoutyounian0103.webp",
  "/portfolio/celeb/CelebNishanDerharoutyounian02.webp",
];

export default function PageTwentyThree() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % celebImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.container}>
      {/* Text Section */}
      <motion.div
        className={styles.textSection}
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.header}>
          Celebrities
          <span className={styles.headerAccent}>We Work With</span>
        </h2>
        <p className={styles.text}>
          We&apos;ve etched our name as the pinnacle of service and artistry
          in the hair and beauty domain, where every moment is infused with
          passion and dedication. Our unyielding commitment to excellence has
          forged bonds of trust with cherished celebrities, who turn to us for
          their most intimate beauty journeys.
        </p>
      </motion.div>

      {/* Image Section */}
      <div className={styles.imageSection}>
        <div className={styles.carouselWrapper}>
          <div className={styles.imageFrame}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className={styles.imageWrapper}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Image
                  src={celebImages[currentIndex]}
                  alt={`Celebrity ${currentIndex + 1}`}
                  fill
                  sizes="(max-width: 600px) 300px, (max-width: 1024px) 400px, 450px"
                  className={styles.carouselImage}
                  priority={currentIndex === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className={styles.dotsContainer}>
            {celebImages.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ""}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`View celebrity ${index + 1}`}
              />
            ))}
          </div>

          <div className={styles.counter}>
            <span className={styles.counterCurrent}>
              {String(currentIndex + 1).padStart(2, "0")}
            </span>
            <span>/ {celebImages.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
