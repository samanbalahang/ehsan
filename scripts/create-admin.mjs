import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const [, , username, password] = process.argv;
if (!username || !password || password.length < 10) {
  console.error("Usage: node --env-file=.env.local scripts/create-admin.mjs <user> <password (10+ chars)>");
  process.exit(1);
}

const db = await mysql.createConnection({
  host: process.env.DB_HOST, user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
});
const hash = await bcrypt.hash(password, 12);
await db.query(
  "INSERT INTO admins (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)",
  [username, hash]
);
console.log("Admin saved:", username);
await db.end();