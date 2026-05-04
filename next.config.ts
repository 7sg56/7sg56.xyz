import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },

  // Required for Sanity Studio (uses styled-components)
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
