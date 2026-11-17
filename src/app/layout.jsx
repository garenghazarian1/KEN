import { inter, lora, loraItalic } from "@/app/ui/fonts";
import "./globals.css";
import { MobileNavTop, MobileNavBottom } from "@/components/mobileNav";
import FooterModern from "@/components/footer/Footer.modern";
// import AppInstallBanner from "@/components/AppInstallBanner/AppInstallBanner";
import AssistantWidget from "@/components/AssistantWidget/AssistantWidget";
import BookingDock from "@/components/bookingDock/BookingDock";
import ClientLayout from "@/components/ClientLayout";
import ConsentAnalytics from "@/components/ConsentAnalytics/ConsentAnalytics";
import DeferredGoogleTag, { DelayedAnalytics } from "@/components/DeferredGoogleTag";
// import InitialLoader from "@/components/InitialLoader";
import styles from "./Layout.module.css";
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
    <html lang="en" className={`${inter.variable} ${lora.variable} ${loraItalic.variable}`}>
      <head>
        <Script id="tracking-stubs" strategy="beforeInteractive">
          {`(function(){
window.dataLayer=window.dataLayer||[];
window.__fbqEarly=window.__fbqEarly||[];
if(!window.fbq){
window.fbq=function(){window.fbq.queue.push(arguments);};
window.fbq.queue=window.__fbqEarly;
window.fbq.loaded=false;
window.fbq.version="2.0";
window.fbq.__kenStub=true;
}
window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments)};
document.addEventListener("click",function(event){
if(window.__gtmListening)return;
var node=event.target&&event.target.closest?event.target.closest("a,button"):null;
if(!node)return;
var payload={event:"gtm.click","gtm.element":node,"gtm.elementClasses":node.className||"","gtm.elementId":node.id||"","gtm.elementTarget":node.getAttribute("target")||"","gtm.elementUrl":node.href||"","gtm.elementText":(node.innerText||"").slice(0,200)};
requestAnimationFrame(function(){setTimeout(function(){window.dataLayer.push(payload);},0);});
},false);
})();`}
        </Script>
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
        <DeferredGoogleTag
          clarityId={
            process.env.VERCEL_ENV === "production" ? THIRD_PARTY.clarity.id : ""
          }
        />
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
        <DelayedAnalytics />
      </body>
    </html>
  );
}
