import HeroFrame from "@/components/hero/HeroFrame";
import JsonLd from "@/components/seo/JsonLd";
import { stores } from "@/data/stores";
import {
  BASE_URL,
  BUSINESS,
  CONTACT,
  IMAGES,
  getSocialMediaArray,
} from "@/config/constants";
import { getCampaignCached } from "@/lib/business/campaignCache";
import HomeRestGate from "@/components/home/HomeRestGate";
import styles from "./mainPage.module.css";

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
    images: [
      {
        url: IMAGES.hero,
        alt: BUSINESS.fullName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BUSINESS.fullName,
    description: BUSINESS.description,
    images: [IMAGES.hero],
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

export default async function Home() {
  const { campaign } = await getCampaignCached();

  return (
    <main className={styles.main}>
      <JsonLd data={localBusinessJsonLd} />
      <HeroFrame />
      <HomeRestGate campaign={campaign} />
    </main>
  );
}
