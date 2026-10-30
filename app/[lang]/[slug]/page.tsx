import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n";
import { getPage } from "@/lib/content";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const page = await getPage(lang, slug);
  return page ? { title: page.title, description: page.summary } : {};
}

export default async function GenericPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const page = await getPage(lang, slug);
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="mb-6 text-4xl font-bold">{page.title}</h1>
      <div
        className="leading-8 text-gray-600 dark:text-gray-300 [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_p]:mb-4"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </article>
  );
}