import { Suspense } from "react";
import { inter, lora, loraItalic } from "@/app/ui/fonts";
import "./globals.css";
import { MobileNavTop, MobileNavBottom } from "@/components/mobileNav";
import FooterModern from "@/components/footer/Footer.modern";
// import AppInstallBanner from "@/components/AppInstallBanner/AppInstallBanner";
import AssistantWidget from "@/components/AssistantWidget/AssistantWidget";
import BookingDockGate from "@/components/bookingDock/BookingDockGate";
import { BookingProvider } from "@/components/bookingDock/bookingList";
import ClientLayout from "@/components/ClientLayout";
import ConsentAnalytics from "@/components/ConsentAnalytics/ConsentAnalytics";
import DeferredGoogleTag, { DelayedAnalytics } from "@/components/DeferredGoogleTag";
// import InitialLoader from "@/components/InitialLoader";
import { getPrerenderClock } from "@/lib/business/prerenderClock";
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

export default async function RootLayout({ children }) {
  const { year } = await getPrerenderClock();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${lora.variable} ${loraItalic.variable}`}
    >
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
try{
var adParams=new URLSearchParams(location.search);
var adKeys=["gclid","gbraid","wbraid"];
var adNext={};
var adChanged=false;
for(var adI=0;adI<adKeys.length;adI++){
var adValue=(adParams.get(adKeys[adI])||"").trim();
if(/^[A-Za-z0-9._-]{20,200}$/.test(adValue)&&!/^test/i.test(adValue)){adNext[adKeys[adI]]=adValue;adChanged=true;}
}
if(adChanged){
var adTtl=90*24*60*60*1000;
adNext.capturedAt=new Date().toISOString();
adNext.expiresAt=Date.now()+adTtl;
adNext.landingPath=location.pathname+location.search;
localStorage.setItem("ken_ads_attribution",JSON.stringify(adNext));
if(adNext.gclid){document.cookie="ken_gclid="+encodeURIComponent(adNext.gclid)+"; Max-Age="+Math.floor(adTtl/1000)+"; Path=/; SameSite=Lax; Secure";}
}
}catch(adError){}
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
          <BookingProvider>
            <div className={styles.layoutContainer}>
              <Suspense
                fallback={
                  <div className={styles.mobileNavTopWrapper} aria-hidden="true" />
                }
              >
                <div className={styles.mobileNavTopWrapper}>
                  <MobileNavTop />
                </div>
              </Suspense>
              <div className={styles.childrenContainer}>{children}</div>
              <FooterModern year={year} />
              <Suspense
                fallback={
                  <div className={styles.mobileNavBottomWrapper} aria-hidden="true" />
                }
              >
                <div className={styles.mobileNavBottomWrapper}>
                  <MobileNavBottom />
                </div>
              </Suspense>
            </div>
            <AssistantWidget />
            <BookingDockGate />
          </BookingProvider>
        </ClientLayout>
        <DelayedAnalytics />
      </body>
    </html>
  );
}
