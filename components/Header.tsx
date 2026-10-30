
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import LanguageDropdown from "./LanguageDropdown";
import type { Locale } from "@/lib/i18n";
import ThemeToggle from "./ThemeToggle";

export type NavDict = {
  home: string;
  about: string;
  services: string;
  shop: string;
  contact: string;
};

export default function Header({
  lang,
  dict,
}: {
  lang: Locale;
  dict: NavDict;
}) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm dark:bg-gray-900 dark:shadow-none dark:border-b dark:border-gray-800">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href={`/${lang}`} className="text-2xl font-bold">
          <Image
            src="/images/logo.webp"
            alt="Logo"
            priority
            className="object-cover"
            width={52}
            height={52}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href={`/${lang}`}
            className="transition hover:text-gray-500 dark:text-gray-400"
          >
            {dict.home}
          </Link>

          <Link
            href={`/${lang}/services`}
            className="transition hover:text-gray-500 dark:text-gray-400"
          >
            {dict.services}
          </Link>
          <Link href={`/${lang}/shop`} className="transition hover:text-gray-500">
            {dict.shop}
          </Link>
          <Link
            href={`/${lang}#about`}
            className="transition hover:text-gray-500 dark:text-gray-400"
          >
            {dict.about}
          </Link>

          <Link
            href={`/${lang}#contact`}
            className="transition hover:text-gray-500 dark:text-gray-400"
          >
            {dict.contact}
          </Link>

          {/* Language and theme controls */}
          <div className="ms-4 flex border-s ps-6">
            <LanguageDropdown lang={lang} />
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <MobileMenu lang={lang} dict={dict} />
      </div>
    </header>
  );
}
