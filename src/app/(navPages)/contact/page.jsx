import ContactContent from "@/components/contact/ContactContent";
import { stores } from "@/data/stores";
import {
  BASE_URL,
  BUSINESS,
  getSocialMediaArray,
  getFullUrl,
} from "@/config/constants";

export const metadata = {
  title: "Contact & Locations | Ken Beauty Salon Abu Dhabi",
  description:
    "Contact Ken Beauty Salon and find our Abu Dhabi locations at The Galleria Al Maryah Island and Rixos Hotel Marina.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact & Locations | Ken Beauty Salon Abu Dhabi",
    description:
      "Call, email, or visit Ken Beauty Salon at The Galleria or Rixos Hotel Marina in Abu Dhabi.",
    url: "/contact",
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Locations | Ken Beauty Salon Abu Dhabi",
    description:
      "Reach Ken Beauty Salon at The Galleria Al Maryah Island and Rixos Hotel Marina in Abu Dhabi.",
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${BUSINESS.name}`,
  url: getFullUrl("/contact"),
  contactPoint: stores.map((store) => ({
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: store.mobile,
    areaServed: BUSINESS.location.countryCode,
  })),
  mainEntity: {
    "@type": "Organization",
    name: BUSINESS.name,
    url: BASE_URL,
    sameAs: getSocialMediaArray(),
  },
};

export default function ContactPage() {
  return <ContactContent stores={stores} contactJsonLd={contactJsonLd} />;
}
