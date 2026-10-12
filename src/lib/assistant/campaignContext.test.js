import { describe, expect, it } from "vitest";
import {
  buildCampaignContext,
  formatCampaignContext,
  isCampaignQuery,
} from "./campaignContext";
import { CAMPAIGNS } from "@/data/campaigns";

const august = CAMPAIGNS.find((c) => c.id === "august-2026");

describe("isCampaignQuery", () => {
  it("matches English offer keywords", () => {
    expect(isCampaignQuery("What are the August offers?")).toBe(true);
    expect(isCampaignQuery("Tell me about the Mermaid package")).toBe(true);
    expect(isCampaignQuery("Hot Tuesday discount?")).toBe(true);
    expect(isCampaignQuery("Is the Pink October free haircut on?")).toBe(true);
  });

  it("matches Arabic offer keywords without word boundaries", () => {
    expect(isCampaignQuery("ما هي باقة حورية البحر؟")).toBe(true);
    expect(isCampaignQuery("عروض أغسطس")).toBe(true);
    expect(isCampaignQuery("عرض أكتوبر الوردي")).toBe(true);
  });

  it("ignores unrelated questions", () => {
    expect(isCampaignQuery("Where is the Galleria branch?")).toBe(false);
    expect(isCampaignQuery("What drinks do you have?")).toBe(false);
    expect(isCampaignQuery("What services do you offer?")).toBe(false);
  });
});

describe("formatCampaignContext", () => {
  it("includes bilingual package names and promo prices", () => {
    const text = formatCampaignContext(august);
    expect(text).toContain("Mermaid Package");
    expect(text).toContain("باقة حورية البحر");
    expect(text).toContain("600 AED");
    expect(text).toContain("Hot Tuesday");
    expect(text).toContain("/offers");
  });
});

describe("formatCampaignContext poster campaigns", () => {
  const october = CAMPAIGNS.find((c) => c.id === "pink-october-2026");

  it("quotes the free Monday haircut and does not invent packages", () => {
    const text = formatCampaignContext(october);
    expect(text).toContain("Get a free haircut every Monday");
    expect(text).toContain("قصة شعر مجانية كل يوم اثنين");
    expect(text).toContain("/offers");
    expect(text).not.toContain("Signature packages");
    expect(text).not.toContain("Hot Tuesday");
    expect(text).not.toContain("Mermaid");
    expect(text).toContain("Pink October in the UAE");
    expect(text).toContain("What we value");
  });
});

describe("buildCampaignContext", () => {
  it("returns campaign context for offer queries during the window", () => {
    const result = buildCampaignContext(
      "What August packages do you have?",
      new Date("2026-08-12T12:00:00+04:00")
    );
    expect(result.available).toBe(true);
    expect(result.sources).toContain("campaign:august-2026");
    expect(result.context).toContain("Glow Up Package");
  });

  it("returns pink october during October", () => {
    const result = buildCampaignContext(
      "Tell me about Pink October",
      new Date("2026-10-12T12:00:00+04:00")
    );
    expect(result.available).toBe(true);
    expect(result.sources).toContain("campaign:pink-october-2026");
    expect(result.context).toContain("free haircut");
  });

  it("returns empty context when inactive", () => {
    const result = buildCampaignContext(
      "August offers?",
      new Date("2026-09-02T12:00:00+04:00")
    );
    expect(result.available).toBe(false);
    expect(result.context).toBe("");
  });

  it("returns empty context for non-campaign questions while active", () => {
    const result = buildCampaignContext(
      "Where are you located?",
      new Date("2026-08-12T12:00:00+04:00")
    );
    expect(result.available).toBe(true);
    expect(result.context).toBe("");
    expect(result.sources).toEqual([]);
  });
});
