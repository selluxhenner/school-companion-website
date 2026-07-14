import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // A stray lockfile in a parent folder makes Next.js misdetect the
  // workspace root; pin it to this project.
  outputFileTracingRoot: path.join(__dirname),
  // Static export: `next build` writes a fully pre-rendered site to /out.
  // Crawlers get complete HTML with no JS required.
  output: "export",
  // The Next.js image optimizer needs a server, which a static export
  // doesn't have. Source images are pre-sized (~60-130 KB JPEGs), so we
  // serve them as-is and keep lazy-loading via next/image.
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
