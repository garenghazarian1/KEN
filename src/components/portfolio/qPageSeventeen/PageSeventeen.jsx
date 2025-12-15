"use client";
import { motion } from "framer-motion";
import styles from "./PageSeventeen.modern.module.css";

const coreValues = [
  {
    num: "01",
    title: "Professionalism",
    text: "We maintain the highest standards of professionalism, ensuring integrity and reliability in all interactions.",
  },
  {
    num: "02",
    title: "Friendliness",
    text: "Our team fosters a warm and welcoming atmosphere, making every client feel valued and appreciated.",
  },
  {
    num: "03",
    title: "Creativity",
    text: "Innovation and originality drive our approach to hairstyling and beauty, resulting in unique and stunning looks tailored to each client.",
  },
  {
    num: "04",
    title: "Cleanliness",
    text: "Our salon prioritizes proper sanitation, maintaining a pristine environment to ensure the health and safety of our clients.",
  },
  {
    num: "05",
    title: "Commitment to Excellence",
    text: "We are dedicated to exceeding expectations and continuously striving for excellence in every aspect of our service delivery.",
  },
  {
    num: "06",
    title: "Continuous Improvement",
    text: "We are committed to ongoing learning and development, constantly seeking opportunities to enhance our skills, services, and overall salon experience.",
  },
  {
    num: "07",
    title: "Customer Satisfaction",
    text: "Our primary focus is on ensuring that every client leaves our salon completely satisfied with their experience, from the moment they walk in to the moment they leave.",
  },
];

export default function PageSeventeen() {
  return (
    <section className={styles.container}>
      {coreValues.map((value, index) => (
        <motion.article
          key={value.num}
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
        >
          <span className={styles.number}>{value.num}</span>
          <div className={styles.accent} />
          <h3 className={styles.header}>{value.title}</h3>
          <p className={styles.text}>{value.text}</p>
        </motion.article>
      ))}
    </section>
  );
}
