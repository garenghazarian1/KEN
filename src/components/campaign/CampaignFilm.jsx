"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";
import { CONTACT } from "@/config/constants";
import { recordOutbound } from "@/lib/leads/trackLead";
import { tCampaign } from "@/lib/business/campaigns";
import { savesData } from "@/components/hero/heroFetchGate";
import { shouldLoadFilm } from "@/components/campaign/filmLoadGate";
import styles from "./CampaignFilm.module.css";

const AV1_CODEC = "av01.0.05M.08";

function clipSrc(video, media) {
  const support = video.canPlayType(`video/mp4; codecs="${AV1_CODEC}"`);
  return support === "probably" || support === "maybe" ? media.av1 : media.h264;
}

function muteOthers(video) {
  document.querySelectorAll("video").forEach((other) => {
    if (other !== video) other.muted = true;
  });
}

/**
 * Portrait campaign film. Starts muted so the browser allows autoplay.
 * The picture is the sound button: tap turns the voice-over on, tap again mutes.
 * Unmuting this film mutes every other video on the page.
 * The book link opens WhatsApp with this campaign's message.
 */
export default function CampaignFilm({ campaign, placement = "home" }) {
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const [fetchAllowed, setFetchAllowed] = useState(false);
  const media = campaign?.media;
  const av1 = media?.av1;
  const h264 = media?.h264;
  const poster = media?.poster;

  useEffect(() => {
    if (savesData()) return undefined;

    let settled = false;
    let observer;

    const allow = (intersecting) => {
      if (settled || !shouldLoadFilm({ placement, intersecting })) return;
      settled = true;
      setFetchAllowed(true);
    };

    if (placement === "page" || typeof IntersectionObserver !== "function") {
      allow(true);
      return undefined;
    }

    const stage = stageRef.current;
    if (!stage) return undefined;

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        allow(true);
      },
      { rootMargin: "0px" }
    );
    observer.observe(stage);

    return () => {
      settled = true;
      observer.disconnect();
    };
  }, [placement]);

  useEffect(() => {
    const video = videoRef.current;
    if (!fetchAllowed || !video || !av1 || !h264) return undefined;

    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onError = () => {
      if (!cancelled) setFailed(true);
    };
    const onReady = () => {
      if (!cancelled) setReady(true);
    };
    const onVolume = () => {
      if (cancelled) return;
      setMuted(video.muted);
      if (!video.muted) muteOthers(video);
    };

    if (!video.getAttribute("src")) {
      if (poster) video.poster = poster;
      video.preload = "metadata";
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      video.src = clipSrc(video, { av1, h264 });
      if (!reduce) video.play().catch(() => {});
    }
    video.addEventListener("error", onError);
    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("volumechange", onVolume);

    return () => {
      cancelled = true;
      video.removeEventListener("error", onError);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("volumechange", onVolume);
    };
  }, [fetchAllowed, av1, h264, poster]);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      muteOthers(video);
      video.muted = false;
      video.volume = 1;
      if (video.paused) video.play().catch(() => {});
      return;
    }
    video.muted = true;
  }

  if (!media?.av1 || !media?.h264 || !media?.poster) return null;

  const title = tCampaign(campaign.theme);
  const titleAr = tCampaign(campaign.theme, "ar");
  const description = tCampaign(campaign.description);
  const descriptionAr = tCampaign(campaign.description, "ar");
  const bookLabel = tCampaign(campaign.bookLabel) || "Book now";
  const message = tCampaign(campaign.bookMessage) || description || title;
  const href = CONTACT.whatsapp.url(message);
  const watchLabel = tCampaign(campaign.watchLabel) || "Watch with sound";
  const watchUrl = campaign.watchUrl || "";
  const soundEn = tCampaign(campaign.soundLabel) || "Tap for sound";
  const soundAr = tCampaign(campaign.soundLabel, "ar");
  const muteEn = tCampaign(campaign.muteLabel) || "Mute";
  const muteAr = tCampaign(campaign.muteLabel, "ar");
  const soundText = muted ? soundEn : muteEn;
  const soundTextAr = muted ? soundAr : muteAr;
  const soundAria =
    soundTextAr && soundTextAr !== soundText ? `${soundText}. ${soundTextAr}` : soundText;
  const TitleTag = placement === "page" ? "h1" : "h2";
  const titleId = `${campaign.id}-title`;

  return (
    <section
      ref={stageRef}
      className={`${styles.band}${placement === "page" ? ` ${styles.page}` : ""}`}
      aria-labelledby={titleId}
    >
      <div className={styles.stage}>
        <Image
          src={media.poster}
          alt=""
          fill
          sizes="(min-width: 900px) 24rem, 100vw"
          className={styles.poster}
          priority={placement === "page"}
        />
        <video
          ref={videoRef}
          className={
            failed ? styles.filmHidden : ready ? `${styles.film} ${styles.filmReady}` : styles.film
          }
          muted
          playsInline
          loop
          preload="none"
          disablePictureInPicture
          aria-label={title}
        />
        <button
          type="button"
          className={styles.sound}
          onClick={toggleSound}
          disabled={failed || !ready}
          aria-pressed={!muted}
          aria-label={soundAria}
        >
          <span className={styles.soundChip}>
            {muted ? <VolumeX size={18} aria-hidden /> : <Volume2 size={18} aria-hidden />}
            <span className={styles.soundWords}>
              <span className={styles.soundWord}>{soundText}</span>
              {soundTextAr && soundTextAr !== soundText ? (
                <span className={styles.soundWordAr} lang="ar" dir="rtl">
                  {soundTextAr}
                </span>
              ) : null}
            </span>
          </span>
        </button>
      </div>

      <div className={styles.copy}>
        <div className={styles.titles}>
          <TitleTag id={titleId} className={styles.titleEn}>
            {title}
          </TitleTag>
          {titleAr && titleAr !== title ? (
            <p className={styles.titleAr} lang="ar" dir="rtl">
              {titleAr}
            </p>
          ) : null}
        </div>
        {description ? <p className={styles.textEn}>{description}</p> : null}
        {descriptionAr && descriptionAr !== description ? (
          <p className={styles.textAr} lang="ar" dir="rtl">
            {descriptionAr}
          </p>
        ) : null}
        <div className={styles.actions}>
          <a
            href={href}
            className={styles.book}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              recordOutbound(href, {
                branch: "galleria",
                gtm: true,
                gtmBranch: "Galleria",
                placement: campaign.id,
                services: [{ id: campaign.id, name: title || description }],
              })
            }
          >
            {bookLabel}
          </a>
          {watchUrl ? (
            <a
              href={watchUrl}
              className={styles.watch}
              target="_blank"
              rel="noopener noreferrer"
            >
              {watchLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
