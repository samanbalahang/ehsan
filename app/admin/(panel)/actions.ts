"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import sanitizeHtml from "sanitize-html";
import type { ResultSetHeader } from "mysql2";
import { db } from "@/lib/db";
import { requireAdmin, destroySession } from "@/lib/auth";
import { locales } from "@/lib/i18n";

const clean = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: ["p", "h2", "h3", "strong", "em", "ul", "ol", "li", "a", "br",
      "blockquote", "figure", "figcaption", "img"],
    allowedAttributes: { a: ["href"], img: ["src", "alt"] },
    allowedClasses: { figure: ["image"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    // only images uploaded to your own /images folder are kept
    exclusiveFilter: (f) =>
      f.tag === "img" && !/^\/images\/[\w./-]+$/.test(f.attribs.src ?? ""),
  });

const refresh = () => revalidatePath("/", "layout");
const ids = (formData: FormData, key: string) =>
  formData.getAll(key).map(Number).filter((n) => Number.isInteger(n) && n > 0);

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- pages and posts ---------- */

export async function savePost(formData: FormData) {
  await requireAdmin();

  const type = formData.get("type") === "page" ? "page" : "post";
  const id = Number(formData.get("id")) || 0;
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const image = String(formData.get("image") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order")) || 0;
  const status = formData.get("status") === "draft" ? "draft" : "published";

  const list = type === "page" ? "/admin/pages" : "/admin/posts";
  const back = `${list}/${id || "new"}`;
  const fail = (m: string) => redirect(`${back}?error=${encodeURIComponent(m)}`);

  if (!/^[a-z0-9-]{2,100}$/.test(slug)) fail("Slug must be a-z, 0-9 and dashes");
  if (!/^(\/images\/[\w./-]+)?$/.test(image)) fail("Image must look like /images/name.webp");
  if (!/^[+\d\s-]{0,30}$/.test(phone)) fail("Phone may contain digits, +, - and spaces");

  const conn = await db.getConnection();
  let postId = id;
  let error = "";
  try {
    await conn.beginTransaction();

    if (id) {
      await conn.query(
        "UPDATE posts SET slug=?, image=?, phone=?, sort_order=?, status=? WHERE id=? AND type=?",
        [slug, image, phone, sortOrder, status, id, type]
      );
    } else {
      const [res] = await conn.query<ResultSetHeader>(
        "INSERT INTO posts (type, slug, image, phone, sort_order, status) VALUES (?,?,?,?,?,?)",
        [type, slug, image, phone, sortOrder, status]
      );
      postId = res.insertId;
    }

    for (const lang of locales) {
      const title = String(formData.get(`title_${lang}`) ?? "").trim().slice(0, 255);
      const summary = String(formData.get(`summary_${lang}`) ?? "").trim().slice(0, 1000);
      const body = clean(String(formData.get(`body_${lang}`) ?? "").slice(0, 200000));
      const points = String(formData.get(`points_${lang}`) ?? "")
        .split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 30);
      if (!title) throw new Error(`Title (${lang}) is required`);

      await conn.query(
        `INSERT INTO post_translations (post_id, lang, title, summary, body, points)
         VALUES (?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), summary=VALUES(summary),
           body=VALUES(body), points=VALUES(points)`,
        [postId, lang, title, summary, body, JSON.stringify(points)]
      );
    }

    if (type === "post") {
      await conn.query("DELETE FROM post_categories WHERE post_id=?", [postId]);
      for (const c of ids(formData, "categories"))
        await conn.query("INSERT INTO post_categories (post_id, category_id) VALUES (?,?)", [postId, c]);

      await conn.query("DELETE FROM post_tags WHERE post_id=?", [postId]);
      for (const t of ids(formData, "tags"))
        await conn.query("INSERT INTO post_tags (post_id, tag_id) VALUES (?,?)", [postId, t]);
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
  redirect(list);
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const type = formData.get("type") === "page" ? "page" : "post";
  if (id) await db.query("DELETE FROM posts WHERE id=? AND type=?", [id, type]);
  refresh();
  redirect(type === "page" ? "/admin/pages" : "/admin/posts");
}

/* ---------- categories and tags (same code, two table sets) ---------- */

const TERMS = {
  category: { table: "categories", tr: "category_translations", fk: "category_id", path: "/admin/categories" },
  tag: { table: "tags", tr: "tag_translations", fk: "tag_id", path: "/admin/tags" },
} as const;

export async function saveTerm(formData: FormData) {
  await requireAdmin();
  const kind = formData.get("kind") === "tag" ? "tag" : "category";
  const T = TERMS[kind];
  const id = Number(formData.get("id")) || 0;
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const fail = (m: string) => redirect(`${T.path}?error=${encodeURIComponent(m)}`);

  if (!/^[a-z0-9-]{2,100}$/.test(slug)) fail("Slug must be a-z, 0-9 and dashes");

  const names = locales.map((l) => [l, String(formData.get(`name_${l}`) ?? "").trim().slice(0, 255)] as const);
  if (names.some(([, n]) => !n)) fail("A name is required in every language");

  const conn = await db.getConnection();
  let error = "";
  try {
    await conn.beginTransaction();
    let termId = id;
    if (id) {
      await conn.query(`UPDATE ${T.table} SET slug=? WHERE id=?`, [slug, id]);
    } else {
      const [res] = await conn.query<ResultSetHeader>(`INSERT INTO ${T.table} (slug) VALUES (?)`, [slug]);
      termId = res.insertId;
    }
    for (const [lang, name] of names) {
      await conn.query(
        `INSERT INTO ${T.tr} (${T.fk}, lang, name) VALUES (?,?,?)
         ON DUPLICATE KEY UPDATE name=VALUES(name)`,
        [termId, lang, name]
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
  redirect(T.path);
}

export async function deleteTerm(formData: FormData) {
  await requireAdmin();
  const kind = formData.get("kind") === "tag" ? "tag" : "category";
  const T = TERMS[kind];
  const id = Number(formData.get("id"));
  if (id) await db.query(`DELETE FROM ${T.table} WHERE id=?`, [id]);
  refresh();
  redirect(T.path);
}