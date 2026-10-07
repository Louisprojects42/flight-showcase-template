import path from "node:path";
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  poweredByHeader: false,
  turbopack: { root: path.resolve(__dirname) },
};
export default nextConfig;
