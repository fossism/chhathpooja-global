"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlayer } from "./MusicProvider";

const NAV_ITEMS = [
  {
    href: "calendar",
    label: "Calendar",
    hindi: "कैलेंडर",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    href: "vidhi",
    label: "Vidhi",
    hindi: "विधि",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    href: "ghats",
    label: "Ghats",
    hindi: "घाट खोज",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    href: "ask",
    label: "Ask",
    hindi: "सहायक",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    href: "wall",
    label: "Wall",
    hindi: "फोटो वॉल",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    href: "songs",
    label: "Songs",
    hindi: "लोकगीत",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    )
  },
  {
    href: "about",
    label: "About",
    hindi: "हमारे बारे में",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

const LOCALES = [
  { code: "en", label: "EN", name: "English" },
  { code: "hi", label: "हिं", name: "हिन्दी" },
  { code: "bho", label: "भो", name: "भोजपुरी" },
  { code: "mai", label: "मै", name: "मैथिली" },
  { code: "ne", label: "ने", name: "नेपाली" }
];

export default function Navbar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  let current = null;
  let playing = false;
  try {
    // Safe player access with fallback
    const player = usePlayer();
    current = player?.current ?? null;
    playing = player?.playing ?? false;
  } catch {
    // Rendered outside MusicProvider
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangMenuOpen(false);
  }, [pathname]);

  const isCurrentActive = (href: string) => {
    if (!pathname) return false;
    return pathname === `/${locale}/${href}` || pathname.startsWith(`/${locale}/${href}/`);
  };

  const getLocaleUrl = (targetLocale: string) => {
    if (!pathname) return `/${targetLocale}`;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && LOCALES.some((l) => l.code === segments[0])) {
      segments[0] = targetLocale;
      return `/${segments.join("/")}`;
    }
    return `/${targetLocale}`;
  };

  const currentLocaleObj = LOCALES.find((l) => l.code === locale) || LOCALES[0];

  return (
    <header className="sticky top-0 z-30 transition-all duration-300">
      {/* Top Festival Beacon Bar */}
      <div className="bg-gradient-to-r from-teal via-[#134e47] to-teal text-cream border-b border-teal/20 text-xs py-1.5 px-4 shadow-sm">
        <div className="shell flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mustard opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mustard" />
            </span>
            <span className="font-semibold tracking-wide truncate">
              Kartik Chhath Mahaparv • Nov 13–16, 2026 • Global
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] shrink-0">
            {current && playing && (
              <Link
                href={`/${locale}/songs`}
                className="hidden sm:inline-flex items-center gap-1.5 text-mustard hover:text-amber-300 font-bold transition"
              >
                <span className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-mustard animate-pulse" />
                  <span className="w-0.5 h-3 bg-mustard animate-pulse [animation-delay:150ms]" />
                  <span className="w-0.5 h-1.5 bg-mustard animate-pulse [animation-delay:300ms]" />
                </span>
                <span className="truncate max-w-[140px]">{current.title}</span>
              </Link>
            )}
            <Link
              href={`/${locale}/about`}
              className="font-bold text-cream/80 hover:text-mustard transition flex items-center gap-1"
            >
              <span>Contribute</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <div
        className={`transition-all duration-300 border-b border-line/80 ${
          scrolled
            ? "bg-cream/95 backdrop-blur-md shadow-md py-2.5"
            : "bg-cream/90 backdrop-blur-sm py-3"
        }`}
      >
        <div className="shell flex items-center justify-between gap-4">
          {/* Logo / Brand */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 group cursor-pointer shrink-0"
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300 ring-2 ring-mustard/40 bg-white p-0.5">
              <img src="/icon.svg" alt="Chhath Mahaparv" className="w-full h-full object-contain" />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold tracking-tight text-teal text-base sm:text-lg group-hover:text-mustard transition block">
                Chhath Mahaparv
              </span>
              <span className="block text-[11px] text-teal/65 font-medium">
                The Global Mahaparv
              </span>
            </div>
          </Link>

          {/* Desktop Floating Pill Dock */}
          <nav
            className="hidden lg:flex items-center gap-1 bg-white/80 p-1.5 rounded-full border border-line shadow-soft backdrop-blur-sm"
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => {
              const active = isCurrentActive(item.href);
              const isSongAndPlaying = item.href === "songs" && current && playing;

              return (
                <Link
                  key={item.href}
                  href={`/${locale}/${item.href}`}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition duration-200 ${
                    active
                      ? "bg-teal text-cream font-bold shadow-sm"
                      : "text-teal/70 hover:text-teal hover:bg-cream/80 font-medium"
                  }`}
                >
                  <span className={active ? "text-mustard" : "text-teal/60"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isSongAndPlaying && (
                    <span className="flex items-center gap-0.5 h-2.5 ml-0.5">
                      <span className="w-0.5 h-2 bg-mustard rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-0.5 h-2.5 bg-mustard rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-0.5 h-1.5 bg-mustard rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Section */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Language Switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setLangMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-line bg-white/90 text-teal hover:bg-cream transition shadow-xs"
                aria-expanded={langMenuOpen}
                aria-label="Select Language"
              >
                <span>🌐</span>
                <span>{currentLocaleObj.label}</span>
                <span className="text-[9px] text-teal/50">▼</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white border border-line shadow-card py-1.5 z-40 animate-fadeIn">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal/40">
                    Language
                  </div>
                  {LOCALES.map((l) => (
                    <Link
                      key={l.code}
                      href={getLocaleUrl(l.code)}
                      className={`flex items-center justify-between px-3 py-1.5 text-xs transition ${
                        locale === l.code
                          ? "bg-mustard/20 text-teal font-bold"
                          : "text-teal/80 hover:bg-cream"
                      }`}
                    >
                      <span>{l.name}</span>
                      <span className="text-[10px] font-mono text-teal/50">{l.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Primary Button */}
            <Link
              href={`/${locale}/vidhi`}
              className="btn btn-primary !py-2 !px-4 text-xs font-bold rounded-full shadow-sm hover:scale-105 active:scale-95 transition hidden sm:inline-flex items-center gap-1.5"
            >
              <span>🪔</span>
              <span>Start Vidhi</span>
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl border border-line bg-white/90 text-teal hover:bg-cream transition lg:hidden"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-line bg-white/95 backdrop-blur-xl px-4 py-4 animate-fadeIn shadow-lg mt-2.5">
            {/* Mobile Nav Links Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {NAV_ITEMS.map((item) => {
                const active = isCurrentActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={`/${locale}/${item.href}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border transition ${
                      active
                        ? "bg-teal text-cream border-teal shadow-sm font-bold"
                        : "bg-cream/40 border-line text-teal hover:bg-cream"
                    }`}
                  >
                    <span className={active ? "text-mustard" : "text-teal/70"}>
                      {item.icon}
                    </span>
                    <div>
                      <div className="text-xs font-bold leading-none">{item.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 leading-none ${
                          active ? "text-cream/70" : "text-teal/50"
                        }`}
                      >
                        {item.hindi}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Language Switcher Row */}
            <div className="pt-3 border-t border-line">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal/60 block mb-2">
                Select Language
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {LOCALES.map((l) => (
                  <Link
                    key={l.code}
                    href={getLocaleUrl(l.code)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                      locale === l.code
                        ? "bg-teal text-cream shadow-sm"
                        : "bg-cream border border-line text-teal/70 hover:text-teal"
                    }`}
                  >
                    {l.name} ({l.label})
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Quick CTA */}
            <div className="mt-4 pt-3 border-t border-line flex gap-2">
              <Link
                href={`/${locale}/vidhi`}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary flex-1 !py-2.5 text-xs font-bold rounded-xl text-center"
              >
                🪔 Start Vidhi Guide
              </Link>
              <Link
                href={`/${locale}/songs`}
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-accent flex-1 !py-2.5 text-xs font-bold rounded-xl text-center"
              >
                🎵 Chhath Geet
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
