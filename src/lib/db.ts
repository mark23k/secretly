import "server-only";
import { PrismaClient } from "@/generated/prisma/client";

// Picks the right database driver from DATABASE_URL:
//   file:...        -> SQLite (local development)
//   postgres(ql)://  -> PostgreSQL (production)
function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env first.");

  if (url.startsWith("file:")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaPg } = require("@prisma/adapter-pg");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const db = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export const isPostgres = !(process.env.DATABASE_URL ?? "").startsWith("file:");

/** Case-insensitive "contains" that works on both SQLite and PostgreSQL. */
export function contains(term: string) {
  // SQLite's LIKE is already case-insensitive for ASCII; Postgres needs mode.
  return isPostgres ? { contains: term, mode: "insensitive" as const } : { contains: term };
}
