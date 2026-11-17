import bundleAnalyzer from "@next/bundle-analyzer";
import fs from "fs";
import path from "path";

const preloadedFontFiles = [];

/** @type {import('next').NextConfig} */
const contentSecurityPolicy = [
  // 'unsafe-inline' matches the inline GTM bootstrap in src/app/layout.jsx and Next's own inline scripts.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://va.vercel-scripts.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://vitals.vercel-insights.com https://va.vercel-scripts.com https://api.openai.com https://beauty-admin-mauve.vercel.app https://wa.me https://kenbeauty.zenoti.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://pagead2.googlesyndication.com https://adservice.google.com https://www.facebook.com https://connect.facebook.net",
  "img-src 'self' https://res.cloudinary.com https://beauty-admin-mauve.vercel.app https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://upload.wikimedia.org https://tools.applemediaservices.com https://www.google.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://www.googleadservices.com https://www.facebook.com",
  "media-src 'self' blob: https://res.cloudinary.com",
  "font-src 'self'",
  "frame-src 'self' https://www.googletagmanager.com https://kenbeauty.zenoti.com https://td.doubleclick.net https://*.doubleclick.net https://www.facebook.com",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const nextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "react-icons/fa"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // Admin service-catalog media can come from any Cloudinary cloud.
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "beauty-admin-mauve.vercel.app",
        pathname: "/job-logos/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            // Explicit mic allow for Safari / embedded WebViews; unload stays blocked.
            value: "microphone=(self), unload=()",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
        ],
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<sub>.*)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  webpack(config) {
    config.plugins.push({
      apply(compiler) {
        const writeManifest = () => {
          if (!preloadedFontFiles.length) return;
          const manifestPath = path.join(process.cwd(), ".next/server/next-font-manifest.json");
          const jsPath = path.join(process.cwd(), ".next/server/next-font-manifest.js");
          if (!fs.existsSync(manifestPath)) return;
          const json = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
          const filled = Object.values(json.app || {}).some(
            (files) => Array.isArray(files) && files.length > 0,
          );
          if (filled) return;
          const layoutKey = path
            .resolve("src/app/layout.jsx")
            .replace(/\.jsx$/, "")
            .replace(/^([A-Z]):/, (_, drive) => `${drive.toLowerCase()}:`);
          json.app[layoutKey] = preloadedFontFiles;
          const source = JSON.stringify(json);
          fs.writeFileSync(manifestPath, source);
          if (fs.existsSync(jsPath)) {
            fs.writeFileSync(jsPath, `self.__NEXT_FONT_MANIFEST=${JSON.stringify(source)}`);
          }
        };

        compiler.hooks.thisCompilation.tap("KenFontPreload", (compilation) => {
          compilation.hooks.processAssets.tap(
            {
              name: "KenFontPreload",
              stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
            },
            () => {
              const found = Object.keys(compilation.assets)
                .filter((name) => name.endsWith(".p.woff2"))
                .map((name) => name.replace(/^(\.\.\/)+/, "").replace(/^\//, ""));
              if (found.length) preloadedFontFiles.splice(0, preloadedFontFiles.length, ...found);
            },
          );
        });
        compiler.hooks.done.tap("KenFontPreload", writeManifest);
      },
    });
    return config;
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

export default process.env.ANALYZE === "true"
  ? withBundleAnalyzer(nextConfig)
  : nextConfig;
