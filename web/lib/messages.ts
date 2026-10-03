import fs from "fs";
import path from "path";
import { locales, defaultLocale } from "../i18n";

export function getMessages(locale: string) {
  // Whitelist: blocks path traversal like `../../etc/passwd` via locale param.
  const safe = (locales as readonly string[]).includes(locale) ? locale : defaultLocale;
  const p = path.join(process.cwd(), "..", "messages", `${safe}.json`);
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    const fb = path.join(process.cwd(), "..", "messages", `${defaultLocale}.json`);
    return JSON.parse(fs.readFileSync(fb, "utf8"));
  }
}
