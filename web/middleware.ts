import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./i18n";

// Public files that must not be treated as locale routes. Keeping this as an
// explicit allowlist avoids the old "any path ending in .js/.json" bypass.
const PUBLIC_ASSET_RE =
  /^\/(?:favicon\.ico|robots\.txt|sitemap\.xml|manifest\.json|sw\.js|og\.jpg|icon(?:-\d+)?\.(?:svg|png)|maskable-512\.png|chhath-[^/]+\.(?:jpg|png)|leaflet\/|covers\/|images\/|videos\/|audio\/)/;

function buildCsp(nonce: string): string {
  const isProd = process.env.NODE_ENV === "production";
  const scriptSrc = isProd
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' https://www.youtube.com`
    : `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' https://www.youtube.com`;

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    // Tailwind/Next currently emit inline style attributes; keep this until a
    // style nonce/hash rollout is practical.
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://i.ytimg.com",
    "connect-src 'self' https://api.open-meteo.com https://www.youtube.com https://i.ytimg.com https://*.supabase.co",
    "frame-src 'self' https://www.youtube.com",
    "media-src 'self' blob:",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(isProd ? ["upgrade-insecure-requests"] : [])
  ].join("; ");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Never intercept Next.js internals, API routes, or known public assets.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/_not-found" ||
    PUBLIC_ASSET_RE.test(pathname)
  ) {
    return NextResponse.next();
  }

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

  const nonce = crypto.randomUUID().replace(/-/g, "");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
