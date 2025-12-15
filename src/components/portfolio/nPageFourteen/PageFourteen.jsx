"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./PageFourteen.modern.module.css";

export default function PageFourteen() {
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
          src="/portfolio/mission01.webp"
          alt="Our Mission"
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
            At Ken Salon, we are devoted to creating an unparalleled sanctuary
            where women and men alike can experience the transformative magic of
            beauty. Our mission is to deliver bespoke experiences that elevate
            hairstyling, skincare, and grooming to extraordinary levels. With
            meticulous attention to detail, cutting-edge techniques, and
            luxurious products, we aim to nurture your confidence and empower
            you to shine as your most beautiful self.
          </p>
        </div>
      </motion.div>

      <motion.div
        id="OurMission"
        className={styles.titlePane}
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className={styles.number}>06</span>
        <span className={styles.titleTop}>Our</span>
        <span className={styles.titleBottom}>Mission</span>
      </motion.div>
    </section>
  );
}
