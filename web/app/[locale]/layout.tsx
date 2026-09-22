import { locales } from "../../i18n";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const NAV = [
  { href: "calendar", label: "Calendar" },
  { href: "vidhi", label: "Vidhi" },
  { href: "ghats", label: "Ghats" },
  { href: "wall", label: "Wall" },
  { href: "songs", label: "Songs" },
  { href: "kids", label: "Kids" },
  { href: "about", label: "About" }
];

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "bho", label: "भो" },
  { code: "mai", label: "मै" },
  { code: "ne", label: "ने" }
];

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  return (
    <>
      <header className="sticky top-0 z-20">
        <div className="bg-teal text-cream">
          <div className="shell flex items-center justify-between py-1.5 text-xs">
            <span className="font-semibold tracking-wide">Kartik Chhath · Nov 13–16, 2026 — Global</span>
            <a href={`/${params.locale}/about`} className="font-bold hover:underline">Contribute →</a>
          </div>
        </div>
        <div className="bg-cream/95 backdrop-blur border-b border-line">
          <div className="shell flex items-center justify-between gap-3 py-3">
            <a href={`/${params.locale}`} className="flex items-center gap-2.5">
              <img src="/icon.svg" alt="ChhathMahaparv — home" className="w-9 h-9" />
              <span className="leading-tight">
                <span className="block font-extrabold tracking-tight">ChhathMahaparv</span>
                <span className="block text-xs text-teal/70 font-medium">Global open-source hub</span>
              </span>
            </a>
            <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
              {NAV.map((n) => (
                <a key={n.href} href={`/${params.locale}/${n.href}`} className="nav-link">{n.label}</a>
              ))}
              <a href={`/${params.locale}/vidhi`} className="btn btn-primary !py-2 !px-5 ml-2">Start Vidhi</a>
            </nav>
            <div className="flex md:hidden items-center gap-1">
              {LOCALES.map((l) => (
                <a
                  key={l.code}
                  href={`/${l.code}`}
                  className={`rounded-full px-2 py-1 text-xs font-bold ${params.locale === l.code ? "bg-teal text-cream" : "text-teal/70"}`}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="md:hidden border-t border-line overflow-x-auto">
            <div className="shell flex gap-1 py-2">
              {NAV.map((n) => (
                <a key={n.href} href={`/${params.locale}/${n.href}`} className="nav-link whitespace-nowrap">{n.label}</a>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="shell py-10">{children}</main>

      <footer className="bg-cream border-t border-line">
        <div className="shell py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <img src="/icon.svg" alt="ChhathMahaparv" className="w-10 h-10" />
            <p className="text-sm text-teal/70 mt-3">ChhathMahaparv — keeping the Mahaparv alive everywhere. MIT open-source.</p>
          </div>
          <nav className="text-sm" aria-label="Site">
            <p className="label mb-2">Site</p>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/vidhi`}>Vidhi guide</a>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/calendar`}>Calendar</a>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/songs`}>Folk archive</a>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/kids`}>Kids mode</a>
          </nav>
          <nav className="text-sm" aria-label="Community">
            <p className="label mb-2">Community</p>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/ghats`}>Ghat finder</a>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/wall`}>Global wall</a>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/about`}>Contribute</a>
          </nav>
          <div className="text-sm">
            <p className="label mb-2">Note</p>
            <p className="text-teal/70">Sunrise/sunset via Open-Meteo, indicative. Confirm with local Panchang.</p>
            <div className="flex gap-1 mt-3">
              {LOCALES.map((l) => (
                <a
                  key={l.code}
                  href={`/${l.code}`}
                  className={`rounded-full px-2 py-1 text-xs font-bold ${params.locale === l.code ? "bg-teal text-cream" : "text-teal/70 hover:text-teal"}`}
                >
                  {l.label}
                </a>
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
    </>
  );
}
