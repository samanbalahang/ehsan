import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const LANGS = ["fa", "en", "ar"];
const MAX_ITEMS = 200;
const MAX_CHARS = 30000;

const decode = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<")
   .replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// cut long text at sentence ends (each request must stay short)
function pieces(text: string, max = 450): string[] {
  const parts = text.match(/[^.!?؟۔\n]+[.!?؟۔\n]*\s*/g) ?? [text];
  const out: string[] = [];
  let cur = "";
  for (const p of parts) {
    if ((cur + p).length > max && cur) { out.push(cur); cur = ""; }
    if (p.length > max) {
      for (let i = 0; i < p.length; i += max) out.push(p.slice(i, i + max));
    } else cur += p;
  }
  if (cur) out.push(cur);
  return out;
}

/* ---------- service 1: Google (tried first) ---------- */
async function mtGoogle(text: string, from: string, to: string): Promise<string> {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", from);
  url.searchParams.set("tl", to);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Google translate unavailable");
  const data = await res.json();
  return (data[0] as [string][]).map((s) => s[0]).join("");
}

/* ---------- service 2: MyMemory (fallback) ---------- */
async function mtMyMemory(text: string, from: string, to: string): Promise<string> {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", `${from}|${to}`);
  if (process.env.MYMEMORY_EMAIL) url.searchParams.set("de", process.env.MYMEMORY_EMAIL);

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json().catch(() => null);
  const out: string | undefined = data?.responseData?.translatedText;
  if (!res.ok || !out || out.startsWith("MYMEMORY WARNING")) {
    throw new Error("Translation services are unavailable or the daily limit is reached");
  }
  return decode(out);
}

/* ---------- Google first, MyMemory if Google fails ---------- */
async function mt(text: string, from: string, to: string): Promise<string> {
  try {
    return await mtGoogle(text, from, to);
  } catch {
    return await mtMyMemory(text, from, to);
  }
}

async function translateText(text: string, from: string, to: string) {
  const lead = text.match(/^\s*/)![0];
  const trail = text.match(/\s*$/)![0];
  const core = text.trim();
  if (!core) return text;
  let out = "";
  for (const p of pieces(core)) out += (out ? " " : "") + (await mt(p, from, to)).trim();
  return lead + out + trail;
}

// translate only the text between tags, keep the tags
async function translateHtml(html: string, from: string, to: string) {
  const found = [...html.matchAll(/(>)([^<]+)(?=<)/g)];
  let result = "";
  let last = 0;
  for (const m of found) {
    const start = m.index! + 1;
    result += html.slice(last, start);
    const raw = decode(m[2]);
    result += raw.trim() ? escapeHtml(await translateText(raw, from, to)) : m[2];
    last = start + m[2].length;
  }
  return result + html.slice(last);
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Not allowed" }, { status: 401 });

  const { items, from, to, html } = await req.json().catch(() => ({}));
  if (
    !Array.isArray(items) || items.length > MAX_ITEMS ||
    !LANGS.includes(from) || !LANGS.includes(to) || from === to ||
    items.some((i) => typeof i !== "string")
  ) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  if (items.join("").length > MAX_CHARS)
    return NextResponse.json({ error: "Text is too long" }, { status: 413 });

  try {
    const out: string[] = [];
    for (const item of items as string[]) {
      out.push(html ? await translateHtml(item, from, to) : await translateText(item, from, to));
    }
    return NextResponse.json({ items: out });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Translation failed" },
      { status: 502 }
    );
  }
}