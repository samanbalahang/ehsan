import { readFile } from "node:fs/promises";
import path from "node:path";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: parts } = await params;

  // only our own upload pattern: /images/202506/<16 hex>.<ext>
  if (
    parts.length !== 2 ||
    !/^\d{6}$/.test(parts[0]) ||
    !/^[a-f0-9]{16}\.(jpg|png|webp|gif)$/.test(parts[1])
  ) return new Response("Not found", { status: 404 });

  try {
    const file = await readFile(path.join(process.cwd(), "public", "images", parts[0], parts[1]));
    return new Response(file, {
      headers: {
        "Content-Type": TYPES[parts[1].split(".")[1]],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}