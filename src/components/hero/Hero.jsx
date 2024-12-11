"use client";

import Link from "next/link";
import styles from "./Hero.module.css";
import { FaWhatsapp } from "react-icons/fa";

export default function Hero() {
  return (
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
  );
}
