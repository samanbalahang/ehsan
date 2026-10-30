"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import sanitizeHtml from "sanitize-html";
import type { ResultSetHeader } from "mysql2";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { locales } from "@/lib/i18n";

const clean = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "strong", "em", "ul", "ol", "li", "a", "br",
                  "blockquote", "figure", "figcaption", "img"],
    allowedAttributes: { a: ["href"], img: ["src", "alt"] },
    allowedClasses: { figure: ["image"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    exclusiveFilter: (f) =>
      f.tag === "img" && !/^\/images\/[\w./-]+$/.test(f.attribs.src ?? ""),
  });

const refresh = () => revalidatePath("/", "layout");

/* ---------- products ---------- */

export async function saveProduct(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id")) || 0;
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const image = String(formData.get("image") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").replace(/[,\s]/g, "");
  const categoryId = Number(formData.get("category_id")) || null;
  const sortOrder = Number(formData.get("sort_order")) || 0;
  const status = formData.get("status") === "draft" ? "draft" : "published";

  const back = `/admin/shop/products/${id || "new"}`;
  const fail = (m: string) => redirect(`${back}?error=${encodeURIComponent(m)}`);

  if (!/^[a-z0-9-]{2,100}$/.test(slug)) fail("Slug must be a-z, 0-9 and dashes");
  if (!/^(\/images\/[\w./-]+)?$/.test(image)) fail("Image must look like /images/name.webp");

  let price: number | null = null; // empty = "Call us"
  if (priceRaw !== "") {
    price = Number(priceRaw);
    if (!Number.isInteger(price) || price < 0 || price > 1e13) fail("Price must be a whole number, or empty");
  }

  const conn = await db.getConnection();
  let productId = id;
  let error = "";
  try {
    await conn.beginTransaction();

    if (id) {
      await conn.query(
        "UPDATE products SET slug=?, image=?, price=?, category_id=?, sort_order=?, status=? WHERE id=?",
        [slug, image, price, categoryId, sortOrder, status, id]
      );
    } else {
      const [res] = await conn.query<ResultSetHeader>(
        "INSERT INTO products (slug, image, price, category_id, sort_order, status) VALUES (?,?,?,?,?,?)",
        [slug, image, price, categoryId, sortOrder, status]
      );
      productId = res.insertId;
    }

    for (const lang of locales) {
      const title = String(formData.get(`title_${lang}`) ?? "").trim().slice(0, 255);
      const summary = String(formData.get(`summary_${lang}`) ?? "").trim().slice(0, 1000);
      const body = clean(String(formData.get(`body_${lang}`) ?? "").slice(0, 200000));
      if (!title) throw new Error(`Title (${lang}) is required`);

      await conn.query(
        `INSERT INTO product_translations (product_id, lang, title, summary, body)
         VALUES (?,?,?,?,?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), summary=VALUES(summary), body=VALUES(body)`,
        [productId, lang, title, summary, body]
      );
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    const msg = e instanceof Error ? e.message : "Save failed";
    error = msg.includes("Duplicate") ? "This slug already exists" : msg;
  } finally {
    conn.release();
  }

  if (error) fail(error);
  refresh();
  redirect("/admin/shop/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) await db.query("DELETE FROM products WHERE id=?", [id]);
  refresh();
  redirect("/admin/shop/products");
}

/* ---------- product categories ---------- */

export async function saveProductCategory(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id")) || 0;
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const path = "/admin/shop/categories";
  const fail = (m: string) => redirect(`${path}?error=${encodeURIComponent(m)}`);

  if (!/^[a-z0-9-]{2,100}$/.test(slug)) fail("Slug must be a-z, 0-9 and dashes");
  const names = locales.map((l) => [l, String(formData.get(`name_${l}`) ?? "").trim().slice(0, 255)] as const);
  if (names.some(([, n]) => !n)) fail("A name is required in every language");

  const conn = await db.getConnection();
  let error = "";
  try {
    await conn.beginTransaction();
    let catId = id;
    if (id) {
      await conn.query("UPDATE product_categories SET slug=? WHERE id=?", [slug, id]);
    } else {
      const [res] = await conn.query<ResultSetHeader>("INSERT INTO product_categories (slug) VALUES (?)", [slug]);
      catId = res.insertId;
    }
    for (const [lang, name] of names) {
      await conn.query(
        `INSERT INTO product_category_translations (category_id, lang, name) VALUES (?,?,?)
         ON DUPLICATE KEY UPDATE name=VALUES(name)`,
        [catId, lang, name]
      );
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    error = e instanceof Error && e.message.includes("Duplicate") ? "This slug already exists" : "Save failed";
  } finally {
    conn.release();
  }

  if (error) fail(error);
  refresh();
  redirect(path);
}

export async function deleteProductCategory(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) await db.query("DELETE FROM product_categories WHERE id=?", [id]); // products keep existing, category becomes empty
  refresh();
  redirect("/admin/shop/categories");
}

/* ---------- settings: 3 home products ---------- */

export async function saveShopSettings(formData: FormData) {
  await requireAdmin();
  const ids = [1, 2, 3]
    .map((n) => Number(formData.get(`home_product_${n}`)))
    .filter((n) => Number.isInteger(n) && n > 0);
  const unique = [...new Set(ids)].slice(0, 3);

  await db.query(
    `INSERT INTO settings (name, value) VALUES ('home_products', ?)
     ON DUPLICATE KEY UPDATE value = VALUES(value)`,
    [JSON.stringify(unique)]
  );
  refresh();
  redirect("/admin/shop/settings?saved=1");
}