import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Unoptimized for local SVG placeholders; remove when using real images
    unoptimized: true,
  },
};

export default nextConfig;
