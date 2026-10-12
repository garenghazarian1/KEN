import Script from "next/script";
import CampaignPoster from "@/components/campaign/CampaignPoster";
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

export const revalidate = 3600;

export function generateMetadata() {
  const active = getActiveCampaign();
  const campaign = active || augustCampaign;
  const titleName = tCampaign(campaign?.theme) || "Offers";
  const description =
    tCampaign(active ? campaign.primaryCta : campaign?.heroSubtitle) ||
    `Special offers at ${BUSINESS.name}.`;
  const title = `${titleName} | ${BUSINESS.name} Abu Dhabi`;

  return {
    title,
    description,
    alternates: { canonical: "/offers" },
    openGraph: {
      title,
      description,
      url: "/offers",
      siteName: BUSINESS.name,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function offerItems(campaign) {
  const packages = campaign.packages || [];
  if (packages.length) {
    return packages.map((pkg, index) => ({
      "@type": "Offer",
      position: index + 1,
      name: tCampaign(pkg.name),
      price: pkg.promoPrice,
      priceCurrency: pkg.currency || "AED",
      availability: "https://schema.org/InStock",
      validThrough: `${campaign.endsOn}T23:59:59+04:00`,
    }));
  }

  return [
    {
      "@type": "Offer",
      position: 1,
      name: tCampaign(campaign.primaryCta),
      price: 0,
      priceCurrency: "AED",
      availability: "https://schema.org/InStock",
      validThrough: `${campaign.endsOn}T23:59:59+04:00`,
    },
  ];
}

export default function OffersPage() {
  const active = getActiveCampaign();
  const campaign = active || augustCampaign;
  const expired = campaign ? !isCampaignActive(campaign) : true;
  const poster = Boolean(active && !active.packages?.length);

  const offerJsonLd =
    campaign && !expired
      ? {
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: tCampaign(campaign.theme),
          url: `${BASE_URL}/offers`,
          itemListElement: offerItems(campaign),
        }
      : null;

  return (
    <>
      {offerJsonLd ? (
        <Script
          id="ld-offers"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(offerJsonLd),
          }}
        />
      ) : null}
      {poster ? (
        <CampaignPoster campaign={active} placement="page" />
      ) : (
        <OffersContent campaign={campaign} expired={expired} />
      )}
    </>
  );
}
