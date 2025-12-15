"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./PageFifteen.modern.module.css";

export default function PageFifteen() {
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
          src="/portfolio/philosophy02.webp"
          alt="Our Philosophy"
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
            We believe beauty is a deeply emotional journey and a reflection of
            your true self. With every touch and every stroke, we unveil the
            innate allure that lies within you. Our hearts beat with yours as we
            celebrate your individuality, weaving your personal story into
            timeless looks that honor your unique essence and cultural heritage.
            Come and immerse yourself in our sanctuary of luxury and
            rejuvenation, where every moment is a heartfelt embrace of your
            beauty and inner strength.
          </p>
        </div>
      </motion.div>

      <motion.div
        id="OurPhilosophy"
        className={styles.titlePane}
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className={styles.number}>07</span>
        <span className={styles.titleTop}>Our</span>
        <span className={styles.titleBottom}>Philosophy</span>
      </motion.div>
    </section>
  );
}
