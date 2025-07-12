import i18next from "i18next";
import Backend from "i18next-fs-backend";
import i18nextMiddleware from "i18next-express-middleware";
import path from "path";

export async function initializeI18n(): Promise<void> {
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
        loadPath: path.join(__dirname, "locales/{{lng}}/translation.json"),
      },
      detection: {
        order: ["querystring", "cookie", "header"],
        lookupQuerystring: "lng",
        lookupCookie: "lang",
        caches: false,
      },
    });
}

export const i18nMiddleware = i18nextMiddleware.handle(i18next);
