import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const footer = readFileSync(new URL("./Footer.modern.jsx", import.meta.url), "utf8");

describe("footer heading levels", () => {
  it("does not skip from the salon h2 to an h4", () => {
    expect(footer).not.toMatch(/<h4[\s>]/);
    expect(footer).toContain("<h2");
    expect(footer).toContain(">Quick Links</h3>");
    expect(footer).toContain(">Follow Us</h3>");
    expect(footer).toContain(">Get Our App</h3>");
  });
});
