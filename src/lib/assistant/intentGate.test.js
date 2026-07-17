import { describe, expect, it } from "vitest";
import { resolveLocationRequest } from "./intentGate.js";

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
