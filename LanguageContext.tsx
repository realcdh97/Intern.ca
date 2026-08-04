import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language, TranslationKey } from "@/translations/dictionary";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    if (saved === "en" || saved === "fr") return saved;
    
    // Fallback to browser language if it is French, else default to English
    const browserLang = navigator.language.split("-")[0];
    return browserLang === "fr" ? "fr" : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
