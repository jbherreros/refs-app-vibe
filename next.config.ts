import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d342nivl766nuq.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
