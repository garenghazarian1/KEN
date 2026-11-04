import { describe, expect, it } from "vitest";
import { shouldLoadFilm } from "./filmLoadGate";

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
