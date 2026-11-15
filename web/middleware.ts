import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./i18n";

// Unknown locales (e.g. /fr, /evil.com, etc) previously rendered fallback content
// under arbitrary URLs or skipped middleware due to loose dot-matching.
// Now: clean protocol-relative slashes and redirect to default locale securely.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cleanPath = pathname.replace(/^\/+/, "/");
  const seg = cleanPath.split("/")[1] || "";

  if (seg && !(locales as readonly string[]).includes(seg)) {
    const url = req.nextUrl.clone();
    const remainder = cleanPath.slice(seg.length + 1).replace(/^\/+/, "/");
    url.pathname = remainder && remainder !== "/"
      ? `/${defaultLocale}${remainder.startsWith("/") ? remainder : `/${remainder}`}`
      : `/${defaultLocale}`;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_next/data|favicon.ico|manifest.json|sw.js|icon.svg|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|json|xml|txt|woff2?|map)).*)"
  ]
};
