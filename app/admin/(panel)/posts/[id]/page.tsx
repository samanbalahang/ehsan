import PostForm from "../../PostForm";
export const dynamic = "force-dynamic";

export default async function Post({
  params, searchParams,
}: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  return <PostForm type="post" id={id} error={error} />;   // posts/[id] uses type="post"
}