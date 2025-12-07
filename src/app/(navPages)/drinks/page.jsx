import DrinksMenu from "@/components/drinksMenu/DrinksMenu";
import { BUSINESS, BASE_URL } from "@/config/constants";

export const metadata = {
  title: `Beverage Menu | ${BUSINESS.name} Abu Dhabi`,
  description: `Browse our complimentary beverage menu including hot drinks, cold drinks, and add-ons at ${BUSINESS.name} in Abu Dhabi.`,
  alternates: {
    canonical: "/drinks",
  },
  openGraph: {
    title: `Beverage Menu | ${BUSINESS.name} Abu Dhabi`,
    description: `Enjoy our selection of complimentary beverages including coffee, tea, and refreshing drinks at ${BUSINESS.name}.`,
    url: "/drinks",
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Beverage Menu | ${BUSINESS.name} Abu Dhabi`,
    description: `Browse our complimentary beverage menu at ${BUSINESS.name}.`,
  },
};

export default function DrinksPage() {
  return <DrinksMenu />;
}

