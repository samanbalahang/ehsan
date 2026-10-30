import Image from "next/image";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { getDictionary, isLocale } from "@/lib/i18n";
import { contact } from "@/lib/contact";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import { getServices } from "@/lib/services";
import Typewriter from "@/components/Typewriter";
import ReadMoreText from "@/components/ReadMoreText";
import { getPage } from "@/lib/content";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/shop";


const cardImages = [
  "/images/card-board.webp",
  "/images/manager.webp",
  "/images/buyers.webp",
];
const heroImages: Record<Locale, string> = {
  en: "/images/hero-image.webp",
  fa: "/images/fa-hero-image.webp",
  ar: "/images/fa-hero-image.webp",
};
const mobileHeroImages: Record<Locale, string> = {
  en: "/images/hero-mobile.webp",
  fa: "/images/hero-mobile.webp",
  ar: "/images/hero-mobile.webp",
};

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  // inside the component
  const { home: t, brand, people, shop } = await getDictionary(lang);
  const featured = await getFeaturedProducts(lang);
  const items = await getServices(lang);
  const about = await getPage(lang, "about");

  return (
    <>
      {/* Hero */}
      <Reveal>
        <section className="relative h-screen w-full">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet={mobileHeroImages[lang]}
            />

            <Image
              src={heroImages[lang]}
              alt=""
              priority
              className="object-cover"
              sizes="100vw"
              fill
            />
          </picture>

          <div className="absolute inset-0 flex items-center justify-center items-end md:items-center pb-10 md:pb-0 md:justify-start bg-black/40">
            <div className="w-full md:w-1/2 md:px-16">
              <h1 className="px-6 text-start text-4xl font-bold text-white md:text-6xl">
                <span className="inline-block">
                  {brand.first}
                  <span className="text-gold">{brand.second}</span>:
                </span>{" "}
                <br />
                <span className="md:text-3xl">
                  {t.hero.tagline}
                </span>
              </h1>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <h2 className="mb-12 text-center text-3xl font-bold">
            {t.services.title}
          </h2>
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
                  <h3 className="mb-3 text-2xl font-semibold">{s.title}</h3>
                  <p className="mb-6 leading-7 text-gray-600 dark:text-gray-300">{s.summary}</p>
                  <Link
                    href={`/${lang}/services/${s.slug}`}
                    className="inline-block rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    {t.services.readMore}
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <h2 className="mb-12 text-center text-3xl font-bold">{shop.featuredTitle}</h2>
          </Reveal>

          <div className="flex flex-wrap justify-center">
            {featured.map((p) => (
              <Reveal key={p.id} className="w-full p-4 sm:w-1/2 lg:w-1/3">
                <ProductCard product={p} lang={lang} labels={shop} />
              </Reveal>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href={`/${lang}/shop`}
              className="inline-block rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {shop.viewAll}
            </Link>
          </div>
        </section>
      )}
      {/* About */}
      <section id="about" className="bg-gray-100 px-6 py-24 text-center dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="mb-6 text-3xl font-bold">{about?.title ?? t.about.title}</h2>
          </Reveal>

          <ReadMoreText
            html={about?.body ?? t.about.text}
            label={t.services.readMore}
            wordsPerStep={100}
            speed={15}
            maxSeconds={4}
            storageKey={`typewriter-about-${lang}`}
            className="text-justify leading-8 text-gray-600 dark:text-gray-300 dark:[&_strong]:text-gold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-start [&_h3]:text-xl [&_h3]:font-bold [&_p]:mb-4"
          />
        </div>
      </section>

      {/* Contact */}
      <Reveal>
        <section id="contact" className="px-6 py-24 text-center">
          <h2 className="mb-6 text-3xl font-bold">{t.contact.title}</h2>

          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <p>
              {t.contact.email}:{" "}
              <span dir="ltr" className="inline-block">{contact.email}</span>
            </p>
            {contact.phones.map((p) => (
              <p key={p.id}>
                <Link
                  href={`/${lang}/team/${p.id}`}
                  className="underline transition hover:text-black hover:underline"
                >
                  {people[p.id as keyof typeof people]}
                </Link>
                :{" "}
                <span dir="ltr" className="inline-block">{p.number}</span>
              </p>
            ))}
          </div>
        </section>
      </Reveal>
    </>
  );
}