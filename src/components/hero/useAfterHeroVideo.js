"use client";

import { useEffect, useState } from "react";

/** Stay hidden until the home hero video is playing. Other pages have no video, so they show at once. */
export function useAfterHeroVideo() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = document.querySelector("[data-hero-video]");
    if (!video) {
      setReady(true);
      return undefined;
    }
    if (!video.paused && video.readyState >= 2) {
      setReady(true);
      return undefined;
    }

    const show = () => setReady(true);
    video.addEventListener("playing", show, { once: true });
    video.addEventListener("error", show, { once: true });
    const timer = window.setTimeout(show, 8000);
    return () => {
      video.removeEventListener("playing", show);
      video.removeEventListener("error", show);
      window.clearTimeout(timer);
    };
  }, []);

  return ready;
}
