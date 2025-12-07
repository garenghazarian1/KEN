import { BUSINESS } from "@/config/constants";
import Gallery from "./Gallery";

export const metadata = {
  title: `Gallery | ${BUSINESS.name} Abu Dhabi`,
  description: `Browse ${BUSINESS.name}'s gallery featuring our latest looks and Instagram highlights in Abu Dhabi.`,
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: `Gallery | ${BUSINESS.name} Abu Dhabi`,
    description: `See recent work from ${BUSINESS.name} including hair, nails, and beauty transformations.`,
    url: "/gallery",
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Gallery | ${BUSINESS.name} Abu Dhabi`,
    description: `See recent work from ${BUSINESS.name} including hair, nails, and beauty transformations.`,
  },
};

export default function GalleryPage() {
  return <Gallery />;
}
