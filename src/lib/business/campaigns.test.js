import { describe, expect, it } from "vitest";
import {
  formatCampaignPrice,
  getActiveCampaign,
  getZonedDateKey,
  isCampaignActive,
  tCampaign,
} from "./campaigns";

describe("campaigns helpers", () => {
  it("builds Asia/Dubai date keys", () => {
    const key = getZonedDateKey(new Date("2026-08-12T10:00:00+04:00"));
    expect(key).toBe("2026-08-12");
  });

  it("activates august campaign inside the window", () => {
    const campaign = getActiveCampaign(new Date("2026-08-12T12:00:00+04:00"));
    expect(campaign?.id).toBe("august-2026");
    expect(isCampaignActive(campaign, new Date("2026-08-31T23:00:00+04:00"))).toBe(
      true
    );
  });

  it("deactivates outside the window", () => {
    expect(getActiveCampaign(new Date("2026-07-31T23:00:00+04:00"))).toBeNull();
    expect(getActiveCampaign(new Date("2026-09-01T00:30:00+04:00"))).toBeNull();
  });

  it("localizes bilingual fields", () => {
    expect(tCampaign({ en: "Hello", ar: "مرحبا" }, "ar")).toBe("مرحبا");
    expect(tCampaign({ en: "Hello", ar: "مرحبا" }, "en")).toBe("Hello");
  });

  it("formats prices", () => {
    expect(formatCampaignPrice(600, "AED", "en")).toContain("600");
    expect(formatCampaignPrice(600, "AED", "en")).toContain("AED");
  });
});
