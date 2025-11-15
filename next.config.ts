import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark pdf-parse and pdfjs-dist as external packages for server components
  // This prevents Next.js from trying to bundle them, which causes issues
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],
};

export default nextConfig;
