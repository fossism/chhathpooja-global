import fs from "fs";
import path from "path";

export function getMessages(locale: string) {
  const p = path.join(process.cwd(), "..", "messages", `${locale}.json`);
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    const fb = path.join(process.cwd(), "..", "messages", "en.json");
    return JSON.parse(fs.readFileSync(fb, "utf8"));
  }
}
