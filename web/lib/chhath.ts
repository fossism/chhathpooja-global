import dates from "../../data/chhath-dates-2025-2035.json";
import ghats from "../../data/ghats.json";

export type ChhathDates = {
  year: number; type: string; nahayKhay: string; kharna: string;
  sandhyaArghya: string; ushaArghya: string; source: string;
};

export function getAllDates(): ChhathDates[] {
  // Return a copy so callers can sort/filter without mutating module state.
  return [...(dates as ChhathDates[])];
}

export function getNextChhath(now = new Date()): ChhathDates {
  const sorted = getAllDates().sort((a, b) => a.sandhyaArghya.localeCompare(b.sandhyaArghya));
  for (const d of sorted) {
    if (new Date(d.ushaArghya + "T23:59:59") >= now) return d;
  }
  return sorted[sorted.length - 1];
}

export function getCountdown(targetISO: string, now = new Date(), sunsetHHMM = "18:00") {
  // Sandhya Arghya happens at ~sunset in India. Pin the target to IST
  // (+05:30) so a user in NJ/London/Dubai counts down to the same moment
  // instead of sunset in their own local timezone.
  // Pass the real sunset "HH:MM" when known (Arghya API); otherwise the
  // 18:00 estimate is used and the UI must label it as estimate.
  const time = /^([01]\d|2[0-3]):[0-5]\d$/.test(sunsetHHMM) ? sunsetHHMM : "18:00";
  const diff = new Date(`${targetISO}T${time}:00+05:30`).getTime() - now.getTime();
  const s = Math.max(0, Math.floor(diff / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60
  };
}

export type Ghat = {
  id: string; name: string; city: string; country: string;
  lat: number; lng: number; riverOrPond: string;
  facilities: { parking: boolean; lighting: boolean; policeHelp: boolean; firstAid: boolean; drinkingWater: boolean; };
  verified: boolean;
};

export function getGhats(): Ghat[] {
  return [...(ghats as Ghat[])];
}
