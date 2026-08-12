import Script from "next/script";
import OffersContent from "@/components/campaign/OffersContent";
import { BUSINESS, BASE_URL } from "@/config/constants";
import {
  getActiveCampaign,
  isCampaignActive,
  tCampaign,
} from "@/lib/business/campaigns";
import { CAMPAIGNS } from "@/data/campaigns";

const augustCampaign =
  CAMPAIGNS.find((c) => c.id === "august-2026") || CAMPAIGNS[0] || null;

export const metadata = {
  title: `August Offers | ${BUSINESS.name} Abu Dhabi`,
  description:
    tCampaign(augustCampaign?.heroSubtitle) ||
    `Special August packages and Hot Tuesday offer at ${BUSINESS.name}.`,
  alternates: {
    canonical: "/offers",
  },
  openGraph: {
    title: `August Offers | ${BUSINESS.name} Abu Dhabi`,
    description: tCampaign(augustCampaign?.primaryCta),
    url: "/offers",
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `August Offers | ${BUSINESS.name} Abu Dhabi`,
    description: tCampaign(augustCampaign?.primaryCta),
  },
};

export default function OffersPage() {
  const campaign = getActiveCampaign() || augustCampaign;
  const expired = campaign ? !isCampaignActive(campaign) : true;

  const offerJsonLd =
    campaign && !expired
      ? {
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: tCampaign(campaign.theme),
          url: `${BASE_URL}/offers`,
          itemListElement: campaign.packages.map((pkg, index) => ({
            "@type": "Offer",
            position: index + 1,
            name: tCampaign(pkg.name),
            price: pkg.promoPrice,
            priceCurrency: pkg.currency || "AED",
            availability: "https://schema.org/InStock",
            validThrough: `${campaign.endsOn}T23:59:59+04:00`,
          })),
        }
      : null;

  return (
    <>
      {offerJsonLd ? (
        <Script
          id="ld-august-offers"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(offerJsonLd),
          }}
        />
      ) : null}
      <OffersContent campaign={campaign} expired={expired} />
    </>
  );
}
