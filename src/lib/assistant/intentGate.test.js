import { describe, expect, it } from "vitest";
import {
  detectEscalation,
  matchFaqEntries,
  resolveLocationRequest,
} from "./intentGate.js";
import { drinksMenu } from "@/data/drinks";

describe("detectEscalation", () => {
  it("escalates booking-account credential help without a bare password keyword", () => {
    expect(detectEscalation("I forgot my password")?.reason).toBe(
      "booking_account"
    );
    expect(detectEscalation("I need to reset my password")?.reason).toBe(
      "booking_account"
    );
    expect(detectEscalation("My password is wrong")?.reason).toBe(
      "booking_account"
    );
  });
});

describe("matchFaqEntries", () => {
  it("grounds drink questions from the drinks menu data", () => {
    const entries = matchFaqEntries("What drinks do you have?");
    expect(entries.some((e) => e.id === "drinks")).toBe(true);
    const drinks = entries.find((e) => e.id === "drinks");
    expect(drinks.answer).toContain("complimentary");
    expect(drinks.answer).toContain(drinksMenu.hotDrinks[0]);
    expect(drinks.answer).toContain("https://www.kenbeautysalon.com/drinks");
  });

  it("grounds founder / about questions with Vicken Ghazarian", () => {
    const entries = matchFaqEntries("Who is the founder? Is it Ken or Viken?");
    expect(entries.some((e) => e.id === "about_founder")).toBe(true);
    const about = entries.find((e) => e.id === "about_founder");
    expect(about.answer).toContain("Vicken Ghazarian");
    expect(about.answer).toContain("https://www.kenbeautysalon.com/about");
  });

  it("grounds gallery questions with the gallery URL", () => {
    const entries = matchFaqEntries("Do you have a photo gallery?");
    expect(entries.some((e) => e.id === "gallery")).toBe(true);
    expect(entries.find((e) => e.id === "gallery").answer).toContain(
      "https://www.kenbeautysalon.com/gallery"
    );
  });
});

describe("resolveLocationRequest", () => {
  it("returns both exact addresses and directions for a general request", () => {
    const result = resolveLocationRequest("Can you give me the address?");

    expect(result?.reply).toContain(
      "The Galleria Al Maryah Island - 107 Hamouda Bin Ali Al Dhaheri St"
    );
    expect(result?.reply).toContain(
      "Rixos Hotel, Marina - Al Kasir - Al Marina"
    );
    expect(result?.actions).toHaveLength(2);
    expect(result?.actions[0].url).toMatch(
      /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/
    );
  });

  it("keeps address intent across a short Galleria follow-up", () => {
    const result = resolveLocationRequest(
      "Can you give me the adress? yes galeria"
    );

    expect(result?.reply).toContain("Here is the exact branch address:");
    expect(result?.reply).toContain("107 Hamouda Bin Ali Al Dhaheri St");
    expect(result?.reply).not.toContain("Rixos Hotel, Marina");
    expect(result?.actions).toHaveLength(1);
    expect(result?.actions[0].label).toContain("The Galleria");
  });

  it("does not hijack non-location branch questions", () => {
    expect(
      resolveLocationRequest("What hair services are at Galleria?")
    ).toBeNull();
  });
});
