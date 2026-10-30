"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { languages, useSwitchPath } from "./LanguageDropdown";
import type { Locale } from "@/lib/i18n";
import ThemeToggle from "./ThemeToggle";

type NavDict = {
  home: string;
  about: string;
  services: string;
  shop: string;
  contact: string;
};

export default function MobileMenu({
  lang,
  dict,
}: {
  lang: Locale;
  dict: NavDict;
}) {
  const [open, setOpen] = useState(false);
  const switchPath = useSwitchPath();
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass =
    "block py-3 text-2xl font-medium transition hover:text-gray-500 dark:hover:text-gray-400";

  return (
    <div>
      {/* Mobile controls */}
      <div className="flex items-center gap-1 md:hidden">
        <ThemeToggle />

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Full-screen mobile menu */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-white dark:bg-gray-800"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Menu header */}
          <div className="flex h-20 items-center justify-between px-6">
            <Link href={`/${lang}`} onClick={close}>
              <Image
                src="/images/logo.webp"
                alt="Logo"
                width={52}
                height={52}
              />
            </Link>

            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 overflow-y-auto px-6 pt-8">
            <Link
              href={`/${lang}`}
              onClick={close}
              className={itemClass}
            >
              {dict.home}
            </Link>

            <Link
              href={`/${lang}/services`}
              onClick={close}
              className={itemClass}
            >
              {dict.services}
            </Link>

            <Link href={`/${lang}/shop`}
              onClick={close}
              className={itemClass}
            >
              {dict.shop}
            </Link>
            <Link
              href={`/${lang}#about`}
              onClick={close}
              className={itemClass}
            >
              {dict.about}
            </Link>

            <Link
              href={`/${lang}#contact`}
              onClick={close}
              className={itemClass}
            >
              {dict.contact}
            </Link>
          </nav>

          {/* Language selector */}
          <div className="border-t border-gray-200 px-6 py-6 dark:border-gray-700">
            <Image
              src="/globe.svg"
              alt=""
              width={22}
              height={22}
              className="mb-3 dark:invert"
            />

            <div className="flex flex-wrap gap-3">
              {languages.map((language) => (
                <Link
                  key={language.code}
                  href={switchPath(language.code)}
                  hrefLang={language.code}
                  onClick={close}
                  aria-current={
                    language.code === lang ? "page" : undefined
                  }
                  className={`rounded-full border px-5 py-2 font-medium transition ${language.code === lang
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                  {language.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
