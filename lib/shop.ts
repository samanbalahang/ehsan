import { cache } from "react";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import type { Locale } from "@/lib/i18n";

export type Product = {
  id: number;
  slug: string;
  image: string;
  price: number | null;
  title: string;
  summary: string;
  body: string;
  categorySlug: string | null;
  categoryName: string | null;
};

const normalize = (r: RowDataPacket): Product => ({
  id: r.id,
  slug: r.slug,
  image: r.image ?? "",
  price: r.price === null ? null : Number(r.price),
  title: r.title,
  summary: r.summary,
  body: r.body,
  categorySlug: r.category_slug ?? null,
  categoryName: r.category_name ?? null,
});

const SELECT = `
  SELECT p.id, p.slug, p.image, p.price, t.title, t.summary, t.body,
         c.slug AS category_slug, ct.name AS category_name
  FROM products p
  JOIN product_translations t ON t.product_id = p.id AND t.lang = ?
  LEFT JOIN product_categories c ON c.id = p.category_id
  LEFT JOIN product_category_translations ct ON ct.category_id = c.id AND ct.lang = ?`;

export const getProducts = cache(async (lang: Locale, category?: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    `${SELECT} WHERE p.status = 'published' ${category ? "AND c.slug = ?" : ""}
     ORDER BY p.sort_order, p.id DESC`,
    category ? [lang, lang, category] : [lang, lang]
  );
  return rows.map(normalize);
});

export const getProduct = cache(async (lang: Locale, slug: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    `${SELECT} WHERE p.status = 'published' AND p.slug = ?`,
    [lang, lang, slug]
  );
  return rows[0] ? normalize(rows[0]) : null;
});

export const getProductCategories = cache(async (lang: Locale) => {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT c.slug, t.name FROM product_categories c
     JOIN product_category_translations t ON t.category_id = c.id AND t.lang = ?
     ORDER BY c.id`,
    [lang]
  );
  return rows as { slug: string; name: string }[];
});

export const getProductSlugs = cache(async () => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT slug FROM products WHERE status = 'published' ORDER BY sort_order, id DESC"
  );
  return rows.map((r) => r.slug as string);
});

export async function getSetting(name: string): Promise<string | null> {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT value FROM settings WHERE name = ?",
    [name]
  );
  return rows[0]?.value ?? null;
}

// the 3 products chosen in Admin > Shop > Settings (fallback: first 3)
export const getFeaturedProducts = cache(async (lang: Locale) => {
  let ids: number[] = [];
  try {
    ids = JSON.parse((await getSetting("home_products")) ?? "[]");
  } catch {}

  const all = await getProducts(lang);
  if (!ids.length) return all.slice(0, 3);

  const picked = ids
    .map((id) => all.find((p) => p.id === id))
    .filter((p): p is Product => !!p);
  return picked.length ? picked : all.slice(0, 3);
});