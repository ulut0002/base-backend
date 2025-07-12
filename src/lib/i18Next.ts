// Supported languages in your app

import { loadConfig } from "./config";

export function parseAcceptLanguage(header: string | undefined): string {
  const config = loadConfig();
  if (!header) return "en";

  const locales = header
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase());

  for (const locale of locales) {
    const base = locale.split("-")[0]; // e.g., 'fr' from 'fr-CA'
    if (config.supportLanguages?.includes(base)) {
      return base;
    }
  }

  return "en"; // default fallback
}
