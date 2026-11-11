import catalog from "../../data/samagri-catalog.json";

export interface SamagriItem {
  id: string;
  name: string;
  hindi: string;
  bhojpuri: string;
  category: string;
  daysUsed: string[];
  image: string;
  significance: string;
  howToUse: string;
  beginnerHack: string;
}

export function getSamagriCatalog(): SamagriItem[] {
  return catalog as SamagriItem[];
}
