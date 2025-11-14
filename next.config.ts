import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Empty turbopack config to silence the warning
  turbopack: {},

  // ✅ CRITICAL: Tell Next.js to include Prisma engine files in serverless output
  outputFileTracingIncludes: {
    "/api/**": [
      "./node_modules/.prisma/client/**",
      "./node_modules/@prisma/client/**",
    ],
    "/app/api/**": [
      "./node_modules/.prisma/client/**",
      "./node_modules/@prisma/client/**",
    ],
  },

  // ✅ Next.js 16: Moved from experimental to root level
  serverExternalPackages: ["@prisma/client", "prisma"],

  webpack: (config, { isServer }) => {
    // Fix for PDF.js in Node.js environment
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "pdfjs-dist": "pdfjs-dist/legacy/build/pdf.min.mjs",
      };
    }

    return config;
  },
};

export default nextConfig;
