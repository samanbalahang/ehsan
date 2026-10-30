import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as { pool?: mysql.Pool };

console.log("Database environment check:", {
  host: process.env.DB_HOST,
  userSet: Boolean(process.env.DB_USER),
  passwordSet: Boolean(process.env.DB_PASSWORD),
  databaseSet: Boolean(process.env.DB_NAME),
});

export const db =
  globalForDb.pool ??
  (globalForDb.pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,   // keep small on shared hosting
    charset: "utf8mb4",
  }));