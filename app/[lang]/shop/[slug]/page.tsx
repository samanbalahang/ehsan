import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getProduct } from "@/lib/shop";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const p = await getProduct(lang, slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: {
      canonical: `/${lang}/shop/${slug}`,
      languages: {
        fa: `/fa/shop/${slug}`, en: `/en/shop/${slug}`, ar: `/ar/shop/${slug}`,
        "x-default": `/fa/shop/${slug}`,
      },
    },
    openGraph: { url: `/${lang}/shop/${slug}`, images: p.image ? [p.image] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const { shop } = await getDictionary(lang);
  const p = await getProduct(lang, slug);
  if (!p) notFound();

  const numberLocale = { fa: "fa-IR", ar: "ar", en: "en-US" } as const;

  return (
    <article className="mx-auto max-w-5xl px-6 py-24">
      <Link href={`/${lang}/shop`} className="mb-8 inline-block text-gray-500 transition hover:text-black dark:text-gray-400 dark:hover:text-white">
        <span className="inline-block rtl:rotate-180">←</span> {shop.back}
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative h-80 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 md:h-[28rem]">
          {p.image && (
            <Image src={p.image} alt={p.title} fill priority className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw" />
          )}
        </div>

        <div>
          {p.categoryName && <p className="mb-2 text-gray-500">{p.categoryName}</p>}
          <h1 className="mb-4 text-3xl font-bold">{p.title}</h1>
          <p className="mb-6 text-lg leading-8 text-gray-600 dark:text-gray-300">{p.summary}</p>

          {p.price === null ? (
            <Link
              href={`/${lang}#contact`}
              className="inline-block rounded-lg bg-gold px-8 py-3 font-medium text-white transition hover:opacity-90"
            >
              {shop.call}
            </Link>
          ) : (
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat(numberLocale[lang]).format(p.price)}{" "}
              <span className="text-base font-normal text-gray-500">{shop.currency}</span>
            </p>
          )}
        </div>
      </div>

      {p.body && (
        <div
          className="mt-12 leading-8 text-gray-600 dark:text-gray-300 dark:[&_strong]:text-gold [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_p]:mb-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_figure]:my-6"
          dangerouslySetInnerHTML={{ __html: p.body }}
        />
      )}
    </article>
  );
}