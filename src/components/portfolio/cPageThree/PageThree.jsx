"use client";
import { motion } from "framer-motion";
import styles from "./PageThree.modern.module.css";

export default function PageThree() {
  return (
    <section className={styles.container}>
      <div className={styles.textPane}>
        <motion.p
          className={styles.line1}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Where Beauty Blossoms
        </motion.p>
        <motion.p
          className={styles.line2}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          and Confidence Reigns
        </motion.p>
      </div>
      <div className={styles.videoPane}>
        <video
          src="/PortfolioVideo01.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={styles.video}
        />
      </div>
    </section>
  );
}
