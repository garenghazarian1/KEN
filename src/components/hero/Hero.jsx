"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Hero.module.css";
import { FaWhatsapp } from "react-icons/fa";

export default function Hero() {
  const allImages = [
    "/heroGridImage/hero01.jpg",
    "/heroGridImage/hero02.jpg",
    "/heroGridImage/hero03.jpg",
    "/heroGridImage/hero04.jpg",
    "/heroGridImage/hero05.jpg",
    "/heroGridImage/hero06.jpg",
    "/heroGridImage/hero07.jpg",
    "/heroGridImage/hero08.jpg",
    "/heroGridImage/hero09.jpg",
    "/heroGridImage/hero10.jpg",
  ];

  const [displayImages, setDisplayImages] = useState(allImages.slice(0, 4)); // First 4 images
  const [currentIndex, setCurrentIndex] = useState(4); // Start cycling from the 5th image
  const [changingIndex, setChangingIndex] = useState(null); // Track which box is changing

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayImages((prevDisplayImages) => {
        // Determine which box to change
        const randomBoxIndex = Math.floor(
          Math.random() * prevDisplayImages.length
        );

        // Get the next image in the sequence
        const newImage = allImages[currentIndex];

        // Update displayImages with the next image
        const updatedDisplayImages = [...prevDisplayImages];
        updatedDisplayImages[randomBoxIndex] = newImage;

        // Move to the next image in the sequence
        const nextIndex = (currentIndex + 1) % allImages.length;

        // Trigger the "changing" effect
        setChangingIndex(randomBoxIndex);

        // Remove the animation effect after 500ms
        setTimeout(() => setChangingIndex(null), 500);

        setCurrentIndex(nextIndex);

        return updatedDisplayImages;
      });
    }, 2000); // Change one image every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex]);

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
        <div className={styles.grid}>
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={`${styles.gridBox} ${
                changingIndex === index ? styles.changing : ""
              }`}
            >
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className={styles.image}
              />
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
      </div>
    </>
  );
}
