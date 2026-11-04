import { lora, inter } from "@/app/ui/fonts";
import "./globals.css";
import { MobileNavTop, MobileNavBottom } from "@/components/mobileNav";
import FooterModern from "@/components/footer/Footer.modern";
// import AppInstallBanner from "@/components/AppInstallBanner/AppInstallBanner";
import AssistantWidget from "@/components/AssistantWidget/AssistantWidget";
import BookingDock from "@/components/bookingDock/BookingDock";
import ClientLayout from "@/components/ClientLayout";
import ConsentAnalytics from "@/components/ConsentAnalytics/ConsentAnalytics";
import DeferredGoogleTag from "@/components/DeferredGoogleTag";
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
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <head>
        {process.env.VERCEL_ENV === "production" ? (
          <Script id="clarity-init" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${THIRD_PARTY.clarity.id}");`}
          </Script>
        ) : null}
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${THIRD_PARTY.googleTagManager.id}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <DeferredGoogleTag />
        <ConsentAnalytics />
        {/* <InitialLoader /> */}
        {/* <AppInstallBanner /> */}
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
          <AssistantWidget />
          <BookingDock />
        </ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
