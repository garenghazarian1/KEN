"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./LazyVideo.modern.module.css";

const AV1_TYPE = 'video/mp4; codecs="av01.0.05M.08"';

function aboutSrc(video, name) {
  const support = video.canPlayType(AV1_TYPE);
  const kind = support === "probably" || support === "maybe" ? "av1" : "h264";
  return `/videos/about/${name}-${kind}.mp4`;
}

export default function LazyVideo({ name, className, wrapperClassName }) {
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let cancelled = false;
    let didFail = false;
    let srcSet = false;
    let revealTimer = 0;

    const reveal = () => {
      if (!cancelled && !didFail) setVisible(true);
    };

    const onError = () => {
      didFail = true;
      window.clearTimeout(revealTimer);
      if (!cancelled) {
        setVisible(false);
        setFailed(true);
      }
    };

    video.addEventListener("playing", reveal);
    video.addEventListener("loadeddata", reveal);
    video.addEventListener("error", onError);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry || cancelled || didFail) return;

        if (entry.isIntersecting) {
          if (!srcSet) {
            srcSet = true;
            video.muted = true;
            video.playsInline = true;
            video.src = aboutSrc(video, name);
            video.load();
            revealTimer = window.setTimeout(() => {
              if (!cancelled && !didFail && video.readyState >= 2) setVisible(true);
            }, 4000);
          }
          video.play().catch(() => {});
          return;
        }

        video.pause();
      },
      { rootMargin: "200px 0px", threshold: 0 }
    );

    observer.observe(wrapper);

    return () => {
      cancelled = true;
      window.clearTimeout(revealTimer);
      observer.disconnect();
      video.removeEventListener("playing", reveal);
      video.removeEventListener("loadeddata", reveal);
      video.removeEventListener("error", onError);
    };
  }, [name]);

  const videoClassName = [styles.video, className, visible ? styles.videoVisible : ""]
    .filter(Boolean)
    .join(" ");
  const skeletonClassName = [
    styles.skeleton,
    visible ? styles.skeletonHidden : "",
    failed ? styles.skeletonStatic : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={wrapperRef}
      className={[styles.wrapper, wrapperClassName].filter(Boolean).join(" ")}
    >
      <span className={skeletonClassName} aria-hidden="true" />
      <video
        ref={videoRef}
        className={videoClassName}
        muted
        playsInline
        loop
        preload="none"
        aria-hidden="true"
      />
    </div>
  );
}
