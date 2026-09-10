export type SupportedLocale = "en" | "es" | "fr";

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;          // Native name (Endonym): "English", "Español", "Français"
  englishName: string;   // English descriptive name: "English (US / Global)", "Spanish (Dominicana / LatAm)", "French (Standard)"
  regionalBadge?: string; // Nuance: "Default", "Dominican AI", "Standard"
  flag?: string;         // Flag emoji: "🇺🇸", "🇩🇴", "🇫🇷"
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
    dashboard: string;
    learning: string;
    growthPlan: string;
    evidence: string;
    community: string;
    assessment: string;
    credentials: string;
    speakingStudio: string;
    pronunciation: string;
    history: string;
    educators: string;
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
  landing: {
    nav: {
      whyLurexa: string;
      learners: string;
      educators: string;
      institutions: string;
      pricing: string;
      architecture: string;
      ecosystem: string;
      bookDemo: string;
      startLearning: string;
    };
    hero: {
      kicker: string;
      titleBefore: string;
      titleHighlight: string;
      subtitle: string;
      whyLurexaCta: string;
      pricingCta: string;
      microcopy: string;
      orbitLearn: string;
      orbitConnect: string;
      orbitGrow: string;
    };
    trustBar: {
      step1Num: string;
      step1Title: string;
      step1Desc: string;
      step2Num: string;
      step2Title: string;
      step2Desc: string;
      step3Num: string;
      step3Title: string;
      step3Desc: string;
    };
    whyLurexa: {
      kicker: string;
      headingBefore: string;
      headingHighlight: string;
      lead: string;
      card1Title: string;
      card1Desc: string;
      card2Title: string;
      card2Desc: string;
      card3Title: string;
      card3Desc: string;
      card4Title: string;
      card4Desc: string;
      bannerHeading: string;
      bannerDesc: string;
      bannerCta: string;
    };
    pricing: {
      kicker: string;
      headingBefore: string;
      headingHighlight: string;
      lead: string;
      tabIndividual: string;
      tabInstitutional: string;
      starterBadge: string;
      starterTitle: string;
      starterPrice: string;
      starterPeriod: string;
      starterDesc: string;
      starterF1: string;
      starterF2: string;
      starterF3: string;
      starterF4: string;
      starterCta: string;
      proBadge: string;
      proTitle: string;
      proPrice: string;
      proPeriod: string;
      proDesc: string;
      proF1: string;
      proF2: string;
      proF3: string;
      proF4: string;
      proF5: string;
      proCta: string;
      dualBadge: string;
      dualTitle: string;
      dualPrice: string;
      dualPeriod: string;
      dualDesc: string;
      dualF1: string;
      dualF2: string;
      dualF3: string;
      dualF4: string;
      dualF5: string;
      dualCta: string;
      instBadge: string;
      instTitle: string;
      instPrice: string;
      instDesc: string;
      instF1: string;
      instF2: string;
      instF3: string;
      instF4: string;
      instF5: string;
      instCta: string;
      enterpriseBadge: string;
      enterpriseTitle: string;
      enterprisePrice: string;
      enterpriseDesc: string;
      enterpriseF1: string;
      enterpriseF2: string;
      enterpriseF3: string;
      enterpriseF4: string;
      enterpriseF5: string;
      enterpriseCta: string;
    };
    sidebar: {
      productsTitle: string;
      navTitle: string;
      plansTitle: string;
      launchWorkspace: string;
    };
  };
  learn: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    subtitle: string;
    startFree: string;
    educatorCta: string;
    microcopy: string;
    proof1Tag: string;
    proof1Title: string;
    proof1Desc: string;
    proof2Tag: string;
    proof2Title: string;
    proof2Desc: string;
    proof3Tag: string;
    proof3Title: string;
    proof3Desc: string;
  };
  coach: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    subtitle: string;
    startFree: string;
    explorePacks: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
  };
  teach: {
    eyebrow: string;
    title: string;
    subtitle: string;
    startPath: string;
    exploreLearning: string;
    microcopy: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar4Title: string;
    pillar4Desc: string;
  };
  admin: {
    navTelemetry: string;
    navRostering: string;
    navSecurity: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    openConsole: string;
    adminConsole: string;
  };
  docs: {
    navArchitecture: string;
    navProduct: string;
    navCurriculum: string;
    navEngineering: string;
    navGovernance: string;
    navDesign: string;
    searchDocs: string;
  };
}

export type LocaleDictionary = CommonDictionary;
