import Script from "next/script";
import Hero from "@/components/hero/Hero";
import { stores } from "@/data/stores";
import {
  BASE_URL,
  BUSINESS,
  CONTACT,
  IMAGES,
  getSocialMediaArray,
} from "@/config/constants";

export const metadata = {
  title: BUSINESS.fullName,
  description: BUSINESS.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: BUSINESS.fullName,
    description:
      "Explore luxury hair, nail, facial, and solarium services at Ken Beauty Salon in Abu Dhabi.",
    url: "/",
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BUSINESS.fullName,
    description: BUSINESS.description,
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: BUSINESS.name,
  url: BASE_URL,
  telephone: CONTACT.primaryPhone,
  image: IMAGES.hero,
  address: stores.map((store) => ({
    "@type": "PostalAddress",
    streetAddress: store.street,
    addressLocality: store.city,
    postalCode: store.zipCode,
    addressCountry: BUSINESS.location.countryCode,
  })),
  sameAs: getSocialMediaArray(),
};

export default function Home() {
  return (
    <main>
      <Script
        id="ld-local-business"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />
      <Hero />
    </main>
  );
}
