import PostList from "../PostList";
import type { RawParams } from "@/lib/table";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  return <PostList type="page" searchParams={await searchParams} />;
}