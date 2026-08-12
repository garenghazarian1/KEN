import { describe, expect, it } from "vitest";
import {
  expandCatalogQueryForSearch,
  expandWithSynonyms,
  parseKeywordArray,
} from "./catalogQueryExpand";
import { buildServiceSearchCatalog, searchServices } from "@/lib/business/serviceSearch";

describe("expandWithSynonyms", () => {
  it("maps barber cut phrasing to men/barber/haircut terms", () => {
    const { terms, matchedRuleIds } = expandWithSynonyms(
      "How much is the barber cut?"
    );
    expect(matchedRuleIds).toContain("mens_barber_cut");
    expect(terms).toEqual(
      expect.arrayContaining(["barber", "men", "haircut", "cut"])
    );
  });

  it("maps Arabic men's cut phrasing", () => {
    const { terms, matchedRuleIds } = expandWithSynonyms("كم سعر قص شعر رجالي؟");
    expect(matchedRuleIds).toContain("mens_barber_ar");
    expect(terms).toEqual(expect.arrayContaining(["barber", "men", "haircut"]));
  });

  it("maps nail phrasing generally", () => {
    const { matchedRuleIds, terms } = expandWithSynonyms(
      "I need a gel manicure price"
    );
    expect(matchedRuleIds).toContain("nails");
    expect(terms).toEqual(expect.arrayContaining(["nails", "manicure", "gel"]));
  });

  it("maps facial phrasing generally", () => {
    const { matchedRuleIds } = expandWithSynonyms("deep clean facial cost?");
    expect(matchedRuleIds).toContain("facial");
  });
});

describe("parseKeywordArray", () => {
  it("parses a JSON array from the model", () => {
    expect(parseKeywordArray('["men", "haircut", "barber"]')).toEqual([
      "men",
      "haircut",
      "barber",
    ]);
  });

  it("tolerates markdown fences around JSON", () => {
    expect(parseKeywordArray('```json\n["nails","gel"]\n```')).toEqual([
      "nails",
      "gel",
    ]);
  });
});

describe("expandCatalogQueryForSearch", () => {
  it("builds a search query that finds Men's Haircut for barber cut", async () => {
    const sections = [
      {
        id: "barber",
        title: "Barber",
        items: [
          {
            id: "mens-cut",
            name: "Men's Haircut",
            priceLabel: "85 AED",
            description: "Classic gentlemen cut",
          },
        ],
        groups: [],
      },
      {
        id: "hair",
        title: "All About Hair",
        items: [
          {
            id: "wash-blow",
            name: "Wash & Blow Dry",
            priceLabel: "65 AED",
            description: "",
          },
        ],
        groups: [],
      },
    ];
    const catalog = buildServiceSearchCatalog(sections);

    const direct = searchServices(catalog, "How much is the barber cut?", 5);
    const expanded = await expandCatalogQueryForSearch(
      "How much is the barber cut?",
      { skipLlm: true }
    );
    const smart = searchServices(catalog, expanded.searchQuery, 5);

    expect(smart.some((hit) => hit.item.id === "mens-cut")).toBe(true);
    // Document that the raw guest phrasing may miss without expansion.
    if (!direct.some((hit) => hit.item.id === "mens-cut")) {
      expect(expanded.terms).toEqual(
        expect.arrayContaining(["barber", "haircut"])
      );
    }
  });

  it("accepts LLM rewrite keywords for unrelated guest wording", async () => {
    const fakeOpenAi = {
      chat: {
        completions: {
          create: async () => ({
            choices: [
              {
                message: {
                  content: '["facial", "deep cleansing", "skin"]',
                },
              },
            ],
          }),
        },
      },
    };

    const expanded = await expandCatalogQueryForSearch(
      "I want my face cleaned properly, what do you charge?",
      { openai: fakeOpenAi }
    );
    expect(expanded.usedLlm).toBe(true);
    expect(expanded.terms).toEqual(
      expect.arrayContaining(["facial", "deep cleansing", "skin"])
    );
  });
});
