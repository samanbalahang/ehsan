import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT
       (SELECT COUNT(*) FROM posts WHERE type='page') AS pages,
       (SELECT COUNT(*) FROM posts WHERE type='post') AS posts,
       (SELECT COUNT(*) FROM categories) AS categories,
       (SELECT COUNT(*) FROM tags) AS tags`
  );
  const c = rows[0];

  const cards = [
    ["Pages", c.pages, "/admin/pages"],
    ["Posts", c.posts, "/admin/posts"],
    ["Categories", c.categories, "/admin/posts/categories"],
    ["Tags", c.tags, "/admin/posts/tags"],
  ] as const;

  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, n, href]) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl bg-white p-6 shadow transition hover:shadow-md"
          >
            <p className="text-3xl font-bold">{n}</p>
            <p className="text-gray-500">{label}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}