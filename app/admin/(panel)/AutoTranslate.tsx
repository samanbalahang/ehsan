"use client";

import { useEffect, useState } from "react";

const TARGETS = ["en", "ar"] as const;

async function translate(items: string[], to: string, html = false): Promise<string[]> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, from: "fa", to, html }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "Translation failed");
  return data.items;
}

export default function AutoTranslate() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const autoValue = new Map<string, string>(); // field name -> last auto-filled value
    const lastSource = new Map<string, string>(); // field name -> last Persian text sent
    let running = 0;

    const wrap = async (fn: () => Promise<void>) => {
      running++;
      setStatus("Translating...");
      try {
        await fn();
        if (--running === 0) setStatus("");
      } catch (e) {
        running--;
        setStatus(e instanceof Error ? e.message : "Translation failed");
        setTimeout(() => running === 0 && setStatus(""), 5000);
      }
    };

    async function onFocusOut(e: FocusEvent) {
      const el = e.target as HTMLInputElement | HTMLTextAreaElement | null;
      const m = el?.name?.match(/^(title|summary|points)_fa$/);
      if (!el || !m) return;

      const field = m[1];
      const text = el.value.trim();
      if (!text || lastSource.get(el.name) === text) return;
      lastSource.set(el.name, text);

      for (const to of TARGETS) {
        const target = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          `[name="${field}_${to}"]`
        );
        if (!target) continue;
        const cur = target.value.trim();
        if (cur && cur !== autoValue.get(target.name)) continue; // typed by a person

        await wrap(async () => {
          const lines = field === "points" ? text.split("\n").filter((l) => l.trim()) : [text];
          const out = (await translate(lines, to)).join("\n");
          target.value = out;
          autoValue.set(target.name, out);
        });
      }
    }

    async function onBody(e: Event) {
      const { html } = (e as CustomEvent<{ html: string }>).detail;
      for (const to of TARGETS) {
        await wrap(async () => {
          const [out] = await translate([html], to, true);
          window.dispatchEvent(
            new CustomEvent("cms:body-translated", { detail: { lang: to, html: out } })
          );
        });
      }
    }

    document.addEventListener("focusout", onFocusOut);
    window.addEventListener("cms:body-blur", onBody);
    return () => {
      document.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("cms:body-blur", onBody);
    };
  }, []);

  if (!status) return null;
  return (
    <div className="fixed bottom-4 end-4 z-50 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
      {status}
    </div>
  );
}