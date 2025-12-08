"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./PageOne.module.css";

export default function PageOne() {
  return (
    <>
      {/* PAGE01 */}
      <motion.div
        className={styles.containerA}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className={styles.leftPaneA}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Image
              src="/logo01.png"
              alt="Ken Salon Portfolio"
              width={350}
              height={350}
              className={styles.imageA}
            />
          </motion.div>
          <motion.div
            className={styles.portfolioTextA}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            PORTFOLIO
          </motion.div>
        </motion.div>
        <motion.div
          className={styles.rightPaneA}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Image
              src="/ken.webp"
              alt="Ken Salon Portfolio"
              width={500}
              height={500}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
