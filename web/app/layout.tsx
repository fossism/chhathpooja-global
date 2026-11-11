import "./globals.css";

export const metadata = {
  title: "ChhathMahaparv — Keeping Chhath alive, anywhere on earth",
  description: "Dates, city-wise Arghya time, vidhi, ghats, songs for Chhath Mahaparv.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" }
    ],
    shortcut: "/icon.svg",
    apple: "/icon-192.png"
  }
};

// NOTE: <html>/<body> are rendered by app/[locale]/layout.tsx so the
// lang attribute matches the active locale (en/hi/bho/mai/ne) for SSR.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
