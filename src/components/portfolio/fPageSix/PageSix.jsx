"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./PageSix.modern.module.css";

const sections = [
  {
    image: "/portfolio/portfolioE001.webp",
    text: "Here, the art of hair styling, cutting, coloring, and skincare transcends mere services, becoming a sacred ritual that unveils the beauty within. Each visit is a journey of self-discovery guided by a team of artisans whose skills are matched only by their unwavering dedication to your satisfaction.",
  },
  {
    image: "/portfolio/portfolioE003.webp",
    text: "At Ken Salon, beauty is not merely a pursuit, it is a celebration of life's most exquisite moments. Every strand of hair, every brushstroke of color, and every delicate touch is a testament to the salon's unwavering commitment to highlighting the inherent beauty in every individual. Step into this sanctuary of magnificence, where dreams of confidence and allure take flight, and allow Ken Salon to unveil the most beautiful version of yourself.",
  },
];

export default function PageSix() {
  return (
    <div className={styles.container}>
      {sections.map((section, index) => (
        <section key={index} className={styles.section}>
          <motion.div
            className={styles.imagePane}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={section.image}
                alt={`Ken Salon experience ${index + 1}`}
                width={500}
                height={500}
                className={styles.image}
              />
            </div>
          </motion.div>

          <motion.div
            className={styles.textPane}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.textCard}>
              <span className={styles.quoteIcon}>&ldquo;</span>
              <p className={styles.text}>{section.text}</p>
            </div>
          </motion.div>
        </section>
      ))}
    </div>
  );
}
