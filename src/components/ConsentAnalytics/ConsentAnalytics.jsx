"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { THIRD_PARTY } from "@/config/constants";
import {
  captureAdsAttributionFromUrl,
  clearAdsAttribution,
} from "@/lib/adsAttribution";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  COOKIE_CONSENT_KEY,
  readCookieConsent,
} from "@/lib/consent";

export default function ConsentAnalytics() {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    const syncConsent = () => {
      const next = readCookieConsent();
      setConsent(next);
      if (next === "accepted") captureAdsAttributionFromUrl();
      else clearAdsAttribution();
    };
    const onConsentChange = (event) => {
      const next = event.detail;
      setConsent(next);
      if (next === "accepted") captureAdsAttributionFromUrl();
      else clearAdsAttribution();
    };
    const onStorage = (event) => {
      if (event.key === COOKIE_CONSENT_KEY) syncConsent();
    };

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, onConsentChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, onConsentChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (consent !== "accepted") return null;

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${THIRD_PARTY.googleTagManager.id}');`}
    </Script>
  );
}
