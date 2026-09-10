"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import type { SupportedLocale, LocaleInfo, LocaleDictionary } from "./types";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, LOCALE_STORAGE_KEY, getLocaleInfo, isSupportedLocale } from "./constants";
import { getDictionary } from "./locales";
import { interpolate } from "./interpolate";

export interface I18nContextValue {
  locale: SupportedLocale;
  localeInfo: LocaleInfo;
  dictionary: LocaleDictionary;
  setLocale: (nextLocale: SupportedLocale, options?: { refresh?: boolean }) => void;
  t: (path: string, values?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolveClientInitialLocale(initialLocale?: SupportedLocale): SupportedLocale {
  if (initialLocale && isSupportedLocale(initialLocale)) {
    return initialLocale;
  }
  if (typeof document !== "undefined") {
    // 1. Check cookie
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const cookie = cookies.find((c) => c.startsWith(`${LOCALE_COOKIE_NAME}=`));
    if (cookie) {
      const val = cookie.split("=")[1];
      if (isSupportedLocale(val)) return val;
    }
    // 2. Check localStorage
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored && isSupportedLocale(stored)) return stored;
    } catch {
      // ignore
    }
    // 3. Check navigator language
    if (typeof navigator !== "undefined" && navigator.language) {
      const prefix = navigator.language.split("-")[0].toLowerCase();
      if (isSupportedLocale(prefix)) return prefix;
    }
  }
  return DEFAULT_LOCALE;
}

export interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: SupportedLocale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() =>
    initialLocale && isSupportedLocale(initialLocale) ? initialLocale : resolveClientInitialLocale(initialLocale),
  );

  useEffect(() => {
    if (initialLocale && isSupportedLocale(initialLocale) && initialLocale !== locale) {
      setLocaleState(initialLocale);
    }
  }, [initialLocale]);

  const setLocale = useCallback(
    (nextLocale: SupportedLocale, options?: { refresh?: boolean }) => {
      if (!isSupportedLocale(nextLocale)) return;
      setLocaleState(nextLocale);

      // Persist to document.cookie (1 year, shared across lurexa.org subdomains in prod)
      if (typeof document !== "undefined") {
        const domain = window.location.hostname.endsWith("lurexa.org") ? "; domain=.lurexa.org" : "";
        document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax${domain}`;
        try {
          localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
        } catch {
          // ignore
        }
        document.documentElement.setAttribute("lang", nextLocale);
      }

      if (options?.refresh && typeof window !== "undefined") {
        window.location.reload();
      }
    },
    [],
  );

  const dictionary = useMemo(() => getDictionary(locale), [locale]);
  const localeInfo = useMemo(() => getLocaleInfo(locale), [locale]);

  const t = useCallback(
    (path: string, values?: Record<string, string | number>): string => {
      const parts = path.split(".");
      let current: any = dictionary;

      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = current[part];
        } else {
          // Fallback to English dictionary if key is missing
          let fallback: any = getDictionary("en");
          for (const fbPart of parts) {
            if (fallback && typeof fallback === "object" && fbPart in fallback) {
              fallback = fallback[fbPart];
            } else {
              fallback = null;
              break;
            }
          }
          if (typeof fallback === "string") {
            return interpolate(fallback, values);
          }
          return path;
        }
      }

      if (typeof current === "string") {
        return interpolate(current, values);
      }
      return path;
    },
    [dictionary],
  );

  const value = useMemo(
    () => ({
      locale,
      localeInfo,
      dictionary,
      setLocale,
      t,
    }),
    [locale, localeInfo, dictionary, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    // Return safe default if used outside Provider
    const fallbackLocale = DEFAULT_LOCALE;
    const fallbackDict = getDictionary(fallbackLocale);
    return {
      locale: fallbackLocale,
      localeInfo: getLocaleInfo(fallbackLocale),
      dictionary: fallbackDict,
      setLocale: () => {},
      t: (path: string, values?: Record<string, string | number>) => {
        const parts = path.split(".");
        let curr: any = fallbackDict;
        for (const p of parts) {
          if (curr && typeof curr === "object" && p in curr) {
            curr = curr[p];
          } else {
            return path;
          }
        }
        return typeof curr === "string" ? interpolate(curr, values) : path;
      },
    };
  }
  return context;
}

export function useTranslation() {
  const { t, locale, localeInfo, setLocale, dictionary } = useI18n();
  return { t, locale, localeInfo, setLocale, dictionary };
}

export function useLocale() {
  const { locale, localeInfo, setLocale } = useI18n();
  return { locale, localeInfo, setLocale };
}
