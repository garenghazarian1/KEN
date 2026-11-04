export const HERO_VIDEO_FETCHED = "ken-hero-video-fetched";

export const HERO_STILL = "/videos/hero/hero04.webp";

/** The hero file is in the buffer, so the next video may start its own download. */
export function heroFileBuffered(video) {
  if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return false;
  if (!video.buffered || video.buffered.length === 0) return false;
  return video.buffered.end(video.buffered.length - 1) >= video.duration - 0.25;
}

export function savesData() {
  return Boolean(navigator.connection && navigator.connection.saveData);
}

export function releaseHeroVideoFetch() {
  window.dispatchEvent(new Event(HERO_VIDEO_FETCHED));
}
