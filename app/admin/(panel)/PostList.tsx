import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { parseTable, clampPage, orderSql, type RawParams } from "@/lib/table";
import DataTable, { type Column } from "./DataTable";
import { deletePost } from "./actions";

const SORT: Record<string, string> = {
  title: "t.title",
  slug: "p.slug",
  status: "p.status",
  cats: "cats",
  order: "p.sort_order",
  updated: "p.updated_at",
};

export default async function PostList({
  type, searchParams,
}: { type: "page" | "post"; searchParams: RawParams }) {
  const base = type === "page" ? "/admin/pages" : "/admin/posts";
  const params = parseTable(searchParams, Object.keys(SORT), { sort: "updated", dir: "desc" });

  const like = `%${params.q}%`;
  const where = params.q ? "AND (t.title LIKE ? OR p.slug LIKE ?)" : "";
  const args: (string | number)[] = [type, ...(params.q ? [like, like] : [])];

  const [countRows] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM posts p
     LEFT JOIN post_translations t ON t.post_id = p.id AND t.lang = 'fa'
     WHERE p.type = ? ${where}`,
    args
  );
  const total = Number(countRows[0].total);
  const page = clampPage(total, params);

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT p.id, p.slug, p.status, p.sort_order, p.updated_at, t.title,
       (SELECT GROUP_CONCAT(c.slug SEPARATOR ', ') FROM post_categories pc
          JOIN categories c ON c.id = pc.category_id WHERE pc.post_id = p.id) AS cats
     FROM posts p
     LEFT JOIN post_translations t ON t.post_id = p.id AND t.lang = 'fa'
     WHERE p.type = ? ${where}
     ORDER BY ${orderSql(SORT, params)}, p.id DESC
     LIMIT ? OFFSET ?`,
    [...args, params.perPage, (page - 1) * params.perPage]
  );

  const columns: Column<RowDataPacket>[] = [
    { key: "title", label: "Title", sortable: true, render: (r) => <span className="font-medium">{r.title ?? r.slug}</span> },
    { key: "slug", label: "Slug", sortable: true, render: (r) => <span dir="ltr" className="text-gray-500">/{r.slug}</span> },
    ...(type === "post"
      ? [{ key: "cats", label: "Categories", sortable: true, render: (r: RowDataPacket) => r.cats ?? "—" }]
      : []),
    {
      key: "status", label: "Status", sortable: true,
      render: (r) => (
        <span className={`rounded px-2 py-0.5 text-xs ${r.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {r.status}
        </span>
      ),
    },
    { key: "order", label: "Order", sortable: true, render: (r) => r.sort_order },
    {
      key: "updated", label: "Updated", sortable: true,
      render: (r) => new Date(r.updated_at).toLocaleDateString("en-GB"),
    },
    {
      key: "actions", label: "",
      render: (r) => (
        <div className="flex justify-end gap-2">
          <Link href={`${base}/${r.id}`} className="rounded border px-3 py-1">Edit</Link>
          <form action={deletePost}>
            <input type="hidden" name="id" value={r.id} />
            <input type="hidden" name="type" value={type} />
            <button className="rounded border border-red-300 px-3 py-1 text-red-600">Delete</button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <main className="mx-auto max-w-5xl">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{type === "page" ? "Pages" : "Posts"}</h1>
        <Link href={`${base}/new`} className="rounded bg-black px-4 py-2 text-white">
          + New {type}
        </Link>
      </header>

      <DataTable
        columns={columns}
        rows={rows}
        total={total}
        params={{ ...params, page }}
        basePath={base}
        searchPlaceholder="Search title or slug..."
      />
    </main>
  );
}