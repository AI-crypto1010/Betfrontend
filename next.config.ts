import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // allow Vercel builds even if lint errors exist
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  }
};

export default nextConfig;
