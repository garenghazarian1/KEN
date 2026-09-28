import { describe, expect, it } from "vitest";
import { productionClickId } from "@/lib/adsAttribution";

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
