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

export function getCountdown(targetISO?: string, now = new Date(), targetTimeHHMM = "18:00") {
  // Sandhya and Usha Arghya happen at sunset/sunrise in India. Pin the target to IST
  // (+05:30) so a user in NJ/London/Dubai counts down to the same moment
  // instead of sunset/sunrise in their own local timezone.
  // Pass the real "HH:MM" when known (Arghya API); otherwise default
  // 18:00 (sunset) or 06:30 (sunrise) is used and the UI labels it.
  if (!targetISO) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isPassed: true
    };
  }
  const time = /^([01]\d|2[0-3]):[0-5]\d$/.test(targetTimeHHMM) ? targetTimeHHMM : "18:00";
  const diff = new Date(`${targetISO}T${time}:00+05:30`).getTime() - now.getTime();
  const s = Math.max(0, Math.floor(diff / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    totalSeconds: s,
    isPassed: diff <= 0
  };
}

export function getActiveArghyaCountdown(
  event: Pick<ChhathDates, "sandhyaArghya" | "ushaArghya">,
  now = new Date(),
  sandhyaHHMM = "18:00",
  ushaHHMM = "06:30"
) {
  const sandhyaTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(sandhyaHHMM) ? sandhyaHHMM : "18:00";
  const ushaTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(ushaHHMM) ? ushaHHMM : "06:30";

  const sandhyaMs = new Date(`${event.sandhyaArghya}T${sandhyaTime}:00+05:30`).getTime();
  const ushaMs = new Date(`${event.ushaArghya}T${ushaTime}:00+05:30`).getTime();
  const nowMs = now.getTime();

  const isSandhyaPassed = sandhyaMs <= nowMs;
  const isUshaPassed = ushaMs <= nowMs;

  const currentActive: "sandhya" | "usha" = isSandhyaPassed && !isUshaPassed ? "usha" : "sandhya";
  const activeTarget = currentActive === "usha" ? event.ushaArghya : event.sandhyaArghya;
  const activeTime = currentActive === "usha" ? ushaTime : sandhyaTime;

  return {
    currentActive,
    isSandhyaPassed,
    isUshaPassed,
    activeTarget,
    activeTime,
    sandhyaCountdown: getCountdown(event.sandhyaArghya, now, sandhyaTime),
    ushaCountdown: getCountdown(event.ushaArghya, now, ushaTime)
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
