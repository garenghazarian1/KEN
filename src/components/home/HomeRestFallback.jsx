import { heroSlides } from "@/components/hero/heroSlides";
import heroStyles from "@/components/hero/HeroBelow.module.css";
import filmStyles from "@/components/campaign/CampaignFilm.module.css";

export default function HomeRestFallback({ campaign }) {
  return (
    <>
      {campaign?.media ? (
        <section className={filmStyles.band} aria-hidden="true">
          <div className={filmStyles.stage} />
        </section>
      ) : null}
      <section className={heroStyles.gallerySection} aria-hidden="true">
        <div className={heroStyles.sectionHeader}>
          <h2 className={heroStyles.sectionTitle}>
            <span className={heroStyles.titleMain}>Our</span>{" "}
            <span className={heroStyles.titleAccent}>Work</span>
          </h2>
          <p className={heroStyles.sectionSubtitle}>
            Browse our services — scroll to explore each look
          </p>
        </div>
        <div className={heroStyles.galleryStack}>
          {heroSlides.map((slide) => (
            <article key={slide.image} className={heroStyles.galleryItem}>
              <div className={heroStyles.itemMedia} />
              <div className={heroStyles.itemCopy}>
                <h3 className={heroStyles.contentTitle}>{slide.title}</h3>
                <p className={heroStyles.contentSubtitle}>{slide.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
