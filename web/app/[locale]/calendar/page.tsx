import { getAllDates } from "../../../lib/chhath";
import CalendarClient from "../../../components/CalendarClient";

export default function Calendar({ params }: { params?: { locale?: string } }) {
  const dates = getAllDates();
  const locale = params?.locale || "en";

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CalendarClient events={dates} locale={locale} />
    </div>
  );
}
