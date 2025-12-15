"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./PageOne.modern.module.css";

export default function PageOne() {
  return (
    <motion.section
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className={styles.leftPane}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Image
          src="/logo01.png"
          alt="Ken Salon Logo"
          width={300}
          height={300}
          className={styles.logo}
          priority
        />
        <motion.h1
          className={styles.portfolioText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Portfolio
        </motion.h1>
      </motion.div>

      <motion.div
        className={styles.rightPane}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Image
          src="/ken.webp"
          alt="Ken Ghazarian - Founder"
          width={500}
          height={600}
          className={styles.mainImage}
          priority
        />
      </motion.div>
    </motion.section>
  );
}
