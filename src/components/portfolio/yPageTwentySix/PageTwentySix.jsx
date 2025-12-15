"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./PageTwentySix.modern.module.css";

export default function PageTwentySix() {
  return (
    <section className={styles.container}>
      <div className={styles.logoPane}>
        <Image
          src="/logo03.png"
          alt="Ken Salon"
          width={200}
          height={200}
          className={styles.logo}
        />
      </div>
      <motion.div
        id="Press"
        className={styles.textPane}
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className={styles.number}>12</span>
        <span className={styles.titleTop}>Press &</span>
        <span className={styles.titleBottom}>Media Features</span>
      </motion.div>
    </section>
  );
}
