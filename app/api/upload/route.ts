import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// check the real file signature, never trust the file name
function detectExt(b: Buffer): string | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  if (b.subarray(0, 3).toString("ascii") === "GIF") return "gif";
  return null; // SVG is rejected on purpose (it can carry scripts)
}

const fail = (message: string, status = 400) =>
  NextResponse.json({ error: { message } }, { status });

export async function POST(req: Request) {
  if (!(await getSession())) return fail("Not allowed", 401);

  const form = await req.formData();
  const file = form.get("upload"); // CKEditor sends the file as "upload"
  if (!(file instanceof File)) return fail("No file");
  if (file.size > MAX_SIZE) return fail("File is larger than 5 MB");

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = detectExt(buffer);
  if (!ext) return fail("Only JPG, PNG, WebP and GIF are allowed");

  const now = new Date();
  const folder = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`; // 202506
  const name = `${randomBytes(8).toString("hex")}.${ext}`;

  const dir = path.join(process.cwd(), "public", "images", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);

  return NextResponse.json({ url: `/images/${folder}/${name}` });
}