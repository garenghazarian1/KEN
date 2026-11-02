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
    expect(getActiveCampaign(new Date("2026-12-01T00:30:00+04:00"))).toBeNull();
  });

  it("activates the November iPhone offer unless it is sold out", () => {
    const now = new Date("2026-11-02T12:00:00+04:00");
    const campaign = getActiveCampaign(now);
    expect(campaign?.id).toBe("iphone-nov-2026");
    expect(campaign?.soldOut).toBe(false);
    expect(campaign?.price?.amount).toBe(500);
    expect(campaign?.subscriberLimit).toBe(200);
    expect(isCampaignActive(campaign, new Date("2026-11-01T00:30:00+04:00"))).toBe(
      true
    );
    expect(isCampaignActive(campaign, new Date("2026-11-30T23:00:00+04:00"))).toBe(
      true
    );
    expect(isCampaignActive({ ...campaign, soldOut: true }, now)).toBe(false);
  });

  it("activates pink october inside October", () => {
    const campaign = getActiveCampaign(new Date("2026-10-12T12:00:00+04:00"));
    expect(campaign?.id).toBe("pink-october-2026");
    expect(campaign?.packages).toBeUndefined();
    expect(isCampaignActive(campaign, new Date("2026-10-31T23:00:00+04:00"))).toBe(
      true
    );
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
