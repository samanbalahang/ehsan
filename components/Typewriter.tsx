"use client";

import { useLayoutEffect, useRef } from "react";

type Props = {
  html: string;
  /** milliseconds per character: smaller = faster (default 20) */
  speed?: number;
  /** the whole animation never takes longer than this many seconds */
  maxSeconds?: number;
  /** localStorage key used to remember that the text was already typed */
  storageKey?: string;
  className?: string;
};

export default function Typewriter({
  html,
  speed = 20,
  maxSeconds = 6,
  storageKey = "typewriter-seen",
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // already seen before: keep the full text, no effect
    try {
      if (localStorage.getItem(storageKey) === "1") return;
    } catch { }

    const nodes: Text[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);

    const items: { typed: Text; rest: HTMLSpanElement; full: string }[] = [];
    nodes.forEach((node) => {
      const full = node.data;
      if (!full.trim()) return;
      const rest = document.createElement("span");
      rest.style.visibility = "hidden";
      rest.textContent = full;
      node.data = "";
      node.parentNode!.insertBefore(rest, node.nextSibling);
      items.push({ typed: node, rest, full });
    });

    const total = items.reduce((sum, i) => sum + i.full.length, 0);
    const perChar = Math.min(speed, (maxSeconds * 1000) / Math.max(total, 1));

    const render = (count: number) => {
      let left = count;
      for (const item of items) {
        const n = Math.max(0, Math.min(left, item.full.length));
        item.typed.data = item.full.slice(0, n);
        item.rest.textContent = item.full.slice(n);
        left -= n;
      }
    };

    let raf = 0;
    const start = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const count = Math.min(total, Math.ceil((now - t0) / perChar));
        render(count);
        if (count < total) {
          raf = requestAnimationFrame(tick);
        } else {
          // finished: remember it
          try {
            localStorage.setItem(storageKey, "1");
          } catch { }
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          start();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" }
    );
    observer.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      root.innerHTML = html;
    };
  }, [html, speed, maxSeconds, storageKey]);

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}