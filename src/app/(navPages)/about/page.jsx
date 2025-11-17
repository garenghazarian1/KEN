import Script from "next/script";
import Portfolio from "@/components/portfolio/Portfolio";

export const metadata = {
  title: "About Ken Beauty Salon | Story & Expertise",
  description:
    "Learn about Ken Beauty Salon's team of stylists, barbers, and beauty specialists in Abu Dhabi.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Ken Beauty Salon | Story & Expertise",
    description:
      "Discover the team and philosophy behind Ken Beauty Salon in Abu Dhabi.",
    url: "/about",
    siteName: "Ken Beauty Salon",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Ken Beauty Salon | Story & Expertise",
    description:
      "Meet the experts at Ken Beauty Salon and learn about our services in Abu Dhabi.",
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Ken Beauty Salon",
  url: "https://www.kenbeautysalon.com/about",
  mainEntity: {
    "@type": "Organization",
    name: "Ken Beauty Salon",
    url: "https://www.kenbeautysalon.com/",
    logo: "https://www.kenbeautysalon.com/logo01.png",
    sameAs: [
      "https://www.instagram.com/ken_beauty_ad",
      "https://www.instagram.com/ken_barbershop.ad",
      "https://www.tiktok.com/@ken_barbershop.ad",
      "https://www.tiktok.com/@kenbeauty04",
    ],
  },
};

export default function Home() {
  return (
    <>
      <Script
        id="ld-about"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <Portfolio />{" "}
    </>
  );
}
