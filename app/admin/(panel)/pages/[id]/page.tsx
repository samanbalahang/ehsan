import PageForm from "../../PageForm";
export const dynamic = "force-dynamic";

export default async function Page({
  params, searchParams,
}: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  return <PageForm type="page" id={id} error={error} />;   // posts/[id] uses type="post"
}