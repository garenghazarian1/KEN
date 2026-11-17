import { describe, expect, it } from "vitest";
import {
  pictureTap,
  shouldLoadFilm,
  shouldPlayFilm,
  shouldRevealFilm,
  soundButtonLabel,
} from "./filmLoadGate";

describe("shouldLoadFilm", () => {
  it("does not load the home film before it is on screen", () => {
    expect(shouldLoadFilm({ placement: "home", intersecting: false, heroReady: true })).toBe(
      false
    );
  });

  it("loads the home film on screen even when the hero is not ready", () => {
    expect(shouldLoadFilm({ placement: "home", intersecting: true, heroReady: false })).toBe(
      true
    );
  });

  it("loads the home film on screen when the hero is ready", () => {
    expect(shouldLoadFilm({ placement: "home", intersecting: true, heroReady: true })).toBe(
      true
    );
  });

  it("loads the offers film without waiting for the screen", () => {
    expect(shouldLoadFilm({ placement: "page", intersecting: false, heroReady: false })).toBe(
      true
    );
  });
});

describe("shouldPlayFilm", () => {
  it("does not start the film until a click", () => {
    expect(shouldPlayFilm(false)).toBe(false);
    expect(shouldPlayFilm(undefined)).toBe(false);
  });

  it("starts the film after a click", () => {
    expect(shouldPlayFilm(true)).toBe(true);
  });
});

describe("shouldRevealFilm", () => {
  it("keeps the poster up until the film is playing", () => {
    expect(shouldRevealFilm(false)).toBe(false);
    expect(shouldRevealFilm(true)).toBe(true);
  });
});

describe("pictureTap", () => {
  it("starts the film with sound before the file is fetched", () => {
    expect(pictureTap({ failed: false, fetchAllowed: false, muted: true })).toBe(
      "start-with-sound"
    );
  });

  it("turns sound on or off once the film can play", () => {
    expect(pictureTap({ failed: false, fetchAllowed: true, muted: true })).toBe("unmute");
    expect(pictureTap({ failed: false, fetchAllowed: true, muted: false })).toBe("mute");
  });

  it("does nothing when the film failed", () => {
    expect(pictureTap({ failed: true, fetchAllowed: false, muted: true })).toBe("none");
  });
});

describe("soundButtonLabel", () => {
  it("matches the visible sound label", () => {
    expect(soundButtonLabel("Tap for sound", "اضغطي للصوت")).toBe(
      "TAP FOR SOUND\nاضغطي للصوت"
    );
    expect(soundButtonLabel("Mute", "كتمي الصوت")).toBe("MUTE\nكتمي الصوت");
    expect(soundButtonLabel("Tap for sound", "Tap for sound")).toBe("TAP FOR SOUND");
  });
});
