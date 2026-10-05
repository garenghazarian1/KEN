import { afterEach, describe, expect, it, vi } from "vitest";
import {
  captureFirstVisit,
  clearFirstVisit,
  visitFields,
} from "@/lib/leads/visit";

function stubBrowser({ href, referrer = "" }) {
  const store = new Map();
  const location = { href };
  vi.stubGlobal("window", {
    crypto: { randomUUID: () => "11111111-2222-3333-4444-555555555555" },
    location,
    sessionStorage: {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, value) => store.set(key, value),
      removeItem: (key) => store.delete(key),
    },
  });
  vi.stubGlobal("document", { referrer });
  return location;
}

describe("first-touch visit", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("saves the first page once and never overwrites it", () => {
    const location = stubBrowser({
      href: "https://ken-salon.com/en?utm_source=meta&utm_medium=paid&utm_campaign=spring&utm_content=a1&utm_term=lashes&fbclid=FB123&ttclid=TT456&msclkid=MS789",
      referrer: "https://l.facebook.com/",
    });
    captureFirstVisit();

    location.href = "https://ken-salon.com/en/services";
    captureFirstVisit();

    expect(visitFields()).toMatchObject({
      visitId: "11111111-2222-3333-4444-555555555555",
      landingUrl: expect.stringContaining("utm_source=meta"),
      landingReferrer: "https://l.facebook.com/",
      utmSource: "meta",
      utmMedium: "paid",
      utmCampaign: "spring",
      utmContent: "a1",
      utmTerm: "lashes",
      fbclid: "FB123",
      ttclid: "TT456",
      msclkid: "MS789",
    });
  });

  it("counts seconds since landing", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-05T10:00:00Z"));
    stubBrowser({ href: "https://ken-salon.com/en" });
    captureFirstVisit();

    vi.setSystemTime(new Date("2026-10-05T10:01:30Z"));
    expect(visitFields()).toMatchObject({
      landedAt: "2026-10-05T10:00:00.000Z",
      landingReferrer: null,
      secondsOnSite: 90,
      utmSource: null,
      fbclid: null,
    });
  });

  it("returns null fields when nothing was saved or consent was declined", () => {
    stubBrowser({ href: "https://ken-salon.com/en" });
    expect(visitFields()).toMatchObject({ visitId: null, secondsOnSite: null });

    captureFirstVisit();
    clearFirstVisit();
    expect(visitFields().visitId).toBeNull();
  });

  it("does nothing when sessionStorage is unavailable", () => {
    vi.stubGlobal("window", { location: { href: "https://ken-salon.com/" } });
    vi.stubGlobal("document", { referrer: "" });
    expect(() => captureFirstVisit()).not.toThrow();
    expect(visitFields().visitId).toBeNull();
  });
});
