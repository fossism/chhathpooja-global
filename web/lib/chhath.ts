import dates from "../../data/chhath-dates-2025-2035.json";
import ghats from "../../data/ghats.json";

export type ChhathDates = {
  year: number; type: string; nahayKhay: string; kharna: string;
  sandhyaArghya: string; ushaArghya: string; source: string;
};

export function getAllDates(): ChhathDates[] {
  return dates as ChhathDates[];
}

export function getNextChhath(now = new Date()): ChhathDates {
  const sorted = getAllDates().sort((a, b) => a.sandhyaArghya.localeCompare(b.sandhyaArghya));
  for (const d of sorted) {
    if (new Date(d.ushaArghya + "T23:59:59") >= now) return d;
  }
  return sorted[sorted.length - 1];
}

export function getCountdown(targetISO: string, now = new Date()) {
  const diff = new Date(targetISO + "T18:00:00").getTime() - now.getTime();
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
  return ghats as Ghat[];
}
