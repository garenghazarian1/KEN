import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  cacheLife: () => {},
  cacheTag: () => {},
}));

import { trimServiceSections } from "./serviceCatalog";

describe("trimServiceSections", () => {
  it("keeps menu fields, the first image, and the original order", () => {
    const trimmed = trimServiceSections([
      {
        id: "cat-b",
        title: "Nails",
        sortOrder: 2,
        videoUrl: "https://example.com/nails.mp4",
        imageUrls: ["https://example.com/nails-1.jpg", "https://example.com/nails-2.jpg"],
        groups: [
          {
            id: "sub-1",
            title: "Manicure",
            sortOrder: 1,
            videoUrl: "https://example.com/mani.mp4",
            imageUrls: ["https://example.com/mani-1.jpg", "https://example.com/mani-2.jpg"],
            items: [
              {
                id: "item-2",
                name: "Gel",
                defaultPrice: 80,
                priceLabel: "80 AED",
                priceCompareAtLabel: null,
                priceDisplayType: "fixed",
                durationMinutes: 45,
                description: "Gel colour",
                sortOrder: 2,
                categoryIds: ["sub-1"],
                imageUrls: ["https://example.com/gel-1.jpg", "https://example.com/gel-2.jpg"],
                videoUrl: "https://example.com/gel.mp4",
              },
              {
                id: "item-1",
                name: "Classic",
                defaultPrice: 50,
                priceLabel: "50 AED",
                priceCompareAtLabel: "70 AED",
                priceDisplayType: "sale",
                durationMinutes: undefined,
                description: null,
                sortOrder: 1,
                categoryIds: ["sub-1", "cat-b"],
                imageUrls: [],
                videoUrl: null,
              },
            ],
          },
        ],
      },
    ]);

    expect(trimmed).toEqual([
      {
        id: "cat-b",
        title: "Nails",
        items: undefined,
        groups: [
          {
            id: "sub-1",
            title: "Manicure",
            items: [
              {
                id: "item-2",
                name: "Gel",
                defaultPrice: 80,
                priceLabel: "80 AED",
                priceCompareAtLabel: null,
                priceDisplayType: "fixed",
                durationMinutes: 45,
                description: "Gel colour",
                imageUrls: ["https://example.com/gel-1.jpg"],
              },
              {
                id: "item-1",
                name: "Classic",
                defaultPrice: 50,
                priceLabel: "50 AED",
                priceCompareAtLabel: "70 AED",
                priceDisplayType: "sale",
                durationMinutes: undefined,
                description: null,
                imageUrls: [],
              },
            ],
            imageUrls: ["https://example.com/mani-1.jpg"],
          },
        ],
        imageUrls: ["https://example.com/nails-1.jpg"],
      },
    ]);
    expect(JSON.stringify(trimmed)).not.toMatch(/sortOrder|categoryIds|videoUrl/);
  });
});
