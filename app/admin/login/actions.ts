"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

// simple in-memory limiter: 5 failures per 15 minutes per IP
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW = 15 * 60 * 1000;

export async function login(_prev: { error?: string } | null, formData: FormData) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  const a = attempts.get(ip);
  if (a && Date.now() - a.first < WINDOW && a.count >= 5) {
    return { error: "Too many attempts. Try again later." };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, password_hash FROM admins WHERE username = ?",
    [username]
  );
  const user = rows[0];
  const ok = user ? await bcrypt.compare(password, user.password_hash) : false;

  if (!ok) {
    const fresh = !a || Date.now() - a.first >= WINDOW;
    attempts.set(ip, { count: fresh ? 1 : a!.count + 1, first: fresh ? Date.now() : a!.first });
    return { error: "Wrong username or password." };
  }

  attempts.delete(ip);
  await createSession(user.id);
  redirect("/admin");
}