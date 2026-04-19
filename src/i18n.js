import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import sq from "./locales/sq/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sq: { translation: sq },
    },
    // Auto-detect: sq, sq-AL, sq-XK → Albanian
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
    supportedLngs: ["en", "sq"],
    // Map sq-AL, sq-XK → sq
    load: "languageOnly",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
