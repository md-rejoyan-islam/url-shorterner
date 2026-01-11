import type { NextConfig } from "next";

// Internal backend URL for server-side calls (Docker network)
const INTERNAL_API_URL =
  process.env.INTERNAL_API_URL || "http://localhost:5080";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      // Proxy API calls from browser to backend
      {
        source: "/api/v1/:path*",
        destination: `${INTERNAL_API_URL}/api/v1/:path*`,
      },
      // Short URL redirects
      {
        source: "/r/:shortId",
        destination: `${INTERNAL_API_URL}/:shortId`,
      },
    ];
  },
};

export default nextConfig;
