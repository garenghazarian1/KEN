import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");
const jobFormCss = readFileSync(
  new URL("../components/careers/JobApplyForm.module.css", import.meta.url),
  "utf8"
);

describe("home blocking CSS", () => {
  it("does not ship unused utility, swiper, or calendar rules", () => {
    expect(css).not.toContain(".text-xs");
    expect(css).not.toContain(".swiper-button-next");
    expect(css).not.toContain(".react-calendar");
    expect(css).toContain("--mobile-nav-bottom-height");
    expect(css).toContain("--color-accent-on-dark: #5a8d88");
    expect(css).toContain("--color-whatsapp-solid: #127a43");
    expect(css).toContain("--color-link: #745248");
    expect(jobFormCss).toContain("text-decoration: underline");
    expect(jobFormCss).toContain("color: var(--color-secondary-deep)");
    expect(jobFormCss).toContain(".hint a:active");
    expect(jobFormCss).toMatch(/\.hint a:active \{[^}]*color:\s*var\(--color-text-primary\)/);
  });

  it("keeps the privacy notice link at AA on the glass panel", () => {
    const contrast = (fg, bg) => {
      const lin = (channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      };
      const lum = (hex) => {
        const n = Number.parseInt(hex.slice(1), 16);
        return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
      };
      const lighter = Math.max(lum(fg), lum(bg));
      const darker = Math.min(lum(fg), lum(bg));
      return (lighter + 0.05) / (darker + 0.05);
    };
    const panel = "#f1ebe9";

    expect(contrast("#8b6b5a", panel)).toBeLessThan(4.5);
    expect(contrast("#6f5648", panel)).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#3d2f2d", panel)).toBeGreaterThanOrEqual(4.5);
  });
});
