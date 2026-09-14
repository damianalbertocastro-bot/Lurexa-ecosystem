import type { SupportedLocale, LocaleInfo } from "./types";

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const LOCALE_COOKIE_NAME = "lx_locale";
export const LOCALE_STORAGE_KEY = "lurexa-locale";

export const SUPPORTED_LOCALES: readonly LocaleInfo[] = [
  {
    code: "en",
    name: "English",
    englishName: "English (US / Global)",
    regionalBadge: "Default",
    flag: "🇺🇸",
    dir: "ltr",
  },
  {
    code: "es",
    name: "Español",
    englishName: "Spanish (Dominicana / LatAm)",
    regionalBadge: "Dominican AI",
    flag: "🇩🇴",
    dir: "ltr",
  },
  {
    code: "fr",
    name: "Français",
    englishName: "French (Standard)",
    regionalBadge: "Standard",
    flag: "🇫🇷",
    dir: "ltr",
  },
] as const;

export const SUPPORTED_LOCALE_CODES: readonly SupportedLocale[] = ["en", "es", "fr"] as const;

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return typeof value === "string" && SUPPORTED_LOCALE_CODES.includes(value as SupportedLocale);
}

export function getLocaleInfo(code: SupportedLocale): LocaleInfo {
  const found = SUPPORTED_LOCALES.find((l) => l.code === code);
  return found ?? SUPPORTED_LOCALES[0];
}
