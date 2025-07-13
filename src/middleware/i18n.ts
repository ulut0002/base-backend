import i18next from "i18next";
import Backend from "i18next-fs-backend";
import i18nextMiddleware from "i18next-express-middleware";
import path from "path";
import { NextFunction, Request, Response } from "express";
import { setGlobalT } from "../lib";

export async function initializeI18n(): Promise<void> {
  try {
    await i18next
      .use(Backend)
      .use(i18nextMiddleware.LanguageDetector)
      .init({
        fallbackLng: "en",
        preload: ["en", "tr"],
        ns: ["translation"],
        defaultNS: "translation",
        interpolation: {
          escapeValue: false,
        },
        backend: {
          loadPath: path.join(
            __dirname,
            "../src/locales/{{lng}}/translation.json"
          ),
        },
        debug: false,
        detection: {
          order: ["querystring", "cookie", "header"],
          lookupQuerystring: "lng",
          lookupCookie: "lang",
          caches: false,
        },
      });
    console.log("i18next initialized successfully");
  } catch (error) {
    console.error("Failed to initialize i18next", error);
    throw error;
  }
}

export function attachGlobalT(req: Request, res: Response, next: NextFunction) {
  if (req.t) {
    setGlobalT(req.t);
  }
  next();
}

export const i18nMiddleware = i18nextMiddleware.handle(i18next);
