"use client";
import { motion } from "framer-motion";
import styles from "./PageTwo.modern.module.css";

const tocItems = [
  { id: "whoWeAre", num: "01", label: "Who We Are" },
  { id: "OurLocations", num: "02", label: "Our Locations" },
  { id: "SocialMedia", num: "03", label: "Social Media" },
  { id: "TheDesigner", num: "04", label: "The Designer Behind Ken Salon" },
  { id: "OurVision", num: "05", label: "Vision" },
  { id: "OurMission", num: "06", label: "Mission" },
  { id: "OurPhilosophy", num: "07", label: "Philosophy" },
  { id: "CoreValues", num: "08", label: "Core Values" },
  { id: "Services", num: "09", label: "Services" },
  { id: "Celebrities", num: "10", label: "Clients We Work With" },
  { id: "CommunityEngagement", num: "11", label: "Community Engagement" },
  { id: "Press", num: "12", label: "Press & Media Features" },
];

export default function PageTwo() {
  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 200;
      const elementPosition = section.getBoundingClientRect().top;
      window.scrollBy({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  return (
    <section className={styles.container}>
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.title}>
          Table of <span className={styles.titleAccent}>Content</span>
        </h2>
      </motion.header>

      <motion.div
        className={styles.grid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {tocItems.map((item, index) => (
          <motion.button
            key={item.id}
            className={styles.item}
            onClick={() => handleScroll(item.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.number}>{item.num}</span>
            <span className={styles.label}>{item.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
