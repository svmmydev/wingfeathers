import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.wingfeathers.eu",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
