// Applies db/schema.sql to DATABASE_URL. Safe to re-run (uses IF NOT EXISTS).
// Run with: npm run db:migrate

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");

const statements = schema
  .split(/;\s*(?:\n|$)/)
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
  console.log("OK:", statement.split("\n")[0].slice(0, 70));
}

console.log(`Migration complete ✅ (${statements.length} statements)`);
