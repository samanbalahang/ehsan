"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/posts/categories", label: "Categories", sub: true },
  { href: "/admin/posts/tags", label: "Tags", sub: true },
  { href: "/admin/shop/products", label: "Products" },
{ href: "/admin/shop/categories", label: "Product categories", sub: true },
{ href: "/admin/shop/settings", label: "Shop settings", sub: true },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    if (href === "/admin/posts")
      return (
        pathname === "/admin/posts" ||
        (pathname.startsWith("/admin/posts/") &&
          !pathname.startsWith("/admin/posts/categories") &&
          !pathname.startsWith("/admin/posts/tags"))
      );
    return pathname.startsWith(href);
  };

  return (
    <aside className="bg-gray-900 text-gray-300 md:w-60 md:shrink-0">
      <div className="p-5 text-xl font-bold text-white">Kidanex admin</div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap rounded-md py-2 transition ${
              l.sub ? "px-4 text-sm md:ms-4" : "px-4"
            } ${isActive(l.href) ? "bg-gray-700 text-white" : "hover:bg-gray-800"}`}
          >
            {l.label}
          </Link>
        ))}
        <form action={logout} className="md:mt-6">
          <button className="w-full rounded-md px-4 py-2 text-start hover:bg-gray-800">
            Logout
          </button>
        </form>
      </nav>
    </aside>
  );
}