import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "pako/lib/zlib/zstream.js": "./node_modules/pako/index.js",
      "pako/lib/zlib/deflate.js": "./node_modules/pako/index.js",
      "pako/lib/zlib/inflate.js": "./node_modules/pako/index.js",
      "pako/lib/zlib/constants.js": "./node_modules/pako/index.js",
    },
  },
};

export default nextConfig;