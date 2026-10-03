"use client";

export type IcsEvent = { year: number; type: string; nahayKhay: string; kharna: string; sandhyaArghya: string; ushaArghya: string };

function icsDate(d: string): string {
  return d.replace(/-/g, "");
}

function buildIcs(events: IcsEvent[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ChhathMahaparv//FESTIVAL//EN",
    "CALSCALE:GREGORIAN"
  ];
  for (const e of events) {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    lines.push(
      "BEGIN:VEVENT",
      `UID:sandhya-${e.year}-${e.type}@chhathmahaparv.org`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(e.sandhyaArghya)}`,
      `DTEND;VALUE=DATE:${icsDate(e.sandhyaArghya)}`,
      `SUMMARY:Chhath Sandhya Arghya ${e.year} (${e.type})`,
      "DESCRIPTION:Sunset offering with soop-daura. Confirm exact time with local Panchang.",
      "END:VEVENT",
      "BEGIN:VEVENT",
      `UID:usha-${e.year}-${e.type}@chhathmahaparv.org`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(e.ushaArghya)}`,
      `DTEND;VALUE=DATE:${icsDate(e.ushaArghya)}`,
      `SUMMARY:Chhath Usha Arghya + Parana ${e.year} (${e.type})`,
      "DESCRIPTION:Sunrise offering, then parana. Confirm exact time with local Panchang.",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export default function IcsButton({ events, label }: { events: IcsEvent[]; label: string }) {
  function download() {
    const blob = new Blob([buildIcs(events)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = events.length === 1 ? `chhath-${events[0].year}-${events[0].type}.ics` : "chhath-2025-2030.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
  return (
    <button onClick={download} className="btn btn-ghost !py-1.5 !px-4 text-xs">
      📅 {label}
    </button>
  );
}
