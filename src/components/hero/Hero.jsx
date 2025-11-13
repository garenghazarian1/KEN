"use client";

import styles from "./Hero.module.css";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import { useState, useEffect } from "react";

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
    "/heroGridImage/hero010.jpg",
  ],
];

export default function Hero() {
  const [activeIndices, setActiveIndices] = useState([0, 0]); // Active image index for each box

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
          <video
            src="/hero-vid-02.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={styles.heroVideo}
          />
          <video
            src="/hero-vid-01.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={styles.heroVideo}
          />
          <video
            src="/hero-vid-03.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={styles.heroVideo}
          />
        </div>
        <div className={styles.buttonContainer}>
          <a
            href="https://wa.me/971555570029?text=Hello%20KEN%20Beauty%20Center%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
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
                  alt={`Image ${imageIndex + 1}`}
                  className={`${styles.image} ${
                    activeIndices[boxIndex] === imageIndex ? styles.active : ""
                  }`}
                  width={500}
                  height={500}
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
