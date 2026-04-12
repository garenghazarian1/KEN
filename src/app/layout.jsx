import { lora, inter } from "@/app/ui/fonts";
import "./globals.css";
import NavbarModern from "@/components/loading/navbar/Navbar.modern";
import { MobileNavTop, MobileNavBottom } from "@/components/mobileNav";
import FooterModern from "@/components/footer/Footer.modern";
import AppInstallBanner from "@/components/AppInstallBanner/AppInstallBanner";
import ClientLayout from "@/components/ClientLayout";
// import InitialLoader from "@/components/InitialLoader";
import styles from "./Layout.module.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import {
  APPLE_TOUCH_ICON_URL,
  BASE_URL,
  BUSINESS,
  IMAGES,
  THIRD_PARTY,
  WEB_APP_MANIFEST_URL,
  getSpecialPeriodLogo,
} from "@/config/constants";

const specialPeriodActive = getSpecialPeriodLogo() !== null;

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: BUSINESS.fullName,
    template: `%s | ${BUSINESS.name}`,
  },
  description: BUSINESS.description,
  manifest: WEB_APP_MANIFEST_URL,
  icons: specialPeriodActive
    ? {
        icon: [
          { url: "/favicon-for-app/favicon.ico", sizes: "48x48" },
          { url: "/favicon-for-app/favicon.svg", type: "image/svg+xml" },
          {
            url: "/favicon-for-app/favicon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
        apple: APPLE_TOUCH_ICON_URL,
      }
    : {
        icon: "/favicon.ico",
        apple: APPLE_TOUCH_ICON_URL,
      },
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} ${lora.className}`}>
      <body>
        {/* <InitialLoader /> */}
        <AppInstallBanner />
        <ClientLayout>
          <div className={styles.layoutContainer}>
            {/* Desktop: show; Mobile: hide */}
            <div className={styles.desktopNavWrapper}>
              <NavbarModern />
            </div>
            {/* Mobile: show; Desktop: hide */}
            <div className={styles.mobileNavTopWrapper}>
              <MobileNavTop />
            </div>
            <div className={styles.childrenContainer}>{children}</div>
            <FooterModern />
            <div className={styles.mobileNavBottomWrapper}>
              <MobileNavBottom />
            </div>
          </div>
        </ClientLayout>
        <Analytics />
        {/* Tidio chatbot – commented out for now, use later */}
        {/* <Script src={THIRD_PARTY.tidio.scriptUrl} strategy="lazyOnload" /> */}
      </body>
    </html>
  );
}
