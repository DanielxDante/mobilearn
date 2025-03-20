import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
import * as Localization from "expo-localization";
import en from "../locales/en.json";
import cn from "../locales/cn.json";

const deviceLanguage = Localization.getLocales()[0].languageCode ?? "en";

const getLanguageResource = (languageCode: string): string => {
  if (languageCode === "zh") return "cn";
  return "en";
}

i18n
  // .use(LanguageDetector) // Detect browser language
  .use(initReactI18next) // Bind react-i18next
  .init({
    debug: true,
    fallbackLng: "en", // Default language
    lng: getLanguageResource(deviceLanguage), // Initially set to English
    resources: {
      en: { translation: en },
      cn: { translation: cn },
    },
    interpolation: {
      escapeValue: false, // Not needed for React
    },
  });

export default i18n;
