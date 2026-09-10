export type SupportedLocale = "en" | "es" | "fr";

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;          // Native name (Endonym): "English", "Español", "Français"
  englishName: string;   // English descriptive name: "English (US / Global)", "Spanish (Dominicana / LatAm)", "French (Standard)"
  regionalBadge?: string; // Nuance: "Default", "Dominican AI", "Standard"
  dir: "ltr" | "rtl";
}

export interface CommonDictionary {
  nav: {
    home: string;
    learn: string;
    coach: string;
    teach: string;
    studio: string;
    insight: string;
    admin: string;
    docs: string;
    marketing: string;
    ecosystem: string;
    search: string;
    searchShortcut: string;
    profile: string;
    signOut: string;
    signIn: string;
    bookDemo: string;
    startLearning: string;
    quickPractice: string;
    newAsset: string;
    settings: string;
    menu: string;
    closeMenu: string;
    learnerSpace: string;
    educatorSpace: string;
    practiceSpace: string;
    creatorSpace: string;
    adminSpace: string;
  };
  actions: {
    save: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    back: string;
    continue: string;
    retry: string;
    close: string;
    viewAll: string;
    open: string;
    continueWithGoogle: string;
    orContinueWithEmail: string;
  };
  languages: {
    en: string;
    es: string;
    fr: string;
    interfaceLanguage: string;
    multiL1Engine: string;
    switchLanguage: string;
    selectorAriaLabel: string;
  };
  common: {
    welcome: string;
    loading: string;
    error: string;
    success: string;
    offline: string;
    online: string;
    status: string;
    allRightsReserved: string;
  };
  theme: {
    light: string;
    dark: string;
    switchToLight: string;
    switchToDark: string;
  };
}

export type LocaleDictionary = CommonDictionary;
