import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./i18n";

// Unknown locales (e.g. /fr, /../etc) previously rendered English content
// under the wrong URL — bad for SEO (duplicate content) and confusing.
// Now: redirect to the default locale instead of serving fallback content.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const seg = pathname.split("/")[1] || "";
  if (seg && !(locales as readonly string[]).includes(seg)) {
    const url = req.nextUrl.clone();
    // Replace the unknown locale segment, don't prepend: /fr/vidhi → /en/vidhi.
    url.pathname = `/${defaultLocale}${pathname.slice(seg.length + 1)}`;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
