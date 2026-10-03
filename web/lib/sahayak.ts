import dates from "../../data/chhath-dates-2025-2035.json";
import ghats from "../../data/ghats.json";
import songs from "../../data/songs.json";
import samagri from "../../data/samagri.json";
import { getNextChhath } from "./chhath";
import { sunsetAzimuth } from "./sun";

export type Answer = { text: string; sources: string[]; followUp: string[] };

// Offline Chhath Sahayak: keyword intents over bundled open data.
// No API key, works offline, never invents dates/rules.
// (Upgrade path: same intents become RAG retrieval queries for an LLM later.)
export function askSahayak(raw: string): Answer {
  const q = raw.toLowerCase();
  const has = (...ws: string[]) => ws.some((w) => q.includes(w));

  if (has("sandhya", "sunset", "saanjh", "saanjh", "sanjh", "aragh", "arghya", "surya ast", "sun set")) {
    const n = getNextChhath();
    return {
      text: `Sandhya Arghya is the sunset offering — ${n.sandhyaArghya} next time. Reach the ghat 1 hr early with soop + daura, face the setting sun, offer water as it touches the horizon. Exact sunset for your city: use the Arghya finder on the home page.`,
      sources: [`dates ${n.sandhyaArghya}`, "vidhi day 3"],
      followUp: ["What samagri for Sandhya Arghya?", "Which way do I face?", "Kharna me kya hota hai?"]
    };
  }
  if (has("face", "direction", "which way", "west", "compass", "dis")) {
    const n = getNextChhath();
    const { azimuth, label } = sunsetAzimuth(25.5941, n.sandhyaArghya);
    return {
      text: `Face the setting sun — about ${azimuth}° (${label}) from Patna on ${n.sandhyaArghya}, i.e. slightly south of due west in Kartik. Your exact degrees shift with latitude; check the compass on the Arghya finder result. Align with your phone compass for exact pointing.`,
      sources: ["solar math ±2°", `dates ${n.sandhyaArghya}`],
      followUp: ["What is Sandhya Arghya time?", "What samagri for Sandhya Arghya?"]
    };
  }
  if (has("usha", "sunrise", "bhor", "morning", "paran", "parana")) {
    const n = getNextChhath();
    return {
      text: `Usha Arghya is the sunrise offering — ${n.ushaArghya} next time. Reach before sunrise, offer arghya as the sun rises, then break the fast (parana) and share prasad with everyone.`,
      sources: [`dates ${n.ushaArghya}`, "vidhi day 4"],
      followUp: ["What is Sandhya Arghya time?", "Thekua recipe?"]
    };
  }
  if (has("kharna", "kheer", "roti")) {
    return {
      text: `Kharna (day 2): fast all day, cook kheer + roti on an earthen chulha in the evening, offer to Chhathi Maiya, eat once as prasad — then the ~36 hr nirjala vrat begins. Needs: earthen chulha, prasad vessels, diya + incense.`,
      sources: ["vidhi day 2", "samagri kharna"],
      followUp: ["What samagri for Sandhya Arghya?", "When is next Chhath?"]
    };
  }
  if (has("nahay", "nahay-khay", "nhay", "day 1", "first day")) {
    return {
      text: `Nahay-Khay (day 1): clean the home + path to ghat, take a holy bath, wear fresh clothes, offer to Surya first, then eat one simple sattvik meal. Rest early — the vrata begins.`,
      sources: ["vidhi day 1", "samagri nahayKhay"],
      followUp: ["Kharna me kya hota hai?", "What samagri do I need?"]
    };
  }
  if (has("samagri", "soop", "daura", "thekua", "coconut", "sugarcane", "nariyal", "ganna", "diya", "sindoor", "list", "saman")) {
    const s = samagri as Record<string, string[]>;
    return {
      text: `Samagri — Nahay-Khay: ${s.nahayKhay.join(", ")}. Kharna: ${s.kharna.join(", ")}. Sandhya: ${s.sandhyaArghya.join(", ")}. Usha: ${s.ushaArghya.join(", ")}. Thekua (wheat flour + jaggery + ghee) is the classic prasad.`,
      sources: ["samagri.json"],
      followUp: ["Kharna me kya hota hai?", "Which song for Sandhya Arghya?"]
    };
  }
  if (has("song", "geet", "lyric", "kelwa", "uga ho", "kosi", "chhathi maiya", "music", "gaana")) {
    const list = (songs as any[]).map((x) => `${x.title} (${x.titleDevanagari}) — ${x.meaning_en}`).join(" | ");
    return {
      text: `Folk archive (${(songs as any[]).length} songs): ${list} Open the Songs page and press Listen on any card to hear it read aloud.`,
      sources: ["songs.json"],
      followUp: ["What samagri do I need?", "When is next Chhath?"]
    };
  }
  if (has("ghat", "where", "patna", "delhi", "mumbai", "kolkata", "janakpur", "kathmandu", "edison", "london", "dubai", "pond", "river", "place")) {
    const cities = Array.from(new Set((ghats as any[]).map((g) => `${g.city} (${g.country})`))).slice(0, 8).join(", ");
    return {
      text: `${(ghats as any[]).length} ghats mapped so far, including ${cities}. Open Ghat finder for the map, facilities (parking, lighting, first aid) and to submit your own spot for review.`,
      sources: ["ghats.json"],
      followUp: ["What is Sandhya Arghya time?", "What samagri do I need?"]
    };
  }
  if (has("kab", "when", "date", "tarikh", "tithi", "next", "2025", "2026", "2027", "calendar", "chaiti", "kartik", "karthik")) {
    const n = getNextChhath();
    const all = (dates as any[]).map((d) => `${d.year} ${d.type}: ${d.nahayKhay}→${d.ushaArghya}`).join("; ");
    return {
      text: `Next Chhath: Nahay-Khay ${n.nahayKhay}, Kharna ${n.kharna}, Sandhya ${n.sandhyaArghya}, Usha ${n.ushaArghya} (${n.source}). Full verified calendar: ${all}.`,
      sources: ["chhath-dates-2025-2035.json (DrikPanchang)"],
      followUp: ["Kharna me kya hota hai?", "What samagri do I need?"]
    };
  }
  if (has("vrat", "fast", "niyam", "rule", "period", "pregnant", "diabet", "who can", "kaun")) {
    return {
      text: `The vrat is strict: 4 days of cleanliness, then ~36 hr nirjala (no water) from Kharna night to Usha morning. Who may observe, and exceptions for health/pregnancy/periods, differ by family tradition — I don't give rulings. Please ask your family's elders or pandit, and anyone with a health condition should ask a doctor first.`,
      sources: ["vidhi guide + family tradition (no single rule)"],
      followUp: ["Kharna me kya hota hai?", "When is next Chhath?"]
    };
  }
  if (has("namaste", "hello", "hi", "hey", "pranam", "jai")) {
    return {
      text: `Jai Chhathi Maiya! I am the offline Chhath Sahayak — ask me dates, vidhi steps, samagri, songs, ghats or arghya direction. Try: "When is next Chhath?"`,
      sources: ["bundled open data"],
      followUp: ["When is next Chhath?", "What samagri do I need?", "Which song for Sandhya Arghya?"]
    };
  }
  return {
    text: `I answer from bundled open data: dates, 4-day vidhi, samagri, songs, ghats, arghya direction. Try one: "When is next Chhath?", "Kharna me kya hota hai?", "What samagri do I need?", "Which song for Sandhya Arghya?", "Where are ghats near me?"`,
    sources: ["help"],
    followUp: ["When is next Chhath?", "Kharna me kya hota hai?", "What samagri do I need?"]
  };
}
