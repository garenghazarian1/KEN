"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./PageTwenty.modern.module.css";

export default function PageTwenty() {
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
        id="ServicesHim"
        className={styles.textPane}
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className={styles.number}>09</span>
        <span className={styles.titleTop}>Services</span>
        <span className={styles.titleBottom}>For Him</span>
      </motion.div>
    </section>
  );
}
