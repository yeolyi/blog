import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { withPigment } from "@pigment-css/nextjs-plugin";
import remarkGfm from "remark-gfm";

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
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  compiler: {
    styledComponents: true,
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
});

export default withPigment(withMDX(nextConfig));
