import { getPosts, getPost, getPostSlugs, type Post } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export type Service = Post;
export const getServices = (lang: Locale) => getPosts(lang, "services");
export const getService = (lang: Locale, slug: string) => getPost(lang, "services", slug);
export const getServiceSlugs = () => getPostSlugs("services");