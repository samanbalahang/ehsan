import { NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";
import { getServiceSlugs } from "@/lib/services";
import { getPostSlugs } from "@/lib/content";   // 1) replaces: import { team } from "@/lib/team"
import { getProductSlugs } from "@/lib/shop";


export const revalidate = 3600;

const base = "https://kidanex.com";
const lastModified = "2026-10-15";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    // 2) replaces: const slugs = await getServiceSlugs();
    const [slugs, teamSlugs, productSlugs] = await Promise.all([
      getServiceSlugs(),
      getPostSlugs("ourteam"),
      getProductSlugs(),
    ]);

    const paths = [
      "",
      "/services",
      "/shop",
      ...slugs.map((slug) => `/services/${slug}`),
      ...teamSlugs.map((slug) => `/team/${slug}`),   // 3) replaces: ...team.map(...)
      ...productSlugs.map((s) => `/shop/${s}`),
    ];

    const urls = paths.flatMap((path) =>
      locales.map((lang) => {
        const url = `${base}/${lang}${path}`;

        const alternates = [
          ...locales.map(
            (locale) =>
              `<xhtml:link rel="alternate" hreflang="${escapeXml(locale)}" href="${escapeXml(`${base}/${locale}${path}`)}" />`
          ),
          `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${base}/${defaultLocale}${path}`)}" />`,
        ].join("\n    ");

        return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastModified}</lastmod>
    ${alternates}
  </url>`;
      })
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate sitemap. Check the server terminal." },
      { status: 500 }
    );
  }
}