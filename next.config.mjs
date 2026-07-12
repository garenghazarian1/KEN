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
            value: "unload=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
