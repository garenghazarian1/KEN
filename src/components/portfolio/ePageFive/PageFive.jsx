"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./PageFive.modern.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/pagination";
import { EffectFlip, Pagination } from "swiper/modules";

const sections = [
  {
    num: "01",
    images: ["/portfolio/portfolioA001.webp", "/portfolio/portfolioA002.webp", "/portfolio/portfolioA003.webp"],
    text: "Nestled within the vibrant heart of the UAE, Ken Salon stands as an ethereal oasis where beauty is elevated to an art form.",
  },
  {
    num: "02",
    images: ["/portfolio/portfolioB001.webp", "/portfolio/portfolioB002.webp", "/portfolio/portfolioB003.webp"],
    text: "As you step through the doors, a world of luxury and tranquility unfolds, enveloping you in an atmosphere that whispers of indulgence and rejuvenation.",
  },
  {
    num: "03",
    images: ["/portfolio/portfolioC001.webp", "/portfolio/portfolioC002.webp", "/portfolio/portfolioC003.webp", "/portfolio/portfolioC004.webp"],
    text: "Founded by the visionary Vicken Ghazarian, whose passion for hair and beauty transcends mere expertise, this sanctuary beckons those who seek to embrace their inner radiance and outer allure.",
  },
  {
    num: "04",
    images: ["/portfolio/portfolioD001.webp", "/portfolio/portfolioD002.webp"],
    text: "With two premier locations in Abu Dhabi, Ken Salon offers an exclusive VIP experience where every moment is tailored to your unique desires.",
  },
];

export default function PageFive() {
  return (
    <div className={styles.container}>
      {sections.map((section, index) => (
        <section key={index} className={styles.section}>
          <motion.div
            className={styles.imagePane}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className={styles.imageWrapper}>
              <Swiper
                effect="flip"
                grabCursor={true}
                flipEffect={{ slideShadows: true }}
                pagination={{ clickable: true }}
                modules={[EffectFlip, Pagination]}
                className={styles.swiper}
              >
                {section.images.map((src, imgIndex) => (
                  <SwiperSlide key={imgIndex}>
                    <Image
                      src={src}
                      alt={`Ken Salon showcase ${index + 1}`}
                      width={400}
                      height={400}
                      className={styles.image}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>

          <motion.div
            className={styles.textPane}
            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <div className={styles.textCard}>
              <span className={styles.sectionNumber}>{section.num}</span>
              <p className={styles.text}>{section.text}</p>
            </div>
          </motion.div>
        </section>
      ))}
    </div>
  );
}
