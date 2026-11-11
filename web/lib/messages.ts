import en from "../../messages/en.json";
import hi from "../../messages/hi.json";
import bho from "../../messages/bho.json";
import mai from "../../messages/mai.json";
import ne from "../../messages/ne.json";

const MESSAGES: Record<string, any> = {
  en,
  hi,
  bho,
  mai,
  ne
};

export function getMessages(locale: string) {
  return MESSAGES[locale] ?? MESSAGES.en;
}
