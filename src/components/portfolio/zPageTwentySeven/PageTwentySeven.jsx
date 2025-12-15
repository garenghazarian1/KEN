"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./PageTwentySeven.modern.module.css";

export default function PageTwentySeven() {
  return (
    <section className={styles.container}>
      <motion.div
        className={styles.textSection}
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.header}>Press</h2>
        <p className={styles.text}>
          Discover how Ken has reshaped the landscape of hair fashion and
          trends. Explore the groundbreaking approaches and visionary insights
          that have propelled Ken to the forefront of the beauty industry.
          Witness the impact of Ken&apos;s creative vision on the world of
          hairstyling.
        </p>
      </motion.div>

      <motion.div
        className={styles.imageSection}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className={styles.imageWrapper}>
          <Image
            src="/portfolio/press.jpg"
            alt="Ken Salon press coverage and media features"
            width={1200}
            height={800}
            className={styles.pressImage}
            priority
          />
          <div className={styles.badge}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            <span className={styles.badgeText}>Featured</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
