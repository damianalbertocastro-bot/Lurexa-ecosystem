import type { SupportedLocale, LocaleDictionary } from "./types";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, isSupportedLocale } from "./constants";
import { getDictionary } from "./locales";
import { interpolate } from "./interpolate";

export function resolveServerLocale(
  cookieHeaderOrStore?: { get: (name: string) => { value: string } | undefined } | string | null,
): SupportedLocale {
  if (!cookieHeaderOrStore) return DEFAULT_LOCALE;

  // 1. If it's a Next.js ReadonlyRequestCookies store with .get()
  if (typeof cookieHeaderOrStore === "object" && "get" in cookieHeaderOrStore) {
    const cookie = cookieHeaderOrStore.get(LOCALE_COOKIE_NAME);
    if (cookie?.value && isSupportedLocale(cookie.value)) {
      return cookie.value;
    }
    return DEFAULT_LOCALE;
  }

  // 2. If it's a raw cookie header string
  if (typeof cookieHeaderOrStore === "string") {
    const parts = cookieHeaderOrStore.split(";").map((c) => c.trim());
    const match = parts.find((p) => p.startsWith(`${LOCALE_COOKIE_NAME}=`));
    if (match) {
      const val = match.split("=")[1];
      if (isSupportedLocale(val)) return val;
    }
  }

  return DEFAULT_LOCALE;
}

export function getServerDictionary(locale: SupportedLocale = DEFAULT_LOCALE): LocaleDictionary {
  return getDictionary(locale);
}

export function tServer(
  locale: SupportedLocale,
  path: string,
  values?: Record<string, string | number>,
): string {
  const dict = getDictionary(locale);
  const parts = path.split(".");
  let current: any = dict;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
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
}
