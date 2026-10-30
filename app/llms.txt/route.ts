import { getServices } from "@/lib/services";
import { getPosts } from "@/lib/content";

const base = "https://kidanex.com";

export const revalidate = 3600;

export async function GET() {
  const [services, team] = await Promise.all([
    getServices("en"),
    getPosts("en", "ourteam"),
  ]);

  const body = `# Kidanex

> Kidanex is a diversified business holding working in cardboard manufacturing, management consulting, marketing, agricultural and general trading, and export of cosmetic products.

The site is available in Persian (/fa, default), English (/en) and Arabic (/ar).

## Main pages

- [Home](${base}/en)
- [Services](${base}/en/services)

## Services

${services.map((s) => `- [${s.title}](${base}/en/services/${s.slug}): ${s.summary}`).join("\n")}

## Team

${team.map((p) => `- [${p.title}](${base}/en/team/${p.slug}): ${p.summary}`).join("\n")}

## Contact

- Email: info@kidanex.com
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}