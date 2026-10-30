import { cache } from "react";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import type { Locale } from "@/lib/i18n";

export type Post = {
  id: number; slug: string; image: string; phone: string;
  title: string; summary: string; body: string; points: string[];
};

const normalize = (r: RowDataPacket): Post => ({
  id: r.id, slug: r.slug, image: r.image ?? "", phone: r.phone ?? "",
  title: r.title, summary: r.summary, body: r.body,
  points: typeof r.points === "string" ? JSON.parse(r.points) : (r.points ?? []),
});

const SELECT = `
  SELECT p.id, p.slug, p.image, p.phone, t.title, t.summary, t.body, t.points
  FROM posts p JOIN post_translations t ON t.post_id = p.id AND t.lang = ?`;
const IN_CATEGORY = `
  JOIN post_categories pc ON pc.post_id = p.id
  JOIN categories c ON c.id = pc.category_id`;

export const getPosts = cache(async (lang: Locale, category: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    `${SELECT} ${IN_CATEGORY}
     WHERE p.type='post' AND p.status='published' AND c.slug = ?
     ORDER BY p.sort_order, p.id`,
    [lang, category]
  );
  return rows.map(normalize);
});

export const getPost = cache(async (lang: Locale, category: string, slug: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    `${SELECT} ${IN_CATEGORY}
     WHERE p.type='post' AND p.status='published' AND c.slug = ? AND p.slug = ?`,
    [lang, category, slug]
  );
  return rows[0] ? normalize(rows[0]) : null;
});

export const getPage = cache(async (lang: Locale, slug: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    `${SELECT} WHERE p.type='page' AND p.status='published' AND p.slug = ?`,
    [lang, slug]
  );
  return rows[0] ? normalize(rows[0]) : null;
});

export const getPostSlugs = cache(async (category: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT p.slug FROM posts p ${IN_CATEGORY}
     WHERE p.type='post' AND p.status='published' AND c.slug = ?
     ORDER BY p.sort_order, p.id`,
    [category]
  );
  return rows.map((r) => r.slug as string);
});

export const getPageSlugs = cache(async () => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT slug FROM posts WHERE type='page' AND status='published'"
  );
  return rows.map((r) => r.slug as string);
});