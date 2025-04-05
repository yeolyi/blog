import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "yeolyi.com",
      },
      {
        protocol: "https",
        hostname: "djypfjnlicwuannconhq.supabase.co",
      },
    ],
  },
};

export default nextConfig;
