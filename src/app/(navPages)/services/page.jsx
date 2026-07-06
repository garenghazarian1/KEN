import ServiceMenu from "@/components/serviceMenu/ServiceMenu";
import { BUSINESS } from "@/config/constants";
import {
  buildServiceSections,
  getServiceCatalog,
} from "@/lib/business/serviceCatalog";

/** Always render with a fresh catalog — admin media can change at any time. */
export const dynamic = "force-dynamic";

export const metadata = {
  title: `Services & Prices | ${BUSINESS.name} Abu Dhabi`,
  description: `Browse services and prices at ${BUSINESS.name} in Abu Dhabi — hair, nails, facials, solarium, and more.`,
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: `Services & Prices | ${BUSINESS.name} Abu Dhabi`,
    description: `View our full service menu with live pricing and durations at ${BUSINESS.name}.`,
    url: "/services",
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Services & Prices | ${BUSINESS.name} Abu Dhabi`,
    description: `Browse services and prices at ${BUSINESS.name}.`,
  },
};

export default async function ServicesPage() {
  let sections = [];
  let error = null;

  try {
    const data = await getServiceCatalog("en");
    sections = buildServiceSections(data.services);
  } catch (err) {
    error = err?.message || "Failed to load services.";
  }

  return <ServiceMenu sections={sections} error={error} />;
}
