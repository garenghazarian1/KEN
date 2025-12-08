"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "./PageTwentyThree.module.css";
import { bad } from "@/app/ui/fonts";

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
      setCurrentIndex((prevIndex) => (prevIndex + 1) % celebImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sectionB}>
          <h2 className={`${styles.header} ${bad.className}`}>
            Celebrities We Work With
          </h2>
          <p className={styles.text}>
            We&apos;ve etched our name as the pinnacle of service and artistry
            in the hair and beauty domain, where every moment is infused with
            passion and dedication. Our unyielding commitment to excellence has
            forged bonds of trust with cherished celebrities, who turn to us for
            their most intimate beauty journeys. It fills us with profound pride
            to have walked alongside luminaries from diverse backgrounds,
            sharing in their dreams and aspirations.
          </p>
        </div>

        <div>
          <div className={styles.sectionA}>
            <div className={styles.imageCarousel}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className={styles.imageWrapper}
                >
                  <Image
                    src={celebImages[currentIndex]}
                    alt={`Celebrity ${currentIndex + 1}`}
                    width={800}
                    height={1000}
                    className={styles.carouselImage}
                    priority={currentIndex === 0}
                    loading={currentIndex === 0 ? "eager" : "lazy"}
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Dots indicator */}
              <div className={styles.dotsContainer}>
                {celebImages.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${
                      index === currentIndex ? styles.active : ""
                    }`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
