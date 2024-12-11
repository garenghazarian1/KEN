"use client";

import styles from "./Hero.module.css";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

export default function Hero() {
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
          <div className={styles.gridBox}>
            <Image
              src="/heroGridImage/hero01.jpg"
              alt="Hero 01"
              className={styles.image}
              width={500}
              height={500}
            />
          </div>
          <div className={styles.gridBox}>
            <Image
              src="/heroGridImage/hero02.jpg"
              alt="Hero 02"
              className={styles.image}
              width={500}
              height={500}
            />
          </div>
          <div className={styles.gridBox}>
            <Image
              src="/heroGridImage/hero03.jpg"
              alt="Hero 03"
              className={styles.image}
              width={500}
              height={500}
            />
          </div>
          <div className={styles.gridBox}>
            <Image
              src="/heroGridImage/hero04.jpg"
              alt="Hero 04"
              className={styles.image}
              width={500}
              height={500}
            />
          </div>
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
