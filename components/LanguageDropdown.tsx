"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export const languages: { code: Locale; label: string }[] = [
  { code: "fa", label: "FA" },
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
];

export function useSwitchPath() {
  const pathname = usePathname();
  return (target: Locale) => {
    const segments = pathname.split("/");
    segments[1] = target; // replace the locale segment
    return segments.join("/") || `/${target}`;
  };
}

export default function LanguageDropdown({ lang }: { lang: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const switchPath = useSwitchPath();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        className="rounded-md p-2 transition hover:bg-gray-100"
      >
        <Image src="/globe.svg" alt="" width={24} height={24} className="dark:invert" />
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute end-0 top-full mt-2 w-24 overflow-hidden rounded-lg border bg-white py-1 shadow-lg dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {languages.map((l) => (
            <li key={l.code} role="none">
              <Link
                role="menuitem"
                href={switchPath(l.code)}
                hrefLang={l.code}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-sm transition hover:bg-gray-100 ${
                  l.code === lang ? "font-bold" : "font-medium"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}