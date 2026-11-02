import { describe, expect, it } from "vitest";
import nextConfig from "./next.config.mjs";

const REQUIRED_HEADERS = {
  "Permissions-Policy": "microphone=(self), unload=()",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

describe("next.config security headers", () => {
  it("turns off X-Powered-By and sets the hardened headers on every path", async () => {
    expect(nextConfig.poweredByHeader).toBe(false);

    const rules = await nextConfig.headers();
    expect(rules).toHaveLength(1);
    expect(rules[0].source).toBe("/:path*");

    const headers = Object.fromEntries(rules[0].headers.map((header) => [header.key, header.value]));

    for (const [key, value] of Object.entries(REQUIRED_HEADERS)) {
      expect(headers[key]).toBe(value);
    }

    const csp = headers["Content-Security-Policy-Report-Only"];
    expect(csp).toEqual(expect.any(String));
    expect(headers["Content-Security-Policy"]).toBeUndefined();

    for (const directive of [
      "script-src",
      "connect-src",
      "img-src",
      "media-src",
      "frame-src",
      "font-src",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "base-uri 'self'",
    ]) {
      expect(csp).toContain(directive);
    }

    for (const host of [
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://va.vercel-scripts.com",
      "https://vitals.vercel-insights.com",
      "https://api.openai.com",
      "https://beauty-admin-mauve.vercel.app",
      "https://res.cloudinary.com",
      "https://www.instagram.com",
      "https://cdn.lightwidget.com",
      "https://kenbeauty.zenoti.com",
      "https://wa.me",
      "https://upload.wikimedia.org",
      "https://tools.applemediaservices.com",
      "https://www.googleadservices.com",
      "https://googleads.g.doubleclick.net",
      "https://connect.facebook.net",
      "https://www.google.com",
      "https://*.doubleclick.net",
      "https://pagead2.googlesyndication.com",
      "https://adservice.google.com",
      "https://www.facebook.com",
      "https://td.doubleclick.net",
    ]) {
      expect(csp).toContain(host);
    }
  });
});
