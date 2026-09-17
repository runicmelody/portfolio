import type { NextConfig } from "next";
import { LICENSE_URL, SITE } from "./src/data/site";

console.log(`[licensing] site url: ${SITE.url}`);

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
  },
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.wgsl": {
        loaders: ["@vgpu/wgsl/loader-webpack"],
        as: "*.js",
      },
    },
  },

  async headers() {
    return [
      {
        // Portfolyo görselleri: telif + TDM rezervi + AI botlarına kapalı
        source: "/artworks/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noai, noimageai" },
          { key: "TDM-Reservation", value: "1" },
          { key: "Link", value: `<${LICENSE_URL}>; rel="license"` },
        ],
      },
      {
        // Tüm sayfalar için lisans bildirimi
        source: "/:path*",
        headers: [
          { key: "Link", value: `<${LICENSE_URL}>; rel="license"` },
        ],
      },
    ];
  },
};

export default nextConfig;
