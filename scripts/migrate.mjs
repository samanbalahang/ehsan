import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
  charset: "utf8mb4",
});

await db.query(`
  CREATE TABLE IF NOT EXISTS migrations (
    name VARCHAR(255) PRIMARY KEY,
    run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) CHARACTER SET utf8mb4
`);

const [done] = await db.query("SELECT name FROM migrations");
const applied = new Set(done.map((r) => r.name));

const dir = path.join(process.cwd(), "db", "migrations");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

let count = 0;
for (const file of files) {
  if (applied.has(file)) continue;
  console.log("Running", file);
  await db.query(fs.readFileSync(path.join(dir, file), "utf8"));
  await db.query("INSERT INTO migrations (name) VALUES (?)", [file]);
  count++;
}

console.log(count ? `Done: ${count} migration(s).` : "Nothing to migrate.");
await db.end();