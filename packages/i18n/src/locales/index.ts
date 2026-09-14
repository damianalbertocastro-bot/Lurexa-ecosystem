import type { SupportedLocale, LocaleDictionary } from "../types";
import { enCommon } from "./en/common";
import { esCommon } from "./es/common";
import { frCommon } from "./fr/common";

export const dictionaries: Record<SupportedLocale, LocaleDictionary> = {
  en: enCommon,
  es: esCommon,
  fr: frCommon,
};

export function getDictionary(locale: SupportedLocale): LocaleDictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

export { enCommon, esCommon, frCommon };
