/** Keep the optimizer allowlist aligned with next.config.mjs. */
export function canOptimizeProductImage(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    if (url.protocol === "https:" && url.hostname === "images.unsplash.com") return true;
    const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return Boolean(
      storageUrl &&
        url.origin === new URL(storageUrl).origin &&
        url.pathname.startsWith("/storage/v1/object/public/")
    );
  } catch {
    return false;
  }
}
