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
      <header className="sticky top-0 z-20 bg-cream/95 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <a href={`/${params.locale}`} className="flex items-center gap-2.5">
            <img src="/icon.svg" alt="Chhath" className="w-9 h-9" />
            <span className="leading-tight">
              <span className="block font-bold">ChhathMahaparv</span>
              <span className="block text-xs text-teal/70 font-medium">Global open-source hub</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <a key={n.href} href={`/${params.locale}/${n.href}`} className="nav-link">{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex gap-1">
              {LOCALES.map((l) => (
                <a
                  key={l.code}
                  href={`/${l.code}`}
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${params.locale === l.code ? "bg-teal text-cream" : "text-teal/70 hover:text-teal"}`}
                >
                  {l.label}
                </a>
              ))}
            </div>
            <a href={`/${params.locale}/vidhi`} className="btn btn-primary !py-2">Start Vidhi</a>
          </div>
        </div>
        <div className="md:hidden border-t border-line overflow-x-auto">
          <div className="flex gap-1 px-4 py-2">
            {NAV.map((n) => (
              <a key={n.href} href={`/${params.locale}/${n.href}`} className="nav-link whitespace-nowrap">{n.label}</a>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>

      <footer className="mt-12 border-t border-line bg-teal text-cream">
        <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="font-bold">ChhathMahaparv.org</p>
            <p className="text-sm text-cream/70 mt-1">Dates, Arghya time, vidhi, ghats and songs — MIT open-source for the global family.</p>
          </div>
          <div className="text-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-mustard mb-2">Learn</p>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/vidhi`}>Vidhi guide</a>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/calendar`}>Calendar 2025–30</a>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/songs`}>Folk archive</a>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/kids`}>Kids mode</a>
          </div>
          <div className="text-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-mustard mb-2">Community</p>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/ghats`}>Ghat finder</a>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/wall`}>Global wall</a>
            <a className="block py-0.5 hover:underline" href={`/${params.locale}/about`}>Contribute</a>
          </div>
          <div className="text-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-mustard mb-2">Note</p>
            <p className="text-cream/70">Sunrise/sunset via Open-Meteo, indicative. Confirm with local Panchang.</p>
          </div>
        </div>
        <div className="border-t border-cream/20 py-4 text-center text-xs text-cream/70">© 2026 ChhathMahaparv contributors • Jai Surya Dev • Jai Chhathi Maiya</div>
      </footer>
    </>
  );
}
