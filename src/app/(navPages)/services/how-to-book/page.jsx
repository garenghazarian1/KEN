import { BookingGuide } from "@/components/serviceMenu/BookingGuide";
import { BUSINESS } from "@/config/constants";

export const metadata = {
  title: `Book on WhatsApp | ${BUSINESS.name} Abu Dhabi`,
  description: `Add services on the menu, then send them to Galleria or Rixos on WhatsApp. No account. One message.`,
  alternates: {
    canonical: "/services/how-to-book",
  },
  openGraph: {
    title: `Book on WhatsApp | ${BUSINESS.name} Abu Dhabi`,
    description: `Add the services you want, then send one WhatsApp message.`,
    url: "/services/how-to-book",
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "website",
  },
};

export default function HowToBookPage() {
  return <BookingGuide />;
}
