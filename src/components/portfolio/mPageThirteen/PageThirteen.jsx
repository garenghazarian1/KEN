"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./PageThirteen.modern.module.css";

export default function PageThirteen() {
  return (
    <section className={styles.container}>
      <motion.div
        className={styles.imagePane}
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/portfolio/vision.webp"
          alt="Our Vision"
          width={300}
          height={400}
          className={styles.image}
        />
      </motion.div>

      <motion.div
        className={styles.textPane}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className={styles.textCard}>
          <p className={styles.paragraph}>
            To reign supreme in the UAE&apos;s luxury hair and beauty scene,
            redefining the art of pampering and self-care. We aspire to craft
            transformative experiences that celebrate your unique beauty, boost
            your confidence, and pursue aesthetic perfection with relentless
            passion. At Ken Salon, every visit is a voyage into unmatched
            excellence, where your individuality becomes our masterpiece.
          </p>
        </div>
      </motion.div>

      <motion.div
        id="OurVision"
        className={styles.titlePane}
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className={styles.number}>05</span>
        <span className={styles.titleTop}>Our</span>
        <span className={styles.titleBottom}>Vision</span>
      </motion.div>
    </section>
  );
}
