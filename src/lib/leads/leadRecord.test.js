import { describe, expect, it } from "vitest";
import { classifyHref, parseLeadBody } from "@/lib/leads/leadRecord";

describe("classifyHref", () => {
  it("reads a Galleria WhatsApp link", () => {
    expect(
      classifyHref(
        "https://wa.me/971503043570?text=Hello"
      )
    ).toEqual({
      eventType: "whatsapp",
      target: "971503043570",
      branch: "galleria",
    });
  });

  it("reads a Rixos phone link", () => {
    expect(classifyHref("tel:+971555570029")).toEqual({
      eventType: "phone",
      target: "971555570029",
      branch: "rixos",
    });
  });

  it("keeps only the salon email", () => {
    expect(classifyHref("mailto:info@ken-salon.com?subject=Hi")).toEqual({
      eventType: "email",
      target: "info@ken-salon.com",
      branch: null,
    });
    expect(classifyHref("mailto:garenghazarian1@gmail.com")).toBeNull();
  });

  it("reads directions and ignores other sites", () => {
    const href =
      "https://www.google.com/maps/search/?api=1&query=Ken%20Beauty%20Rixos%20Marina";
    expect(classifyHref(href)?.eventType).toBe("directions");
    expect(classifyHref(href)?.branch).toBe("rixos");
    expect(classifyHref("https://www.instagram.com/ken_beauty_ad")).toBeNull();
  });
});

describe("parseLeadBody", () => {
  it("keeps booking services only on WhatsApp", () => {
    const parsed = parseLeadBody({
      eventId: "event_1234567890abcdef",
      eventType: "whatsapp",
      branch: "rixos",
      target: "971503043570",
      services: [{ id: "a", name: "Hydrafacial" }],
    });
    expect(parsed.eventId).toBe("event_1234567890abcdef");
    expect(parsed.branch).toBe("galleria");
    expect(parsed.services).toEqual([{ id: "a", name: "Hydrafacial" }]);
  });

  it("drops services on a phone click and rejects a personal email", () => {
    expect(
      parseLeadBody({
        eventType: "phone",
        target: "97126218808",
        services: [{ name: "Hydrafacial" }],
      }).services
    ).toEqual([]);
    expect(
      parseLeadBody({
        eventType: "email",
        target: "someone@gmail.com",
      })
    ).toBeNull();
  });

  it("rejects unknown contact targets and invalid click identifiers", () => {
    expect(
      parseLeadBody({
        eventType: "whatsapp",
        target: "971501234567",
      })
    ).toBeNull();
    expect(
      parseLeadBody({
        eventType: "whatsapp",
        target: "971503043570",
        gclid: "TEST123",
      })
    ).toBeNull();
  });

  it("keeps the visitor language, timezone, screen, and referrer", () => {
    const parsed = parseLeadBody({
      eventType: "phone",
      target: "97126218808",
      language: "ar-AE",
      timezone: "Asia/Dubai",
      screen: { w: 390, h: 844, dpr: 3 },
      referrer: "https://www.google.com/",
    });
    expect(parsed).toMatchObject({
      language: "ar-AE",
      timezone: "Asia/Dubai",
      screen: { w: 390, h: 844, dpr: 3 },
      referrer: "https://www.google.com/",
    });
  });

  it("keeps the first-touch visit fields", () => {
    const parsed = parseLeadBody({
      eventType: "phone",
      target: "97126218808",
      visitId: "visit-abcdef123456",
      landingUrl: "https://ken-salon.com/en?utm_source=meta",
      landingReferrer: "https://l.facebook.com/",
      landedAt: "2026-10-05T10:00:00.000Z",
      pageUrl: "https://ken-salon.com/en/contact",
      utmSource: "meta",
      utmMedium: "paid",
      utmCampaign: "spring",
      utmContent: "a1",
      utmTerm: "lashes",
      fbclid: "FB123",
      ttclid: "TT456",
      msclkid: "MS789",
      placement: "footer",
      secondsOnSite: 89.6,
    });
    expect(parsed).toMatchObject({
      visitId: "visit-abcdef123456",
      landingUrl: "https://ken-salon.com/en?utm_source=meta",
      landingReferrer: "https://l.facebook.com/",
      landedAt: new Date("2026-10-05T10:00:00.000Z"),
      pageUrl: "https://ken-salon.com/en/contact",
      utmSource: "meta",
      utmTerm: "lashes",
      fbclid: "FB123",
      ttclid: "TT456",
      msclkid: "MS789",
      placement: "footer",
      secondsOnSite: 90,
    });
  });

  it("turns missing or bad first-touch fields into null without rejecting the click", () => {
    const old = parseLeadBody({ eventType: "phone", target: "97126218808" });
    expect(old).not.toBeNull();
    for (const key of [
      "visitId",
      "landingUrl",
      "landingReferrer",
      "landedAt",
      "pageUrl",
      "utmSource",
      "fbclid",
      "placement",
      "secondsOnSite",
    ]) {
      expect(old[key]).toBeNull();
    }

    const bad = parseLeadBody({
      eventType: "phone",
      target: "97126218808",
      visitId: "x",
      landingUrl: "javascript:alert(1)",
      landingReferrer: { not: "text" },
      landedAt: "not a date",
      pageUrl: "/relative/path",
      utmSource: 42,
      fbclid: "has spaces",
      ttclid: "x".repeat(201),
      placement: "two words",
      secondsOnSite: "12",
    });
    expect(bad).toMatchObject({
      eventType: "phone",
      visitId: null,
      landingUrl: null,
      landingReferrer: null,
      landedAt: null,
      pageUrl: null,
      utmSource: null,
      fbclid: null,
      ttclid: null,
      placement: null,
      secondsOnSite: null,
    });
    expect(
      parseLeadBody({ eventType: "phone", target: "97126218808", secondsOnSite: -5 })
        .secondsOnSite,
    ).toBeNull();
  });

  it("clips long first-touch strings", () => {
    const parsed = parseLeadBody({
      eventType: "phone",
      target: "97126218808",
      landingUrl: `https://ken-salon.com/?q=${"a".repeat(900)}`,
      landingReferrer: "r".repeat(900),
      utmCampaign: "c".repeat(900),
    });
    expect(parsed.landingUrl).toHaveLength(500);
    expect(parsed.landingReferrer).toHaveLength(500);
    expect(parsed.utmCampaign).toHaveLength(200);
  });

  it("keeps only the pathname from a click event", () => {
    const parsed = parseLeadBody({
      eventType: "phone",
      target: "97126218808",
      pagePath: "/contact?private=value#branch",
    });
    expect(parsed.pagePath).toBe("/contact");
  });
});
