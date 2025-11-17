import Script from "next/script";
import InstagramFeed from "@/components/instagram/InstagramFeed";
import styles from "./Gallery.module.css";
import InstagramEmbed from "@/components/instagram/StaticInstagram";

export const metadata = {
  title: "Gallery | Ken Beauty Salon Abu Dhabi",
  description:
    "Browse Ken Beauty Salon's gallery featuring our latest looks and Instagram highlights in Abu Dhabi.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Gallery | Ken Beauty Salon Abu Dhabi",
    description:
      "See recent work from Ken Beauty Salon including hair, nails, and beauty transformations.",
    url: "/gallery",
    siteName: "Ken Beauty Salon",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Ken Beauty Salon Abu Dhabi",
    description:
      "See recent work from Ken Beauty Salon including hair, nails, and beauty transformations.",
  },
};

const galleryJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Ken Beauty Salon Gallery",
  url: "https://www.kenbeautysalon.com/gallery",
  about: {
    "@type": "Service",
    name: "Beauty and Barber Services",
    areaServed: "Abu Dhabi",
    provider: {
      "@type": "BeautySalon",
      name: "Ken Beauty Salon",
      url: "https://www.kenbeautysalon.com/",
    },
  },
};

export default function Gallery() {
  return (
    <>
      <Script
        id="ld-gallery"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
      />
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Our Gallery</h1>

        {/* Static Instagram Posts Section */}
        <section className={styles.instagramStaticPosts}>
          {/* <h2>Instagram Highlights</h2> */}
          <div className={styles.staticPostsGrid}>
            {/* Instagram Post 1 */}
            <InstagramEmbed />

            {/* Add more InstagramEmbed components for additional posts */}
          </div>
        </section>
        {/* <section>
          <InstagramFeed />
        </section> */}
      </main>
    </>
  );
}
