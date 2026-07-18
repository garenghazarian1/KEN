/** @type {import('next').NextConfig} */
// redeploy trigger
const nextConfig = {
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
        ],
      },
    ];
  },
};

export default nextConfig;
