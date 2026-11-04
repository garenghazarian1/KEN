import { describe, expect, it } from "vitest";
import { heroFileBuffered } from "./heroFetchGate";

function video(duration, end) {
  return {
    duration,
    buffered: {
      length: end == null ? 0 : 1,
      end: () => end,
    },
  };
}

describe("heroFileBuffered", () => {
  it("waits until the buffer covers the file", () => {
    expect(heroFileBuffered(video(10, 9))).toBe(false);
    expect(heroFileBuffered(video(10, 9.8))).toBe(true);
  });

  it("stays closed when the file length is unknown", () => {
    expect(heroFileBuffered(video(Number.NaN, 1))).toBe(false);
    expect(heroFileBuffered(video(10, null))).toBe(false);
    expect(heroFileBuffered(null)).toBe(false);
  });
});
