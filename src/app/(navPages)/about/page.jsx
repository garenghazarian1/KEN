import Script from "next/script";
import Portfolio from "@/components/portfolio/Portfolio";
import {
  BASE_URL,
  BUSINESS,
  IMAGES,
  getSocialMediaArray,
  getFullUrl,
} from "@/config/constants";

export const metadata = {
  title: `About ${BUSINESS.name} | Story & Expertise`,
  description: `Learn about ${BUSINESS.name}'s team of stylists, barbers, and beauty specialists in Abu Dhabi.`,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About ${BUSINESS.name} | Story & Expertise`,
    description: `Discover the team and philosophy behind ${BUSINESS.name} in Abu Dhabi.`,
    url: "/about",
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${BUSINESS.name} | Story & Expertise`,
    description: `Meet the experts at ${BUSINESS.name} and learn about our services in Abu Dhabi.`,
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `About ${BUSINESS.name}`,
  url: getFullUrl("/about"),
  mainEntity: {
    "@type": "Organization",
    name: BUSINESS.name,
    url: BASE_URL,
    logo: IMAGES.logo,
    sameAs: getSocialMediaArray(),
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
