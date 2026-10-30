import Link from "next/link";
import type { ReactNode } from "react";
import { perPageOptions, type TableParams } from "@/lib/table";

export type Column<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T) => ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  total: number;
  params: TableParams;      // page already clamped
  basePath: string;         // e.g. "/admin/posts"
  searchPlaceholder?: string;
  empty?: string;
};

export default function DataTable<T extends Record<string, unknown>>({
  columns, rows, total, params, basePath, searchPlaceholder = "Search...", empty = "Nothing here yet.",
}: Props<T>) {
  const { page, perPage, sort, dir, q } = params;
  const pages = Math.max(1, Math.ceil(total / perPage));

  const href = (o: Partial<Record<"page" | "sort" | "dir" | "per", string | number>>) => {
    const sp = new URLSearchParams();
    const next = { page, sort, dir, per: perPage, ...o };
    if (q) sp.set("q", q);
    sp.set("sort", String(next.sort));
    sp.set("dir", String(next.dir));
    sp.set("page", String(next.page));
    sp.set("per", String(next.per));
    return `${basePath}?${sp.toString()}`;
  };

  // 1 … 4 5 6 … 20
  const pageList: (number | "…")[] = [];
  for (let n = 1; n <= pages; n++) {
    if (n === 1 || n === pages || Math.abs(n - page) <= 1) pageList.push(n);
    else if (pageList[pageList.length - 1] !== "…") pageList.push("…");
  }

  const btn = "rounded border px-3 py-1 text-sm transition";
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="space-y-4">
      {/* search + rows per page */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <form action={basePath} className="flex gap-2">
          <input type="hidden" name="sort" value={sort} />
          <input type="hidden" name="dir" value={dir} />
          <input type="hidden" name="per" value={perPage} />
          <input name="q" defaultValue={q} placeholder={searchPlaceholder}
            className="w-64 rounded border bg-white p-2" />
          <button className="rounded bg-black px-4 py-2 text-white">Search</button>
          {q && (
            <Link href={`${basePath}?sort=${sort}&dir=${dir}&per=${perPage}`} className="rounded border bg-white px-4 py-2">
              Clear
            </Link>
          )}
        </form>

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span className="me-1">Rows:</span>
          {perPageOptions.map((n) => (
            <Link key={n} href={href({ per: n, page: 1 })}
              className={`${btn} ${n === perPage ? "bg-gray-900 text-white" : "bg-white hover:bg-gray-100"}`}>
              {n}
            </Link>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-start">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              {columns.map((c) => {
                const active = sort === c.key;
                return (
                  <th key={c.key} className={`px-4 py-3 text-start font-semibold ${c.className ?? ""}`}>
                    {c.sortable ? (
                      <Link
                        href={href({ sort: c.key, dir: active && dir === "asc" ? "desc" : "asc", page: 1 })}
                        className="inline-flex items-center gap-1 hover:text-black"
                      >
                        {c.label}
                        <span className={active ? "text-black" : "text-gray-300"}>
                          {active ? (dir === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      </Link>
                    ) : (
                      c.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row, i) => (
              <tr key={String(row.id ?? i)} className="hover:bg-gray-50">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 ${c.className ?? ""}`}>
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-500">{empty}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
        <p>{from}–{to} of {total}</p>
        {pages > 1 && (
          <nav className="flex items-center gap-1">
            {page > 1 ? (
              <Link href={href({ page: page - 1 })} className={`${btn} bg-white hover:bg-gray-100`}>‹ Prev</Link>
            ) : (
              <span className={`${btn} bg-gray-100 text-gray-400`}>‹ Prev</span>
            )}
            {pageList.map((n, i) =>
              n === "…" ? (
                <span key={`e${i}`} className="px-2">…</span>
              ) : (
                <Link key={n} href={href({ page: n })}
                  className={`${btn} ${n === page ? "bg-gray-900 text-white" : "bg-white hover:bg-gray-100"}`}>
                  {n}
                </Link>
              )
            )}
            {page < pages ? (
              <Link href={href({ page: page + 1 })} className={`${btn} bg-white hover:bg-gray-100`}>Next ›</Link>
            ) : (
              <span className={`${btn} bg-gray-100 text-gray-400`}>Next ›</span>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}