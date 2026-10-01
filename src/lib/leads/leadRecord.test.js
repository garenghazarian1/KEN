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

  it("keeps only the pathname from a click event", () => {
    const parsed = parseLeadBody({
      eventType: "phone",
      target: "97126218808",
      pagePath: "/contact?private=value#branch",
    });
    expect(parsed.pagePath).toBe("/contact");
  });
});
