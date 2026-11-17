import { describe, expect, it } from "vitest";
import { jsonLdHtml } from "@/lib/seo/jsonLd";

describe("jsonLdHtml", () => {
  it("prints the structured data as JSON", () => {
    expect(jsonLdHtml({ "@type": "AboutPage", name: "About" })).toBe(
      '{"@type":"AboutPage","name":"About"}',
    );
  });

  it("escapes < so a value cannot close the script tag", () => {
    const html = jsonLdHtml({
      text: '</script><script>alert("x")',
    });
    expect(html).not.toContain("<");
    expect(html).toContain("\\u003c/script>");
  });
});
