import TermManager from "../../TermManager";
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: { searchParams: Promise<{ edit?: string; error?: string }> }) {
  const { edit, error } = await searchParams;
  return <TermManager kind="tag" edit={edit} error={error} />;
}