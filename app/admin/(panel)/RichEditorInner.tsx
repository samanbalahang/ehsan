"use client";

import { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor, Essentials, Paragraph, Heading, Bold, Italic, Link, List,
  BlockQuote, Autoformat, Undo, Image, ImageUpload, ImageToolbar,
  ImageCaption, ImageTextAlternative, SimpleUploadAdapter,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

export default function RichEditorInner({
  name, defaultValue, lang,
}: { name: string; defaultValue: string; lang: "fa" | "en" | "ar" }) {
  const [value, setValue] = useState(defaultValue);
  const editorRef = useRef<ClassicEditor | null>(null);
  const lastAuto = useRef<string | null>(null);
  const lastSource = useRef("");

  // English and Arabic editors receive the auto-translation
  useEffect(() => {
    if (lang === "fa") return;

    const handler = (e: Event) => {
      const d = (e as CustomEvent<{ lang: string; html: string }>).detail;

      if (d.lang !== lang) return;

      const editor = editorRef.current;
      if (!editor) return;

      // If the editor already has content, preserve it.
      if (editor.getData().trim()) return;

      // Only populate an empty editor.
      editor.setData(d.html);

      const translated = editor.getData();
      lastAuto.current = translated;
      setValue(translated);
    };

    window.addEventListener("cms:body-translated", handler);

    return () => {
      window.removeEventListener("cms:body-translated", handler);
    };
  }, [lang]);


  return (
    <div className="w-full [&_.ck-editor__editable]:min-h-[300px] [&_.ck-editor__editable]:outline [&_.ck-editor__editable]:outline-2">      <input type="hidden" name={name} value={value} />
      <CKEditor
        editor={ClassicEditor}
        data={defaultValue}
        onReady={(editor) => {
          editorRef.current = editor;
          setValue(editor.getData());
        }}
        onBlur={(_, editor) => {
          if (lang !== "fa") return;

          const html = editor.getData();

          if (!html.trim() || html === lastSource.current) return;

          lastSource.current = html;

          window.dispatchEvent(
            new CustomEvent("cms:body-blur", {
              detail: { html },
            })
          );
        }}
        onChange={(_, editor) => {
          setValue(editor.getData());
        }}
        config={{
          licenseKey: "GPL",
          plugins: [
            Essentials, Paragraph, Heading, Bold, Italic, Link, List, BlockQuote,
            Autoformat, Undo, Image, ImageUpload, ImageToolbar, ImageCaption,
            ImageTextAlternative, SimpleUploadAdapter,
          ],
          toolbar: [
            "undo", "redo", "|",
            "heading", "|",
            "bold", "italic", "link", "|",
            "bulletedList", "numberedList", "blockQuote", "|",
            "uploadImage",
          ],
          heading: {
            options: [
              { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
              { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
              { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
            ],
          },
          image: { toolbar: ["toggleImageCaption", "imageTextAlternative"] },
          simpleUpload: { uploadUrl: "/api/upload", withCredentials: true },
          language: { ui: "en", content: lang },
        }}
      />
    </div>
  );
}