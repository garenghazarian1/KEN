import Script from "next/script";
import Hero from "@/components/hero/Hero";

export const metadata = {
  title: "Ken Beauty Salon | Beauty & Barber Services in Abu Dhabi",
  description:
    "Premium beauty and barber services in Abu Dhabi including hair, nails, facials, and solarium treatments.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ken Beauty Salon | Beauty & Barber Services in Abu Dhabi",
    description:
      "Explore luxury hair, nail, facial, and solarium services at Ken Beauty Salon in Abu Dhabi.",
    url: "/",
    siteName: "Ken Beauty Salon",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ken Beauty Salon | Beauty & Barber Services in Abu Dhabi",
    description:
      "Premium beauty and barber services in Abu Dhabi including hair, nails, facials, and solarium treatments.",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "Ken Beauty Salon",
  url: "https://www.kenbeautysalon.com/",
  telephone: "+971-50-304-3570",
  image: "https://www.kenbeautysalon.com/hero04.jpg",
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "The Galleria Al Maryah Island - 107 Hamouda Bin Ali Al Dhaheri St",
      addressLocality: "Abu Dhabi",
      postalCode: "00000",
      addressCountry: "AE",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Rixos Hotel, Marina - Al Kasir - Al Marina",
      addressLocality: "Abu Dhabi",
      postalCode: "00000",
      addressCountry: "AE",
    },
  ],
  sameAs: [
    "https://www.instagram.com/ken_beauty_ad",
    "https://www.instagram.com/ken_barbershop.ad",
    "https://www.tiktok.com/@ken_barbershop.ad",
    "https://www.tiktok.com/@kenbeauty04",
  ],
};

export default function Home() {
  return (
    <main>
      <Script
        id="ld-local-business"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Hero />
    </main>
  );
}
