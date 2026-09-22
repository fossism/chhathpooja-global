import "./globals.css";

export const metadata = {
  title: "ChhathMahaparv.org — Global Hub",
  description: "Dates, city-wise Arghya time, vidhi, ghats, songs for Chhath Mahaparv.",
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
