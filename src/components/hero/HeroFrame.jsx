import { getImageProps } from "next/image";
import HeroPress from "@/components/hero/HeroPress";
import HeroWhatsApp from "@/components/hero/HeroWhatsApp";
import styles from "./Hero.modern.module.css";

const HERO_ALT = "KEN Beauty Salon artist giving a facial treatment in Abu Dhabi";

export default function HeroFrame() {
  const { props: desktop } = getImageProps({
    src: "/hero/hero-facial-desktop.webp",
    alt: "",
    width: 1920,
    height: 1600,
    sizes: "62vw",
    quality: 65,
  });
  const { props: mobile } = getImageProps({
    src: "/hero/hero-facial-mobile.webp",
    alt: HERO_ALT,
    width: 1080,
    height: 1920,
    sizes: "100vw",
    quality: 65,
  });
  const mobilePreload = mobile.srcSet
    .split(",")
    .map((part) => part.trim().split(" "))
    .find((part) => part[1] === "750w")?.[0];

  return (
    <section className={styles.heroSection}>
      {mobilePreload ? (
        <link
          rel="preload"
          as="image"
          href={mobilePreload}
          imageSrcSet={mobile.srcSet}
          imageSizes="100vw"
          media="(max-width: 1023px)"
          fetchPriority="high"
        />
      ) : null}
      <HeroPress
        className={styles.media}
        href="/services"
        label="View services"
        tabIndex={-1}
        photo
      >
        <picture className={styles.picture}>
          <source
            media="(min-width: 1024px)"
            srcSet={desktop.srcSet}
            sizes="62vw"
          />
          <img
            {...mobile}
            className={styles.heroStill}
            alt={HERO_ALT}
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            data-hero-still=""
          />
        </picture>
      </HeroPress>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.copy}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowFull}>
            Abu Dhabi · Galleria Al Maryah · Rixos Marina
          </span>
          <span className={styles.eyebrowShort}>Abu Dhabi · Galleria · Rixos</span>
        </p>
        <h1 className={styles.mainTitle}>
          <span>Hair and skin,</span>
          <span className={styles.titleLine2}>cared for</span>
        </h1>
        <p className={styles.subtitle}>
          Luxury hair, beauty and facial care in the heart of the UAE.
        </p>
        <div className={styles.ctaBar}>
          <HeroPress className={styles.bookNow} href="/services">
            Book now
          </HeroPress>
          <HeroWhatsApp className={styles.whatsapp} />
        </div>
        <HeroPress className={styles.discoverLink} href="/services">
          View services →
        </HeroPress>
      </div>
    </section>
  );
}
