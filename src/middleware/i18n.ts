import i18next from "i18next";
import i18nextMiddleware from "i18next-express-middleware";
import Backend from "i18next-fs-backend";
import path from "path";

// -------------------------
// Internationalization (i18n) Middleware
// -------------------------
//
// This middleware enables multi-language support using `i18next`
// and `i18next-express-middleware`. It loads translation files
// from `src/locales/{{lng}}/translation.json` and adds `req.t()`
// to each request for localized strings.
//
// Folder structure:
//   src/locales/en/translation.json
//   src/locales/tr/translation.json
//
// Usage in routes:
//   res.send(req.t("greeting"));
//   res.send(req.t("user.welcome", { name: "John" }));
//
// Language detection sources (priority order):
//   - Query parameter: /route?lng=tr
//   - Cookie: lang=tr
//   - Accept-Language header
//
// Note: The languages listed in `preload` must match the subfolders in `locales/`

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "tr"],
    backend: {
      loadPath: path.join(__dirname, "../locales/{{lng}}/translation.json"),
    },
  });

const i18nMiddleware = i18nextMiddleware.handle(i18next);

export { i18nMiddleware };
