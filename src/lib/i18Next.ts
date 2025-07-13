// Supported languages in your app

import { getFixedT, TFunction } from "i18next";
import { loadConfig } from "./config";
import { Request } from "express";

let currentT: TFunction = getFixedT("en");

export function setGlobalT(t: TFunction) {
  currentT = t;
}

export function getGlobalT(): TFunction {
  return currentT;
}

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

export function resolveT(req: Request): TFunction {
  return req.t || getFixedT("en");
}
