import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { locales, localeNames } from "@/lib/i18n";
import { saveTerm, deleteTerm } from "./actions";

const CFG = {
  category: {
    table: "categories",
    tr: "category_translations",
    fk: "category_id",
    path: "/admin/posts/categories",
    title: "Categories",
  },
  tag: {
    table: "tags",
    tr: "tag_translations",
    fk: "tag_id",
    path: "/admin/posts/tags",
    title: "Tags",
  },
} as const;

const input = "w-full rounded border p-2";

export default async function TermManager({
  kind,
  edit,
  error,
}: {
  kind: "category" | "tag";
  edit?: string;
  error?: string;
}) {
  const C = CFG[kind];

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT x.id, x.slug,
       MAX(IF(t.lang='fa', t.name, NULL)) AS name_fa,
       MAX(IF(t.lang='en', t.name, NULL)) AS name_en,
       MAX(IF(t.lang='ar', t.name, NULL)) AS name_ar
     FROM ${C.table} x LEFT JOIN ${C.tr} t ON t.${C.fk} = x.id
     GROUP BY x.id, x.slug ORDER BY x.id`
  );
  const current = rows.find((r) => String(r.id) === edit);

  return (
    <main className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold">{C.title}</h1>
      {error && <p className="rounded bg-red-100 p-3 text-red-700">{error}</p>}

      <form action={saveTerm} className="space-y-4 rounded-xl bg-white p-6 shadow">
        <h2 className="font-bold">{current ? "Edit" : "Add new"}</h2>
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="id" value={current?.id ?? 0} />
        <label className="block">
          Slug
          <input
            name="slug"
            defaultValue={current?.slug ?? ""}
            required
            dir="ltr"
            className={input}
          />
        </label>
        <div className="grid gap-3 md:grid-cols-3">
          {locales.map((l) => (
            <label key={l}>
              {localeNames[l]}
              <input
                name={`name_${l}`}
                defaultValue={current?.[`name_${l}`] ?? ""}
                required
                dir={l === "en" ? "ltr" : "rtl"}
                className={input}
              />
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button className="rounded bg-black px-5 py-2 text-white">Save</button>
          {current && (
            <a href={C.path} className="rounded border px-5 py-2">
              Cancel
            </a>
          )}
        </div>
      </form>

      <ul className="divide-y rounded-xl bg-white shadow">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium">{r.name_en ?? r.slug}</p>
              <p className="text-sm text-gray-500">
                /{r.slug} · {r.name_fa} · {r.name_ar}
              </p>
            </div>
            <div className="flex gap-2">
              <a href={`${C.path}?edit=${r.id}`} className="rounded border px-3 py-1">
                Edit
              </a>
              <form action={deleteTerm}>
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="id" value={r.id} />
                <button className="rounded border border-red-300 px-3 py-1 text-red-600">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="p-6 text-gray-500">Nothing here yet.</li>}
      </ul>
    </main>
  );
}