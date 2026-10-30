"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./RichEditorInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[340px] items-center justify-center rounded border bg-gray-50 text-gray-500">
      Loading editor...
    </div>
  ),
});

export default function RichEditor(props: {
  name: string;
  defaultValue: string;
  lang: "fa" | "en" | "ar";
}) {
  return <Editor {...props} />;
}