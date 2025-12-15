"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import styles from "./PageTen.modern.module.css";

const profiles = [
  {
    href: "https://www.instagram.com/ken_barbershop.ad",
    image: "/portfolio/barberShop.webp",
    alt: "Ken Barbershop Instagram",
    username: "ken_barbershop.ad",
  },
  {
    href: "https://www.instagram.com/ken_beauty_ad",
    image: "/portfolio/insta02.webp",
    alt: "Ken Beauty Instagram",
    username: "ken_beauty_ad",
  },
  {
    href: "https://www.instagram.com/ken_ghazarian",
    image: "/portfolio/insta01.webp",
    alt: "Ken Ghazarian Instagram",
    username: "ken_ghazarian",
  },
];

export default function PageTen() {
  return (
    <section className={styles.container}>
      <div className={styles.profiles}>
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.username}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <Link
              href={profile.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.profile}
              aria-label={`Follow @${profile.username} on Instagram`}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={profile.image}
                  alt={profile.alt}
                  width={220}
                  height={220}
                  className={styles.profileImage}
                />
              </div>
              <span className={styles.username}>@{profile.username}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        className={styles.textContainer}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className={styles.textCard}>
          <p>
            Follow Ken Salon on Instagram for the latest updates, beauty
            inspiration, and exclusive promotions!
          </p>
          <p>
            Join our vibrant community, stay connected, and let us be your muse
            on your journey to radiant confidence and timeless allure.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
