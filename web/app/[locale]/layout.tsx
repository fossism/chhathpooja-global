import type { Metadata } from "next";
import Link from "next/link";
import { Archivo, Newsreader, Space_Mono } from "next/font/google";
import { locales } from "../../i18n";
import SwRegister from "../../components/SwRegister";
import MusicProvider from "../../components/MusicProvider";
import MiniPlayer from "../../components/MiniPlayer";
import Navbar from "../../components/Navbar";

// Self-hosted fonts (next/font) — no runtime request to Google Fonts,
// so no third-party IP leak and no render-blocking @import in CSS.
// adjustFontFallback: false prevents Next.js from throwing TypeError during fallback metric calculation.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  adjustFontFallback: false
});
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
  variable: "--font-newsreader",
  display: "swap",
  adjustFontFallback: false
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-spacemono",
  display: "swap",
  adjustFontFallback: false
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const META: Record<string, { title: string; description: string }> = {
  en: {
    title: "ChhathMahaparv.org — Dates, Arghya Time, Vidhi, Ghats",
    description: "Kartik Chhath dates, city-wise Sandhya/Usha Arghya time, 4-day vidhi guide, ghat finder and folk songs."
  },
  hi: {
    title: "छठ महापर्व — तिथियां, अर्घ्य समय, विधि, घाट",
    description: "कार्तिक छठ तिथियां, शहर-वार संध्या/उषा अर्घ्य समय, 4-दिवसीय विधि, घाट खोज और लोकगीत।"
  },
  bho: {
    title: "छठ महापरब — तिथि, अरघ समय, बिधि, घाट",
    description: "कातिक छठ तिथि, शहर अनुसार साँझ/भोर अरघ समय, 4 दिन के बिधि, घाट खोज आ लोकगीत।"
  },
  mai: {
    title: "छठ महापर्व — तिथि, अर्घ्य समय, विधि, घाट",
    description: "कातिक छठ तिथि, शहर अनुसार साँझ/भोर अर्घ्य समय, 4 दिनक विधि, घाट खोज आ लोकगीत।"
  },
  ne: {
    title: "छठ महापर्व — मिति, अर्घ्य समय, विधि, घाट",
    description: "कात्तिक छठ मिति, शहर अनुसार साँझ/बिहान अर्घ्य समय, ४-दिने विधि, घाट खोज र लोकगीत।"
  }
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = (locales as readonly string[]).includes(params.locale) ? params.locale : "en";
  const m = META[locale] ?? META.en;
  const base = "https://chhathmahaparv.org";
  return {
    metadataBase: new URL(base),
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${base}/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${base}/${l}`]))
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `${base}/${locale}`,
      siteName: "ChhathMahaparv.org",
      locale,
      type: "website",
      images: [{ url: `${base}/og.jpg`, width: 1200, height: 630, alt: "Chhath Mahaparv — vrtais offering Arghya at the ghat" }]
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [`${base}/og.jpg`]
    }
  };
}

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "bho", label: "भो" },
  { code: "mai", label: "मै" },
  { code: "ne", label: "ने" }
];

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const locale = (locales as readonly string[]).includes(params.locale) ? params.locale : "en";
  return (
    <html lang={locale} className={`${archivo.variable} ${newsreader.variable} ${spaceMono.variable}`}>
      <body>
      <MusicProvider>
      <SwRegister />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-mustard focus:text-teal focus:px-4 focus:py-2 focus:font-bold">Skip to content</a>
      <Navbar locale={locale} />

      {/* Inner pages own their own .shell container; home bands are full-bleed. */}
      <main id="main" className="pb-16">{children}</main>

      <footer className="bg-cream border-t border-line">
        <div className="shell py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <img src="/icon.svg" alt="ChhathMahaparv" className="w-10 h-10" />
            <p className="text-sm text-teal/70 mt-3">ChhathMahaparv — keeping the Mahaparv alive everywhere. MIT open-source.</p>
          </div>
          <nav className="text-sm" aria-label="Site">
            <p className="label mb-2">Site</p>
            <Link className="block py-0.5 hover:underline" href={`/${params.locale}/ask`}>Chhath Sahayak</Link>
            <Link className="block py-0.5 hover:underline" href={`/${params.locale}/vidhi`}>Vidhi guide</Link>
            <Link className="block py-0.5 hover:underline" href={`/${params.locale}/calendar`}>Calendar</Link>
            <Link className="block py-0.5 hover:underline" href={`/${params.locale}/songs`}>Folk archive</Link>
            <Link className="block py-0.5 hover:underline" href={`/${params.locale}/kids`}>Kids mode</Link>
          </nav>
          <nav className="text-sm" aria-label="Community">
            <p className="label mb-2">Community</p>
            <Link className="block py-0.5 hover:underline" href={`/${params.locale}/ghats`}>Ghat finder</Link>
            <Link className="block py-0.5 hover:underline" href={`/${params.locale}/wall`}>Global wall</Link>
            <Link className="block py-0.5 hover:underline" href={`/${params.locale}/about`}>Contribute</Link>
          </nav>
          <div className="text-sm">
            <p className="label mb-2">Note</p>
            <p className="text-teal/70">Sunrise/sunset via Open-Meteo, indicative. Confirm with local Panchang.</p>
            <div className="flex gap-1 mt-3">
              {LOCALES.map((l) => (
                <Link
                  key={l.code}
                  href={`/${l.code}`}
                  className={`rounded-full px-2 py-1 text-xs font-bold ${params.locale === l.code ? "bg-teal text-cream" : "text-teal/70 hover:text-teal"}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="shell py-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-teal/70">
            <span>© 2026 ChhathMahaparv contributors</span>
            <span>Jai Surya Dev • Jai Chhathi Maiya</span>
          </div>
        </div>
      </footer>
      <MiniPlayer />
      </MusicProvider>
      </body>
    </html>
  );
}
