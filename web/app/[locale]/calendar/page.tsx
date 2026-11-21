import { headers } from "next/headers";
import { getAllDates } from "../../../lib/chhath";
import CalendarClient from "../../../components/CalendarClient";
import { locales } from "../../../i18n";

export default async function Calendar({ params }: { params: Promise<{ locale: string }> }) {
  const dates = getAllDates();
  const { locale: rawLocale } = await params;
  const locale = (locales as readonly string[]).includes(rawLocale) ? rawLocale : "en";
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  // Structured data: search engines + assistants can read festival dates directly.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": dates.map((d) => ({
      "@type": "Festival",
      name: `Chhath Mahaparv ${d.year} (${d.type})`,
      startDate: d.nahayKhay,
      endDate: d.ushaArghya,
      description: `Nahay-Khay ${d.nahayKhay}, Kharna ${d.kharna}, Sandhya Arghya ${d.sandhyaArghya}, Usha Arghya ${d.ushaArghya}. Source: ${d.source}.`,
      inLanguage: ["en", "hi", "bho", "mai", "ne"]
    }))
  };

  return (
    <div className="shell py-8 md:py-12">
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <CalendarClient events={dates} locale={locale} />
    </div>
  );
}
