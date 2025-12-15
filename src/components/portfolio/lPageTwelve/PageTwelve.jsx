"use client";
import { motion } from "framer-motion";
import styles from "./PageTwelve.modern.module.css";

const paragraphs = [
  "At the heart of Ken Salon's inception lies the talent and vision of its founder.",
  "A maestro in hair artistry, his journey is one of relentless passion and pursuit of perfection. His hands, almost magical in their deftness, transform tresses into masterpieces, earning him legendary status and the prestigious role of Schwarzkopf Academy ambassador in the GCC.",
  "Vicken's magic extends beyond technical prowess; he sees the beauty within every soul. Ken Salon was born from his burning desire to create a sanctuary where this inner radiance could be celebrated.",
  "Every detail, from impeccable service to cutting-edge techniques and premium products, echoes Vicken's dedication and vision. Under Vicken's passionate guidance, Ken Salon has become a beacon of excellence in the UAE's beauty industry. Each visit is more than an appointment; it's a transformation journey where personalized service and unparalleled artistry reveal the extraordinary within.",
];

export default function PageTwelve() {
  return (
    <section className={styles.container}>
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.name}>
          Vicken <span className={styles.nameAccent}>Ghazarian</span>
        </h2>
      </motion.header>

      <div className={styles.content}>
        <motion.div
          className={styles.videoWrapper}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <video
            src="/portfolio/description01.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={styles.video}
          />
        </motion.div>

        <motion.div
          className={styles.textContent}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {paragraphs.map((text, index) => (
            <p key={index} className={styles.paragraph}>
              {text}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
