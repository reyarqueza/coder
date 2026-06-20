import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  async headers() {
    const isolationHeaders = [
      {
        key: "Cross-Origin-Embedder-Policy",
        value: "credentialless",
      },
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin",
      },
    ];

    return [
      {
        source: "/:path*",
        headers: isolationHeaders,
      },
    ];
  },
};

export default nextConfig;
