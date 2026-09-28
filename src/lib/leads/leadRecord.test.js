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
      eventType: "whatsapp",
      branch: "galleria",
      target: "971503043570",
      services: [{ id: "a", name: "Hydrafacial" }],
    });
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
});
