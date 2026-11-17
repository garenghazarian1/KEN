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
  // Job pages load their description from the admin API. Waiting for that
  // metadata puts <meta name="description"> in <head>. Home metadata is static.
  htmlLimitedBots: /.*/,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: import.meta.dirname,
  },
  experimental: {
    cssChunking: {
      type: "graph",
      // Home's first screen imports the hero CSS only. A high cost merged
      // the below-fold film, gallery, and offers CSS into that same file,
      // so the home <head> blocked on about 30 KB it does not paint.
      // 2500 bytes is enough to split those files out, and still keeps
      // the shared layout CSS in one request.
      requestCost: 2500,
    },
    optimizePackageImports: ["motion", "lucide-react", "react-icons/fa"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [65, 75],
    localPatterns: [
      {
        pathname: "/assistant/**",
        search: "?v=3",
      },
      {
        pathname: "/**",
        search: "",
      },
    ],
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
};

export default nextConfig;
