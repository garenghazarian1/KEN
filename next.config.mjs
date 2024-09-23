/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dzzm7ye56/**", // Adjust this path to match your specific image paths
      },
    ],
  },
};

export default nextConfig;
