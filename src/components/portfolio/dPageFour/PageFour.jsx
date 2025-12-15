"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./PageFour.modern.module.css";

export default function PageFour() {
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
        id="whoWeAre"
        className={styles.textPane}
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className={styles.number}>01</span>
        <span className={styles.titleTop}>Who</span>
        <span className={styles.titleBottom}>we are</span>
      </motion.div>
    </section>
  );
}
