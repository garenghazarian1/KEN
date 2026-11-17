/** Home loads only when the section is on screen. A paused hero does not block it. Offers loads on its own. */
export function shouldLoadFilm({ placement, intersecting }) {
  if (placement === "page") return true;
  return Boolean(intersecting);
}

/** The film never starts by itself. Only a click starts it. */
export function shouldPlayFilm(userAsked) {
  return userAsked === true;
}

/** The poster stays on top until the film is actually playing. */
export function shouldRevealFilm(playing) {
  return playing === true;
}

/** The sound chip only. A tap on the picture uses play, not this. */
export function pictureTap({ failed, fetchAllowed, muted }) {
  if (failed) return "none";
  if (!fetchAllowed) return "start-with-sound";
  return muted ? "unmute" : "mute";
}

/** Matches the sound button. Two lines stay two lines, with no slash between them. */
export function soundButtonLabel(soundText, soundTextAr) {
  const soundVisible = String(soundText || "").toLocaleUpperCase("en");
  if (soundTextAr && soundTextAr !== soundText) {
    return `${soundVisible}\n${soundTextAr}`;
  }
  return soundVisible;
}
