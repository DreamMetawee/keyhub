import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your existing webpack config for SVGs
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.(js|ts)x?$/] },
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // ✅ ADDED: Configuration for external images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      // You can add more trusted hostnames here in the future
    ],
  },
};

export default nextConfig;
