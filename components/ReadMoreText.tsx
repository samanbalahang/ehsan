"use client";

import { useState } from "react";
import Typewriter from "./Typewriter";

const wordCount = (html: string) =>
  html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;

/** Split HTML into chunks of ~maxWords, cutting only between top-level blocks */
function splitChunks(html: string, maxWords: number): string[] {
  const blocks = html.match(/<(p|h[1-6]|ul|ol|blockquote|figure)[\s\S]*?<\/\1>/g) ?? [html];
  const isHeading = (b: string) => /^<h[1-6]/.test(b);

  const chunks: string[][] = [];
  let current: string[] = [];
  let words = 0;

  for (const block of blocks) {
    current.push(block);
    words += wordCount(block);
    if (words >= maxWords) {
      // never leave a heading alone at the end of a chunk
      const carry = isHeading(current[current.length - 1]) ? [current.pop()!] : [];
      chunks.push(current);
      current = carry;
      words = carry.reduce((s, b) => s + wordCount(b), 0);
    }
  }
  if (current.length) {
    const small = current.reduce((s, b) => s + wordCount(b), 0) < maxWords / 3;
    if (small && chunks.length) chunks[chunks.length - 1].push(...current);
    else chunks.push(current);
  }
  return chunks.map((c) => c.join(""));
}

type Props = {
  html: string;
  label: string;            // "Read more" text, translated
  wordsPerStep?: number;    // default 300
  speed?: number;
  maxSeconds?: number;      // max typing time for each chunk
  storageKey?: string;
  className?: string;
};

export default function ReadMoreText({
  html,
  label,
  wordsPerStep = 300,
  speed = 15,
  maxSeconds = 4,
  storageKey = "about",
  className,
}: Props) {
  const chunks = splitChunks(html, wordsPerStep);
  const [shown, setShown] = useState(0); // index of the last visible chunk

  return (
    <div>
      {chunks.map((chunk, i) => (
        // hidden chunks stay in the HTML (good for SEO), just not displayed
        <div key={i} hidden={i > shown}>
          <Typewriter
            html={chunk}
            speed={speed}
            maxSeconds={maxSeconds}
            storageKey={`${storageKey}-${i}`}
            className={className}
          />
        </div>
      ))}

      {shown < chunks.length - 1 && (
        <button
          type="button"
          onClick={() => setShown((s) => s + 1)}
          className="mt-6 rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {label}
        </button>
      )}
    </div>
  );
}