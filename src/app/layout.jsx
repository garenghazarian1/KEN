import { lora, inter } from "@/app/ui/fonts";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import ClientLayout from "@/components/ClientLayout";
import styles from "./Layout.module.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { BASE_URL, BUSINESS, THIRD_PARTY } from "@/config/constants";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: BUSINESS.fullName,
    template: `%s | ${BUSINESS.name}`,
  },
  description: BUSINESS.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: BUSINESS.fullName,
    description: BUSINESS.description,
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} ${lora.className}`}>
      <body>
        <ClientLayout>
          <div className={styles.layoutContainer}>
            <Navbar />
            <div className={styles.childrenContainer}>{children}</div>
            <Footer />
          </div>
        </ClientLayout>
        <Analytics />
        <Script src={THIRD_PARTY.tidio.scriptUrl} strategy="lazyOnload" />
      </body>
    </html>
  );
}
