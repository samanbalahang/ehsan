import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shop";
import type { Locale } from "@/lib/i18n";

type Labels = { call: string; currency: string; details: string };

const numberLocale = { fa: "fa-IR", ar: "ar", en: "en-US" } as const;

export default function ProductCard({
  product, lang, labels,
}: { product: Product; lang: Locale; labels: Labels }) {
  const href = `/${lang}/shop/${product.slug}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
      <Link href={href} className="relative block h-56 w-full bg-gray-100 dark:bg-gray-700">
        {product.image && (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        {product.categoryName && (
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">{product.categoryName}</p>
        )}
        <h3 className="mb-2 text-xl font-semibold">
          <Link href={href}>{product.title}</Link>
        </h3>
        <p className="mb-4 flex-1 leading-7 text-gray-600 dark:text-gray-300">{product.summary}</p>

        <div className="flex items-center justify-between gap-3">
          {product.price === null ? (
            <Link
              href={`/${lang}#contact`}
              className="rounded-lg border border-gold px-4 py-2 font-medium text-gold transition hover:bg-gold hover:text-white"
            >
              {labels.call}
            </Link>
          ) : (
            <p className="font-bold">
              {new Intl.NumberFormat(numberLocale[lang]).format(product.price)}{" "}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {labels.currency}
              </span>
            </p>
          )}
          <Link
            href={href}
            className="rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {labels.details}
          </Link>
        </div>
      </div>
    </article>
  );
}