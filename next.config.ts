import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma loads native/driver code at runtime; keep it out of the bundle.
  serverExternalPackages: ["@prisma/adapter-better-sqlite3", "better-sqlite3", "@prisma/adapter-pg", "pg"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
