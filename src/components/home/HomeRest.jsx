"use client";

import { useEffect, useState } from "react";
import HomeRestFallback from "@/components/home/HomeRestFallback";
// Floating WhatsApp turned off 17 Nov 2026 (Garen). WhatsApp is in hero, footer and Contact sheet.
// import DeferredWhatsApp from "@/components/home/DeferredWhatsApp";

export default function HomeRest({ campaign }) {
  const [View, setView] = useState(null);

  useEffect(() => {
    let cancel = false;
    let started = false;
    const show = () => {
      if (started) return;
      started = true;
      import("@/components/hero/Hero.modern").then((mod) => {
        if (!cancel) setView(() => mod.default);
      });
    };
    const still = document.querySelector("[data-hero-still]");
    if (still && !still.complete) {
      still.addEventListener("load", show, { once: true });
      still.addEventListener("error", show, { once: true });
    } else {
      show();
    }
    const cap = window.setTimeout(show, 5000);
    return () => {
      cancel = true;
      window.clearTimeout(cap);
      still?.removeEventListener("load", show);
      still?.removeEventListener("error", show);
    };
  }, []);

  return (
    <>
      {View ? <View campaign={campaign} /> : <HomeRestFallback campaign={campaign} />}
      {/* Floating WhatsApp turned off 17 Nov 2026 (Garen). WhatsApp is in hero, footer and Contact sheet. */}
      {/* <DeferredWhatsApp /> */}
    </>
  );
}
