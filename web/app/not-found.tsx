import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-cream min-h-screen flex items-center justify-center p-4">
        <div className="card text-center py-12 max-w-md w-full shadow-lg border-line">
          <h1 className="section-title text-2xl font-bold text-teal">This ghat doesn't exist.</h1>
          <p className="section-sub text-teal/70 mt-2">404 — let's head back home.</p>
          <Link href="/en" className="btn btn-primary mt-6 inline-block font-bold">
            Back Home →
          </Link>
        </div>
      </body>
    </html>
  );
}
