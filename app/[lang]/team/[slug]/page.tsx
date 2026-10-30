import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { team, isPersonSlug, getPhone } from "@/lib/team";
import { contact } from "@/lib/contact";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const generateStaticParams = () =>
  locales.flatMap((lang) => team.map((p) => ({ lang, slug: p.slug })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isPersonSlug(slug)) return {};
  const { people, teamPage } = await getDictionary(lang);
  return { title: people[slug], description: teamPage.items[slug].role };
}

export default function PersonPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-6 py-24" />}>
      <PersonContent params={params} />
    </Suspense>
  );
}

async function PersonContent({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isPersonSlug(slug)) notFound();

  const { people, teamPage: t } = await getDictionary(lang);
  const item = t.items[slug];
  const image = team.find((p) => p.slug === slug)!.image;
  const phone = getPhone(slug);

  return (
    <article className="mx-auto max-w-4xl px-6 py-24">
      <Link
        href={`/${lang}#contact`}
        className="mb-8 inline-block text-gray-500 dark:text-gray-400 transition hover:text-black"
      >
        {t.back}
      </Link>

      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="relative h-64 w-64 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={image}
            alt={people[slug]}
            fill
            priority
            className="object-cover"
            sizes="256px"
          />
        </div>

        <div>
          <h1 className="mb-2 text-4xl font-bold">{people[slug]}</h1>
          <p className="mb-6 text-lg text-gray-500 dark:text-gray-400">{item.role}</p>
          <p className="mb-6 leading-8 text-gray-700">{item.bio}</p>

          <ul className="mb-8 list-disc space-y-2 ps-6 text-gray-700">
            {item.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
             dir={lang === "fa" || lang === "ar" ? "rtl" : "ltr"}
              className="rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {t.call}:
              <span dir="ltr">
                {phone}
              </span>
            </a>
            <a
              href={`mailto:${contact.email}`}
              dir="ltr"
              className="rounded-lg border px-6 py-3 transition hover:bg-gray-100"
            >
              {contact.email}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}