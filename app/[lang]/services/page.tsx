import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getServices } from "@/lib/services";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { servicesPage: t } = await getDictionary(lang);
  return {
    title: t.title,
    description: t.intro,
    alternates: {
      canonical: `/${lang}/services`,
      languages: {
        fa: "/fa/services",
        en: "/en/services",
        ar: "/ar/services",
        "x-default": "/fa/services",
      },
    },
  };
}

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const { servicesPage: t } = await getDictionary(lang); // UI texts (title, intro, button)
  const items = await getServices(lang);                 // content from MySQL

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <h1 className="mb-4 text-center text-4xl font-bold">{t.title}</h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600 dark:text-gray-300">
          {t.intro}
        </p>
      </Reveal>

      <div className="flex flex-wrap justify-center">
        {items.map((s) => (
          <Reveal key={s.slug} className="w-full p-4 sm:w-1/2 lg:w-1/3">
            <article className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
              <div className="relative h-56 w-full">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h2 className="mb-3 text-2xl font-semibold">{s.title}</h2>
                <p className="mb-6 leading-7 text-gray-600 dark:text-gray-300">
                  {s.summary}
                </p>
                <Link
                  href={`/${lang}/services/${s.slug}`}
                  className="inline-block rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  {t.readMore}
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}