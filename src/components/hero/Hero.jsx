"use client";

import styles from "./Hero.module.css";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CONTACT } from "@/config/constants";

const imagesSet = [
  [
    "/heroGridImage/hero001.jpg",
    "/heroGridImage/hero002.jpg",
    "/heroGridImage/hero003.jpg",
    "/heroGridImage/hero004.jpg",
  ],
  [
    "/heroGridImage/hero007.jpg",
    "/heroGridImage/hero008.jpg",
    "/heroGridImage/hero009.jpg",
    "/heroGridImage/hero003.jpg",
  ],
];

export default function Hero() {
  const [activeIndices, setActiveIndices] = useState([0, 0]); // Active image index for each box
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const intervals = imagesSet.map(
      (_, boxIndex) =>
        setInterval(() => {
          setActiveIndices((prevIndices) => {
            const newIndices = [...prevIndices];
            newIndices[boxIndex] =
              (newIndices[boxIndex] + 1) % imagesSet[boxIndex].length;
            return newIndices;
          });
        }, 3000 + boxIndex * 1000) // Box 1: 3000ms, Box 2: 4000ms
    );

    return () => intervals.forEach((interval) => clearInterval(interval)); // Cleanup intervals on unmount
  }, []);
  return (
    <>
      <div className={styles.page}>
        {/* Top Glass Div */}
        <div className={styles.glassTop} />
        <div className={styles.videoContainer}>
          {/* Primary video - loads on mobile, full preload on desktop */}
          <video
            src="/hero-vid-01.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload={isMobile ? "metadata" : "auto"}
            className={styles.heroVideo}
          />
          {/* Secondary video - metadata only, hidden on mobile */}
          <video
            src="/hero-vid-02.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className={styles.heroVideo}
          />
          {/* Tertiary video - lazy load, hidden on mobile and smaller tablets */}
          <video
            src="/hero-vid-03.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className={styles.heroVideo}
          />
        </div>
        <div className={styles.buttonContainer}>
          <a
            href={CONTACT.whatsapp.url()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
            aria-label="Contact us on WhatsApp"
          >
            <FaWhatsapp size={32} />
          </a>
        </div>
        {/* Bottom Glass Div */}
        <div className={styles.glassBottom} />
      </div>

      <div className={styles.gridImageContainer}>
        <div className={styles.glassTop} />

        <div className={styles.grid}>
          {imagesSet.map((images, boxIndex) => (
            <div key={boxIndex} className={styles.gridBox}>
              {images.map((image, imageIndex) => (
                <Image
                  key={imageIndex}
                  src={image}
                  alt={`Beauty salon service showcase ${
                    imageIndex + 1
                  } in grid ${boxIndex + 1}`}
                  className={`${styles.image} ${
                    activeIndices[boxIndex] === imageIndex ? styles.active : ""
                  }`}
                  width={500}
                  height={500}
                  loading={
                    boxIndex === 0 && imageIndex === 0 ? "eager" : "lazy"
                  }
                />
              ))}
            </div>
          ))}
        </div>

        <div className={styles.textContainer}>
          <h1 className={styles.mainTitle}>
            <span className={styles.subTitle}>
              Your Beauty <span className={styles.endTitle}>Haven</span>
            </span>
          </h1>
          <div className={styles.paragraph}>
            <p>
              Visit our luxurious salon in the heart of the UAE to discover a
              world where brilliance and beauty meet. Our team of specialists is
              committed to providing a wide range of services, including hair
              styling and transformation for both men and women, nails, facials,
              and solarium treatments. We stand out as the top beauty salon in
              the United Arab Emirates because of our dedication to quality,
              professionalism, and customer satisfaction. Embrace the pleasure
              that you deserve and love an unforgettable experience that will
              leave you feeling healthy and brilliant.
            </p>
          </div>
        </div>
        <div className={styles.glassBottom} />
      </div>
    </>
  );
}
