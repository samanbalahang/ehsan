import localFont from "next/font/local";
import type { Locale } from "@/lib/i18n";

const english = localFont({
  src: "../fonts/roboto-flex-latin-wght-normal.woff2",
  weight: "100 1000",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const persian = localFont({
  src: "../fonts/IRANSansXV.woff2",
  weight: "100 900",
  display: "swap",
  fallback: ["Tahoma", "sans-serif"],
});

const arabic = localFont({
  src: [
    {
      path: "../fonts/cairo-arabic-standard-normal.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../fonts/cairo-latin-wght-normal.woff2",
      weight: "200 900",
      style: "normal",
    },
  ],
  display: "swap",
  fallback: ["Tahoma", "sans-serif"],
});

export const fonts: Record<Locale, { className: string }> = {
  en: english,
  fa: persian,
  ar: arabic,
};