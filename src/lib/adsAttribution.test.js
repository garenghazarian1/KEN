import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  captureAdsAttributionFromUrl,
  clearAdsAttribution,
  getAdsAttribution,
  productionClickId,
} from "@/lib/adsAttribution";

function localStorageStub() {
  const values = new Map();
  return {
    getItem: vi.fn((key) => values.get(key) ?? null),
    setItem: vi.fn((key, value) => values.set(key, String(value))),
    removeItem: vi.fn((key) => values.delete(key)),
  };
}

describe("productionClickId", () => {
  it("rejects a test ref", () => {
    expect(productionClickId("TEST123")).toBeNull();
    expect(productionClickId("test")).toBeNull();
  });

  it("keeps a real click id", () => {
    const gclid = "CjwKCAjw1234567890abcdef";
    expect(productionClickId(gclid)).toBe(gclid);
  });
});

describe("ads attribution persistence", () => {
  beforeEach(() => {
    global.window = {
      localStorage: localStorageStub(),
      location: { pathname: "/services", search: "" },
    };
    global.document = { cookie: "" };
  });

  afterEach(() => {
    delete global.window;
    delete global.document;
  });

  it("replaces identifiers when a later ad visit arrives", () => {
    window.location.search = "?gclid=CjwKCAjw1234567890abcdef";
    captureAdsAttributionFromUrl();

    window.location.search = "?wbraid=CAESF0longerSecondVisitId";
    captureAdsAttributionFromUrl();

    expect(getAdsAttribution()).toMatchObject({
      wbraid: "CAESF0longerSecondVisitId",
    });
    expect(getAdsAttribution()).not.toHaveProperty("gclid");
  });

  it("clears stored attribution", () => {
    window.location.search = "?gclid=CjwKCAjw1234567890abcdef";
    captureAdsAttributionFromUrl();

    clearAdsAttribution();

    expect(getAdsAttribution()).toBeNull();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(
      "ken_ads_attribution",
    );
  });
});
