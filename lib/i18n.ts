export const locales = ["fa", "en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";

export const isLocale = (l: string): l is Locale =>
  (locales as readonly string[]).includes(l);

// Persian and Arabic are RTL, English is LTR
export const getDir = (lang: Locale) => (lang === "en" ? "ltr" : "rtl");

export const localeNames: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
  ar: "العربية",
};

const dictionaries = {
  fa: () => import("@/dictionaries/fa.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  ar: () => import("@/dictionaries/ar.json").then((m) => m.default),
};

export const getDictionary = (lang: Locale) => dictionaries[lang]();