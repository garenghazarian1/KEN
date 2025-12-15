"use client";
import { motion } from "framer-motion";
import styles from "./PageTwentyFive.modern.module.css";

const engagementContent = [
  {
    title: "At Ken Salon",
    text: "We are profoundly grounded in the understanding that true beauty extends far beyond mere appearances; it's about leaving a lasting, positive imprint on the lives we touch. As a brand deeply embraced by our local community, we hold a steadfast commitment to giving back.",
  },
  {
    title: "Educational Empowerment",
    text: "We offer complimentary hair and beauty workshops to budding stylists and beauticians, empowering them with invaluable skills and wisdom to flourish in their craft.",
  },
  {
    title: "Community Events",
    text: "Engaging actively in, and sponsoring, community events allows us to strengthen bonds, celebrate our rich local culture, and foster a sense of togetherness.",
  },
];

export default function PageTwentyFive() {
  return (
    <section className={styles.container}>
      <div className={styles.textSection}>
        {engagementContent.map((item, index) => (
          <motion.article
            key={item.title}
            className={styles.contentCard}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <h3 className={styles.cardHeader}>{item.title}</h3>
            <p className={styles.cardText}>{item.text}</p>
          </motion.article>
        ))}
      </div>

      <motion.div
        className={styles.videoSection}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.videoWrapper}>
          <video
            src="/portfolio/CommunityEngagement.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={styles.video}
          />
        </div>
      </motion.div>
    </section>
  );
}
