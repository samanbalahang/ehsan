import { contact } from "@/lib/contact";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type FooterDict = {
  tagline: string;
  contactTitle: string;
  rights: string;
};

type Brand = { first: string; second: string };

type People = { dastyar: string; kiany: string };

export default function Footer({ dict, brand, people, lang }: {
  dict: FooterDict; brand: Brand; people: People; lang: Locale;
}) {
  return (
    <footer className="bg-gray-900 px-6 py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-10">
        {/* Brand */}
        <div>
          <h3 className="mb-4 text-xl font-bold">
            <span className="inline-block">
              {brand.first}
              <span className="text-gold">{brand.second}</span>
            </span>
          </h3>

          <p className="max-w-sm text-gray-400">{dict.tagline}</p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">{dict.contactTitle}</h3>

          <div className="space-y-2 text-gray-400">
            <p className="text-start">
              <span dir="ltr" className="inline-block">
                {contact.email}
              </span>
            </p>

            {contact.phones.map((p) => (
              <p key={p.id} className="text-start">
                <Link href={`/${lang}/team/${p.id}`} className="transition hover:text-white">
                  {people[p.id as keyof People]}
                </Link>
                :{" "}
                <span dir="ltr" className="inline-block">{p.number}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-10 max-w-7xl border-t border-gray-700 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        {dict.rights}
      </div>
    </footer>
  );
}