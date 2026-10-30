import Link from "next/link";
import { notFound } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { locales, localeNames, type Locale } from "@/lib/i18n";
import ImageField from "@/app/admin/(panel)/ImageField";
import RichEditor from "@/app/admin/(panel)/RichEditor";
import AutoTranslate from "@/app/admin/(panel)/AutoTranslate";
import { saveProduct } from "../../actions";

export const dynamic = "force-dynamic";

const input = "w-full rounded border p-3";

export default async function Page({
  params, searchParams,
}: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";
  const numericId = Number(id);
  if (!isNew && !Number.isInteger(numericId)) notFound();

let product: Record<string, any> = {
  id: 0, slug: "", image: "", price: null,
  category_id: null, sort_order: 0, status: "published",
};

const tr: Partial<Record<Locale, RowDataPacket>> = {};

  if (!isNew) {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM products WHERE id=?", [numericId]);
    if (!rows[0]) notFound();
    product = rows[0];
    const [trs] = await db.query<RowDataPacket[]>("SELECT * FROM product_translations WHERE product_id=?", [product.id]);
    for (const t of trs) tr[t.lang as Locale] = t;
  }

  const [cats] = await db.query<RowDataPacket[]>(
    `SELECT c.id, c.slug, t.name FROM product_categories c
     LEFT JOIN product_category_translations t ON t.category_id = c.id AND t.lang = 'en' ORDER BY c.id`
  );

  return (
    <main className="mx-auto max-w-4xl">
      <Link href="/admin/shop/products" className="mb-6 inline-block text-gray-500">← Back</Link>
      <h1 className="mb-6 text-2xl font-bold">{isNew ? "New product" : "Edit product"}</h1>
      {error && <p className="mb-6 rounded bg-red-100 p-3 text-red-700">{error}</p>}

      <form action={saveProduct} className="space-y-8">
        <AutoTranslate />
        <input type="hidden" name="id" value={product.id} />

        <section className="grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2">
          <label>Slug (URL)
            <input name="slug" defaultValue={product.slug} required dir="ltr" className={input} />
          </label>
          <label>Status
            <select name="status" defaultValue={product.status} className={input}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <label>Price (whole number, leave empty to show "Call us")
            <input name="price" type="number" min="0" step="1"
              defaultValue={product.price === null ? "" : String(product.price)} dir="ltr" className={input} />
          </label>
          <label>Category
            <select name="category_id" defaultValue={product.category_id ?? ""} className={input}>
              <option value="">— none —</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>{c.name ?? c.slug}</option>
              ))}
            </select>
          </label>
          <label>Sort order
            <input name="sort_order" type="number" defaultValue={product.sort_order} className={input} />
          </label>
          <div className="md:col-span-2">
            <ImageField defaultValue={product.image} />
          </div>
        </section>

        {locales.map((lang) => {
          const t = tr[lang];
          const dir = lang === "en" ? "ltr" : "rtl";
          return (
            <section key={lang} className="space-y-4 rounded-xl bg-white p-6 shadow">
              <h2 className="text-lg font-bold">{localeNames[lang]}</h2>
              <label className="block">Title
                <input name={`title_${lang}`} defaultValue={t?.title ?? ""} required dir={dir} className={input} />
              </label>
              <label className="block">Short description (card text)
                <textarea name={`summary_${lang}`} defaultValue={t?.summary ?? ""} rows={2} dir={dir} className={input} />
              </label>
              <div>
                <span className="mb-1 block">Details</span>
                <RichEditor name={`body_${lang}`} defaultValue={t?.body ?? ""} lang={lang} />
              </div>
            </section>
          );
        })}

        <button className="rounded-lg bg-black px-8 py-3 text-white">Save</button>
      </form>
    </main>
  );
}