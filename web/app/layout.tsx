import "./globals.css";

export const metadata = {
  title: "ChhathMahaparv.org — Global Hub",
  description: "Dates, city-wise Arghya time, vidhi, ghats, songs for Chhath Mahaparv.",
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg" }
};

// NOTE: <html>/<body> are rendered by app/[locale]/layout.tsx so the
// lang attribute matches the active locale (en/hi/bho/mai/ne) for SSR.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
