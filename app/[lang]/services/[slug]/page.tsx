import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getService } from "@/lib/services";

type Props = { params: Promise<{ lang: string; slug: string }> };

// rebuild each page at most once an hour (admin saves can also call revalidatePath)
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const service = await getService(lang, slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.summary,
    alternates: {
      canonical: `/${lang}/services/${slug}`,
      languages: {
        fa: `/fa/services/${slug}`,
        en: `/en/services/${slug}`,
        ar: `/ar/services/${slug}`,
        "x-default": `/fa/services/${slug}`,
      },
    },
    openGraph: { url: `/${lang}/services/${slug}` },
  };
}

export default async function ServiceDetail({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const { servicesPage: t } = await getDictionary(lang); // UI texts only
  const service = await getService(lang, slug);          // content from MySQL
  if (!service) notFound();

  return (
    <article className="mx-auto max-w-4xl px-6 py-24">
      <Link
        href={`/${lang}/services`}
        className="mb-8 inline-block text-gray-500 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
      >
        <span className="inline-block rtl:rotate-180">←</span> {t.back}
      </Link>

      <div className="relative mb-10 h-72 w-full overflow-hidden rounded-xl md:h-96">
        <Image
          src={service.image}
          alt={service.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
        />
      </div>

      <h1 className="mb-6 text-4xl font-bold">{service.title}</h1>

      {/* body is HTML saved by the admin, sanitized before saving */}
      <div
        className="mb-8 text-lg leading-8 text-gray-600 dark:text-gray-300 dark:[&_strong]:text-gold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_p]:mb-4"
        dangerouslySetInnerHTML={{ __html: service.body }}
      />

      {service.points.length > 0 && (
        <ul className="mb-12 list-disc space-y-3 ps-6 text-gray-700 dark:text-gray-300">
          {service.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}

      <Link
        href={`/${lang}#contact`}
        className="inline-block rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
      >
        {t.contactCta}
      </Link>
    </article>
  );
}