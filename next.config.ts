import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Empty turbopack config to silence the warning
  turbopack: {},
  
  webpack: (config, { isServer }) => {
    // Fix for PDF.js in Node.js environment
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf.min.mjs',
      };
    }
    
    return config;
  },
};

export default nextConfig;
