import { lora, inter } from "@/app/ui/fonts";
import "./globals.css";
import { MobileNavTop, MobileNavBottom } from "@/components/mobileNav";
import FooterModern from "@/components/footer/Footer.modern";
import AppInstallBanner from "@/components/AppInstallBanner/AppInstallBanner";
import AssistantWidget from "@/components/AssistantWidget/AssistantWidget";
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
  METADATA_FAVICON_ICONS,
  THIRD_PARTY,
  WEB_APP_MANIFEST_URL,
} from "@/config/constants";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: BUSINESS.fullName,
    template: `%s | ${BUSINESS.name}`,
  },
  description: BUSINESS.description,
  manifest: WEB_APP_MANIFEST_URL,
  icons: {
    icon: METADATA_FAVICON_ICONS,
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
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${THIRD_PARTY.googleTagManager.id}');`}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${THIRD_PARTY.googleTagManager.id}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* <InitialLoader /> */}
        <AppInstallBanner />
        <ClientLayout>
          <div className={styles.layoutContainer}>
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
        <AssistantWidget />
        <Analytics />
        {/* Tidio chatbot – commented out for now, use later */}
        {/* <Script src={THIRD_PARTY.tidio.scriptUrl} strategy="lazyOnload" /> */}
      </body>
    </html>
  );
}
