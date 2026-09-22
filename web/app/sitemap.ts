import type { MetadataRoute } from "next";
import { locales } from "../i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://chhathmahaparv.org";
  const pages = ["", "/calendar", "/vidhi", "/ghats", "/wall", "/songs", "/kids", "/about"];
  return locales.flatMap((l) =>
    pages.map((p) => ({ url: `${base}/${l}${p}`, lastModified: new Date() }))
  );
}
