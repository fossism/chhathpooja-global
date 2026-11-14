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

export function generateWhatsAppLink(listing: PrasadListing): string {
  if (!listing.phone) return "";
  let cleanNumber = listing.phone.replace(/[^0-9]/g, "");
  if (cleanNumber.length === 10) {
    cleanNumber = `91${cleanNumber}`;
  }
  const text = `Pranam! I saw the Chhath Prasad Seva point for ${listing.landmark}, ${listing.city}. I am nearby and would be grateful to know more about receiving Mahaprasad. Dhanyawad!`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
