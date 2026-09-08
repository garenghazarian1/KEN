import { describe, expect, it } from "vitest";
import { getScrollTopToAlign } from "./scrollChildToContainerTop";

function fakeBox(scrollTop, scrollHeight, clientHeight, top) {
  return {
    scrollTop,
    scrollHeight,
    clientHeight,
    getBoundingClientRect: () => ({ top }),
  };
}

describe("getScrollTopToAlign", () => {
  it("scrolls so the child top matches the container top", () => {
    const container = fakeBox(100, 2000, 400, 80);
    const child = { getBoundingClientRect: () => ({ top: 320 }) };
    expect(getScrollTopToAlign(container, child)).toBe(340);
  });

  it("does not scroll past the end of the container", () => {
    const container = fakeBox(0, 500, 400, 0);
    const child = { getBoundingClientRect: () => ({ top: 300 }) };
    expect(getScrollTopToAlign(container, child)).toBe(100);
  });

  it("does not scroll above 0", () => {
    const container = fakeBox(20, 800, 400, 200);
    const child = { getBoundingClientRect: () => ({ top: 80 }) };
    expect(getScrollTopToAlign(container, child)).toBe(0);
  });
});
