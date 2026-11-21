import seedData from "../../data/prasad-listings.json";

export type PrasadCategory =
  | "all"
  | "armed-forces"
  | "metro-tech"
  | "students"
  | "industrial"
  | "bihar-jharkhand"
  | "diaspora";

export interface PrasadListing {
  id: string;
  type: "offer" | "request";
  hubName: string;
  category: PrasadCategory;
  city: string;
  area: string;
  landmark: string;
  targetAudience: string;
  prasadItems: string[];
  pickupMode: string;
  quantityNote: string;
  availableFrom: string;
  contactType: "walkin" | "whatsapp" | "telegram";
  phone?: string;
  telegram?: string;
  notes: string;
  verified?: boolean;
  createdAt: string;
  isUserCreated?: boolean;
}

export function getInitialPrasadListings(): PrasadListing[] {
  return seedData as PrasadListing[];
}

export function isValidPhoneNumber(phone?: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[^0-9]/g, "");
  // Must be 10 to 15 digits (E.164 standard) and not all repeating identical digits
  if (clean.length < 10 || clean.length > 15) return false;
  if (/^(\d)\1+$/.test(clean)) return false;
  return true;
}

export function isValidTelegramHandle(handle?: string): boolean {
  if (!handle) return false;
  const clean = handle.replace(/^@/, "").trim();
  return /^[a-zA-Z0-9_]{4,32}$/.test(clean);
}

const PRASAD_CATEGORIES: readonly PrasadCategory[] = [
  "armed-forces",
  "metro-tech",
  "students",
  "industrial",
  "bihar-jharkhand",
  "diaspora"
];

function text(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/**
 * Validates listings loaded from localStorage. Stored JSON is untrusted:
 * another script on the origin (or a user) can modify it, and malformed
 * entries previously crashed `.join()`/`.some()` calls.
 */
export function normalizePrasadListings(value: unknown, max = 50): PrasadListing[] {
  if (!Array.isArray(value)) return [];
  const out: PrasadListing[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const v = item as Record<string, unknown>;

    const type = v.type === "offer" || v.type === "request" ? v.type : null;
    const category = PRASAD_CATEGORIES.includes(v.category as PrasadCategory)
      ? (v.category as PrasadCategory)
      : null;
    const contactType =
      v.contactType === "walkin" || v.contactType === "whatsapp" || v.contactType === "telegram"
        ? v.contactType
        : "walkin";

    const id = text(v.id, 120);
    const hubName = text(v.hubName, 120);
    const city = text(v.city, 80);
    const area = text(v.area, 120);
    const landmark = text(v.landmark, 160);
    const prasadItems = Array.isArray(v.prasadItems)
      ? v.prasadItems
          .filter((x): x is string => typeof x === "string")
          .map((x) => text(x, 80))
          .filter(Boolean)
          .slice(0, 20)
      : [];

    if (!type || !category || !id || !hubName || !city || !area || !landmark || prasadItems.length === 0) {
      continue;
    }

    const phone =
      typeof v.phone === "string" && isValidPhoneNumber(v.phone)
        ? text(v.phone, 20)
        : undefined;
    const telegram =
      typeof v.telegram === "string" && isValidTelegramHandle(v.telegram)
        ? text(v.telegram.replace(/^@/, ""), 32)
        : undefined;
    const createdAt =
      typeof v.createdAt === "string" && !Number.isNaN(Date.parse(v.createdAt))
        ? new Date(v.createdAt).toISOString()
        : new Date().toISOString();

    out.push({
      id,
      type,
      hubName,
      category,
      city,
      area,
      landmark,
      targetAudience: text(v.targetAudience, 300),
      prasadItems,
      pickupMode: text(v.pickupMode, 120),
      quantityNote: text(v.quantityNote, 200),
      availableFrom: text(v.availableFrom, 200),
      contactType,
      phone,
      telegram,
      notes: text(v.notes, 500),
      verified: v.verified === true,
      createdAt,
      isUserCreated: v.isUserCreated === true
    });

    if (out.length >= max) break;
  }

  return out;
}

/**
 * Contact details are intentionally not written to localStorage. They stay in
 * React state for the current tab only, so a shared/public device does not
 * retain a devotee's phone number indefinitely.
 */
export function listingForStorage(listing: PrasadListing): PrasadListing {
  const copy: PrasadListing = { ...listing, contactType: "walkin" };
  delete copy.phone;
  delete copy.telegram;
  return copy;
}

export function generateWhatsAppLink(listing: PrasadListing): string {
  if (!listing.phone || !isValidPhoneNumber(listing.phone)) return "";
  let cleanNumber = listing.phone.replace(/[^0-9]/g, "");
  if (cleanNumber.length === 10) {
    cleanNumber = `91${cleanNumber}`;
  }
  const text = `Pranam! I saw the Chhath Prasad Seva point for ${listing.landmark}, ${listing.city}. I am nearby and would be grateful to know more about receiving Mahaprasad. Dhanyawad!`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function generateTelegramLink(listing: PrasadListing): string {
  if (!listing.telegram || !isValidTelegramHandle(listing.telegram)) return "";
  const handle = listing.telegram.replace(/^@/, "").trim();
  return `https://t.me/${handle}`;
}
