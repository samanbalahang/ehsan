import { contact } from "@/lib/contact";

export const team = [
  { slug: "dastyar", image: "/images/team/dastyar.webp" },
  { slug: "kiany", image: "/images/team/kiany.webp" },
] as const;

export type PersonSlug = (typeof team)[number]["slug"];

export const isPersonSlug = (s: string): s is PersonSlug =>
  team.some((p) => p.slug === s);

export const getPhone = (slug: PersonSlug) =>
  contact.phones.find((p) => p.id === slug)!.number;