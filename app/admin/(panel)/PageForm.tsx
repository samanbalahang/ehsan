import Link from "next/link";
import { notFound } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { locales, localeNames, type Locale } from "@/lib/i18n";
import { savePost } from "./actions";
import ImageField from "./ImageField";
import RichEditor from "./RichEditor";
import AutoTranslate from "./AutoTranslate";

const input = "w-full rounded border p-3";

export default async function PostForm({
  type, id, error,
}: { type: "page" | "post"; id: string; error?: string }) {
  const isNew = id === "new";
  const isPost = type === "post";
  const list = isPost ? "/admin/posts" : "/admin/pages";

let post: RowDataPacket = {
  id: 0,
  slug: "",
  image: "",
  phone: "",
  sort_order: 0,
  status: "published",
} as RowDataPacket;
  const tr: Partial<Record<Locale, RowDataPacket>> = {};
  let selCats = new Set<number>();
  let selTags = new Set<number>();

  if (!isNew) {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM posts WHERE id=? AND type=?", [Number(id), type]
    );
    if (!rows[0]) notFound();
    post = rows[0];

    const [trs] = await db.query<RowDataPacket[]>("SELECT * FROM post_translations WHERE post_id=?", [post.id]);
    for (const t of trs) tr[t.lang as Locale] = t;

    if (isPost) {
      const [pc] = await db.query<RowDataPacket[]>("SELECT category_id FROM post_categories WHERE post_id=?", [post.id]);
      const [pt] = await db.query<RowDataPacket[]>("SELECT tag_id FROM post_tags WHERE post_id=?", [post.id]);
      selCats = new Set(pc.map((r) => r.category_id));
      selTags = new Set(pt.map((r) => r.tag_id));
    }
  }

  let cats: RowDataPacket[] = [];
  let tags: RowDataPacket[] = [];
  if (isPost) {
    [cats] = await db.query<RowDataPacket[]>(
      `SELECT c.id, c.slug, t.name FROM categories c
       LEFT JOIN category_translations t ON t.category_id=c.id AND t.lang='en' ORDER BY c.id`
    );
    [tags] = await db.query<RowDataPacket[]>(
      `SELECT g.id, g.slug, t.name FROM tags g
       LEFT JOIN tag_translations t ON t.tag_id=g.id AND t.lang='en' ORDER BY g.id`
    );
  }

  const pointsText = (t?: RowDataPacket) => {
    if (!t) return "";
    const p = typeof t.points === "string" ? JSON.parse(t.points) : (t.points ?? []);
    return (p as string[]).join("\n");
  };

  return (
    <main className="mx-auto max-w-4xl">
      <Link href={list} className="mb-6 inline-block text-gray-500">← Back</Link>
      <h1 className="mb-6 text-2xl font-bold">{isNew ? `New ${type}` : `Edit ${type}`}</h1>
      {error && <p className="mb-6 rounded bg-red-100 p-3 text-red-700">{error}</p>}

      <form action={savePost} className="space-y-8">
        <AutoTranslate />
        <input type="hidden" name="id" value={post.id} />
        <input type="hidden" name="type" value={type} />
        <section className="grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2">
          <label>Slug (URL)
            <input name="slug" defaultValue={post.slug} required dir="ltr" className={input} />
          </label>
          <label>Status
            <select name="status" defaultValue={post.status} className={input}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <label>
            <ImageField defaultValue={post.image} />
          </label>
          <label>Sort order
            <input name="sort_order" type="number" defaultValue={post.sort_order} className={input} />
          </label>
          {isPost && (
            <label>Phone (for team members)
              <input name="phone" defaultValue={post.phone} dir="ltr" className={input} />
            </label>
          )}
        </section>

        {isPost && (
          <section className="grid gap-6 rounded-xl bg-white p-6 shadow md:grid-cols-2">
            <fieldset>
              <legend className="mb-2 font-bold">Categories</legend>
              {cats.map((c) => (
                <label key={c.id} className="flex items-center gap-2 py-1">
                  <input type="checkbox" name="categories" value={c.id} defaultChecked={selCats.has(c.id)} />
                  {c.name ?? c.slug} <span className="text-xs text-gray-400">({c.slug})</span>
                </label>
              ))}
              {cats.length === 0 && <p className="text-sm text-gray-500">Create categories first.</p>}
            </fieldset>
            <fieldset>
              <legend className="mb-2 font-bold">Tags</legend>
              {tags.map((g) => (
                <label key={g.id} className="flex items-center gap-2 py-1">
                  <input type="checkbox" name="tags" value={g.id} defaultChecked={selTags.has(g.id)} />
                  {g.name ?? g.slug}
                </label>
              ))}
              {tags.length === 0 && <p className="text-sm text-gray-500">No tags yet.</p>}
            </fieldset>
          </section>
        )}

        {locales.map((lang) => {
          const t = tr[lang];
          const dir = lang === "en" ? "ltr" : "rtl";
          return (
            <section key={lang} className="space-y-4 rounded-xl bg-white p-6 shadow">
              <h2 className="text-lg font-bold">{localeNames[lang]}</h2>
              <label className="block">Title
                <input name={`title_${lang}`} defaultValue={t?.title ?? ""} required dir={dir} className={input} />
              </label>
              <label className="block">Summary (card text, or role for team members)
                <textarea name={`summary_${lang}`} defaultValue={t?.summary ?? ""} rows={2} dir={dir} className={input} />
              </label>
              <div className="block">
                <p className="mb-1">
                  Content (HTML: p, h3, strong, em, ul, ol, li, a, br)
                </p>

                <RichEditor
                  name={`body_${lang}`}
                  defaultValue={t?.body ?? ""}
                  lang={lang}
                />
              </div>
              <label className="block">Bullet points (one per line)
                <textarea name={`points_${lang}`} defaultValue={pointsText(t)} rows={5} dir={dir} className={input} />
              </label>
            </section>
          );
        })}

        <button className="rounded-lg bg-black px-8 py-3 text-white">Save</button>
      </form>
    </main>
  );
}