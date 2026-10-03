import type { MetadataRoute } from "next";
import { locales } from "../i18n";

// Fixed release date — using `new Date()` here would change lastModified on
// every build, forcing needless recrawls and killing CDN cache.
const LAST_MODIFIED = new Date("2026-10-01");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://chhathmahaparv.org";
  const pages = ["", "/calendar", "/vidhi", "/ghats", "/ask", "/wall", "/songs", "/kids", "/about"];
  return locales.flatMap((l) =>
    pages.map((p) => ({ url: `${base}/${l}${p}`, lastModified: LAST_MODIFIED }))
  );
}
