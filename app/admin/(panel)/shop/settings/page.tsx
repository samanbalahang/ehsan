import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { getSetting } from "@/lib/shop";
import { saveShopSettings } from "../actions";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;

  const [products] = await db.query<RowDataPacket[]>(
    `SELECT p.id, p.slug, t.title FROM products p
     LEFT JOIN product_translations t ON t.product_id = p.id AND t.lang = 'fa'
     WHERE p.status = 'published' ORDER BY p.sort_order, p.id DESC`
  );

  let selected: number[] = [];
  try { selected = JSON.parse((await getSetting("home_products")) ?? "[]"); } catch {}

  return (
    <main className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Shop settings</h1>
      {saved && <p className="mb-6 rounded bg-green-100 p-3 text-green-700">Saved.</p>}

      <form action={saveShopSettings} className="space-y-4 rounded-xl bg-white p-6 shadow">
        <h2 className="font-bold">Products on the home page</h2>
        {[1, 2, 3].map((n) => (
          <label key={n} className="block">Product {n}
            <select name={`home_product_${n}`} defaultValue={selected[n - 1] ?? ""} className="w-full rounded border p-3">
              <option value="">— none —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.title ?? p.slug}</option>
              ))}
            </select>
          </label>
        ))}
        <p className="text-sm text-gray-500">
          If nothing is selected, the first 3 published products are shown.
        </p>
        <button className="rounded bg-black px-6 py-2 text-white">Save</button>
      </form>
    </main>
  );
}