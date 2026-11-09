// Picks the Prisma database provider from DATABASE_URL, so switching from
// SQLite (local) to PostgreSQL (production) only means changing that URL.
//   file:./prisma/dev.db         -> sqlite
//   postgres:// or postgresql:// -> postgresql
import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";

const url = process.env.DATABASE_URL ?? "";
const provider = url.startsWith("file:")
  ? "sqlite"
  : /^postgres(ql)?:\/\//.test(url)
    ? "postgresql"
    : null;

if (!provider) {
  console.error("DATABASE_URL must start with file: (SQLite) or postgres:// (PostgreSQL).");
  process.exit(1);
}

const path = new URL("../prisma/schema.prisma", import.meta.url);
const schema = readFileSync(path, "utf8");
const next = schema.replace(/(datasource db \{\s*provider\s*=\s*)"[^"]+"/, `$1"${provider}"`);
if (next !== schema) writeFileSync(path, next);
console.log(`Prisma provider: ${provider}`);
