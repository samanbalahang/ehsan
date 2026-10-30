import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { parseTable, clampPage, orderSql, type RawParams } from "@/lib/table";
import DataTable, { type Column } from "../../DataTable";
import { deleteProduct } from "../actions";

export const dynamic = "force-dynamic";

const SORT: Record<string, string> = {
  title: "t.title",
  slug: "p.slug",
  category: "ct.name",
  price: "p.price",
  status: "p.status",
  order: "p.sort_order",
  updated: "p.updated_at",
};

export default async function Page({ searchParams }: { searchParams: Promise<RawParams> }) {
  const params = parseTable(await searchParams, Object.keys(SORT), { sort: "updated", dir: "desc" });

  const like = `%${params.q}%`;
  const where = params.q ? "WHERE (t.title LIKE ? OR p.slug LIKE ?)" : "";
  const args: string[] = params.q ? [like, like] : [];

  const FROM = `
    FROM products p
    LEFT JOIN product_translations t ON t.product_id = p.id AND t.lang = 'fa'
    LEFT JOIN product_category_translations ct ON ct.category_id = p.category_id AND ct.lang = 'fa'`;

  const [countRows] = await db.query<RowDataPacket[]>(`SELECT COUNT(*) AS total ${FROM} ${where}`, args);
  const total = Number(countRows[0].total);
  const page = clampPage(total, params);

  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT p.id, p.slug, p.status, p.price, p.sort_order, p.updated_at,
            t.title, ct.name AS category
     ${FROM} ${where}
     ORDER BY ${orderSql(SORT, params)}, p.id DESC
     LIMIT ? OFFSET ?`,
    [...args, params.perPage, (page - 1) * params.perPage]
  );

  const columns: Column<RowDataPacket>[] = [
    { key: "title", label: "Title", sortable: true, render: (r) => <span className="font-medium">{r.title ?? r.slug}</span> },
    { key: "slug", label: "Slug", sortable: true, render: (r) => <span dir="ltr" className="text-gray-500">/{r.slug}</span> },
    { key: "category", label: "Category", sortable: true, render: (r) => r.category ?? "—" },
    {
      key: "price", label: "Price", sortable: true,
      render: (r) => (r.price === null ? <span className="text-gray-400">Call us</span> : Number(r.price).toLocaleString()),
    },
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
      key: "actions", label: "",
      render: (r) => (
        <div className="flex justify-end gap-2">
          <Link href={`/admin/shop/products/${r.id}`} className="rounded border px-3 py-1">Edit</Link>
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={r.id} />
            <button className="rounded border border-red-300 px-3 py-1 text-red-600">Delete</button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <main className="mx-auto max-w-5xl">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/shop/products/new" className="rounded bg-black px-4 py-2 text-white">
          + New product
        </Link>
      </header>

      <DataTable
        columns={columns}
        rows={rows}
        total={total}
        params={{ ...params, page }}
        basePath="/admin/shop/products"
        searchPlaceholder="Search title or slug..."
      />
    </main>
  );
}