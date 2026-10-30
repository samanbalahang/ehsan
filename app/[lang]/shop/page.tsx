import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getProducts, getProductCategories } from "@/lib/shop";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { shop } = await getDictionary(lang);
  return {
    title: shop.title,
    description: shop.intro,
    alternates: {
      canonical: `/${lang}/shop`,
      languages: { fa: "/fa/shop", en: "/en/shop", ar: "/ar/shop", "x-default": "/fa/shop" },
    },
  };
}

export default async function ShopPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const { category } = await searchParams;
  if (!isLocale(lang)) notFound();

  const { shop } = await getDictionary(lang);
  const [products, categories] = await Promise.all([
    getProducts(lang, category),
    getProductCategories(lang),
  ]);

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition ${
      active
        ? "bg-gray-900 text-white dark:bg-white dark:text-black"
        : "hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <h1 className="mb-4 text-center text-4xl font-bold">{shop.title}</h1>
        <p className="mx-auto mb-10 max-w-2xl text-center text-gray-600 dark:text-gray-300">
          {shop.intro}
        </p>
      </Reveal>

      {categories.length > 0 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <Link href={`/${lang}/shop`} className={chip(!category)}>{shop.all}</Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/${lang}/shop?category=${c.slug}`} className={chip(category === c.slug)}>
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-center text-gray-500">{shop.empty}</p>
      ) : (
        <div className="flex flex-wrap justify-center">
          {products.map((p) => (
            <Reveal key={p.id} className="w-full p-4 sm:w-1/2 lg:w-1/3">
              <ProductCard product={p} lang={lang} labels={shop} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}