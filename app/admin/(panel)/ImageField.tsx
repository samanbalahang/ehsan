"use client";

import { useRef, useState } from "react";

export default function ImageField({ defaultValue }: { defaultValue: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("upload", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? "Upload failed");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <span className="block">Feature image</span>
      <input type="hidden" name="image" value={url} />

      <div
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={(e) => {
          // ignore leave events fired by child elements
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files?.[0]);
        }}
        className={`relative flex min-h-40 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition ${
          dragging ? "border-black bg-gray-100" : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-48 w-full object-cover" />
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p className="font-medium">Drop an image here or click to choose</p>
            <p className="mt-1 text-xs">JPG, PNG, WebP or GIF, up to 5 MB</p>
          </div>
        )}

        {/* the real input covers the whole area: click opens the file dialog */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={busy}
          onChange={(e) => upload(e.target.files?.[0])}
          aria-label="Feature image"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />

        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-gray-700">
            Uploading...
          </div>
        )}
      </div>

      {url && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">Click or drop a new image to replace it</span>
          <button type="button" onClick={() => setUrl("")} className="text-red-600">
            Remove
          </button>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}