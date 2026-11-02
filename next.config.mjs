/** @type {import('next').NextConfig} */
const contentSecurityPolicy = [
  // 'unsafe-inline' matches the inline GTM bootstrap in src/app/layout.jsx and Next's own inline scripts.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://va.vercel-scripts.com https://www.instagram.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://vitals.vercel-insights.com https://va.vercel-scripts.com https://api.openai.com https://beauty-admin-mauve.vercel.app https://wa.me https://kenbeauty.zenoti.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://pagead2.googlesyndication.com https://adservice.google.com https://www.facebook.com https://connect.facebook.net",
  "img-src 'self' https://res.cloudinary.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://upload.wikimedia.org https://tools.applemediaservices.com https://www.instagram.com https://www.google.com https://googleads.g.doubleclick.net https://*.doubleclick.net https://www.googleadservices.com https://www.facebook.com",
  "media-src 'self' blob: https://res.cloudinary.com",
  "font-src 'self'",
  "frame-src 'self' https://www.googletagmanager.com https://www.instagram.com https://cdn.lightwidget.com https://kenbeauty.zenoti.com https://td.doubleclick.net https://*.doubleclick.net https://www.facebook.com",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // Admin service-catalog media can come from any Cloudinary cloud.
        pathname: "/**",
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
