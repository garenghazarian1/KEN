import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { BASE_URL } from "@/config/constants";

const EXPECTED_URLS = [
  BASE_URL,
  `${BASE_URL}/services`,
  `${BASE_URL}/services/how-to-book`,
  `${BASE_URL}/offers`,
  `${BASE_URL}/about`,
  `${BASE_URL}/gallery`,
  `${BASE_URL}/drinks`,
  `${BASE_URL}/contact`,
  `${BASE_URL}/careers`,
  `${BASE_URL}/privacy`,
  `${BASE_URL}/imprint`,
  `${BASE_URL}/terms-of-use`,
  `${BASE_URL}/cookie-notice`,
];

describe("sitemap", () => {
  it("lists exactly the 13 public pages", () => {
    const entries = sitemap();

    expect(entries.map((entry) => entry.url)).toEqual(EXPECTED_URLS);

    for (const entry of entries) {
      expect(entry.url.startsWith(BASE_URL)).toBe(true);
      expect(entry.url.endsWith("/")).toBe(false);
      expect(entry.url).not.toMatch(/deleteAccount|test-/);
      expect(Number.isNaN(new Date(entry.lastModified).getTime())).toBe(false);
    }
  });
});
