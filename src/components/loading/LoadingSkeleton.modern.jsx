"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import styles from "./LoadingSkeleton.modern.module.css";

export default function LoadingSkeletonModern() {
  return (
    <div className={styles.container}>
      <div className={styles.loadingContent}>
        {/* Animated Logo */}
        <motion.div
          className={styles.logoContainer}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            duration: 0.8,
          }}
        >
          <Image
            src="/logo03.png"
            alt="Ken Beauty Salon logo"
            width={120}
            height={120}
            priority
            className={styles.logo}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </motion.div>

        {/* Spinning Sparkles Icon */}
        <motion.div
          className={styles.spinnerIcon}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Sparkles size={40} />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          className={styles.loadingText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Loading
          </motion.span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          >
            .
          </motion.span>
        </motion.div>

        {/* Animated Dots */}
        <div className={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={styles.dot}
              animate={{
                y: [0, -12, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
