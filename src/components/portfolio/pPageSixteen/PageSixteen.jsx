"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./PageSixteen.modern.module.css";

export default function PageSixteen() {
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
        id="CoreValues"
        className={styles.textPane}
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className={styles.number}>08</span>
        <span className={styles.titleTop}>Core</span>
        <span className={styles.titleBottom}>Values</span>
      </motion.div>
    </section>
  );
}
