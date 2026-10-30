import "../globals.css";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { locales, isLocale, getDictionary, getDir } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fonts } from "@/lib/fonts";
import { contact } from "@/lib/contact";

const siteUrl = "https://kidanex.com"; // change to your real domain

const ogLocale = { fa: "fa_IR", ar: "ar_AR", en: "en_US" } as const;

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: "%s | Kidanex" },
    description: dict.meta.description,
    openGraph: {
      type: "website",
      siteName: "Kidanex",
      title: dict.meta.title,
      description: dict.meta.description,
      locale: ogLocale[lang],
      images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/images/og-image.jpg"],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const theme = (await cookies()).get("theme")?.value;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kidanex",
    alternateName: ["کیدانکس", "كيدانكس"],
    url: siteUrl,
    logo: `${siteUrl}/images/logo.webp`,
    description: dict.meta.description,
    email: contact.email,
    telephone: contact.phones[0].number,
  };

  return (
    <html
      lang={lang}
      dir={getDir(lang)}
      className={theme === "dark" ? "dark" : ""}
    >
      <body className={fonts[lang].className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Header lang={lang} dict={dict.nav} />
        <main>{children}</main>
        <Footer
          dict={dict.footer}
          brand={dict.brand}
          people={dict.people}
          lang={lang}
        />
      </body>
    </html>
  );
}