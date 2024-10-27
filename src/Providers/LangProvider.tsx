import { PropsWithChildren, useEffect } from "react";

import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { LANGUAGES } from "@/Constants/common";

import store_en from "@/locales/en/store.json";
import node_en from "@/locales/en/node.json";

import store_vi from "@/locales/vi/store.json";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: LANGUAGES.EN,
    lng: LANGUAGES.EN, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    resources: {
      [LANGUAGES.EN]: {
        store: store_en,
        node: node_en,
      },
      [LANGUAGES.VI]: {
        store: store_vi,
      },
    },
  });

const LanguageProvider = ({ children }: PropsWithChildren) => {
  const lang = localStorage.getItem("lang") || LANGUAGES.EN;

  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [i18n, lang]);
  return <>{children}</>;
};

export default LanguageProvider;
