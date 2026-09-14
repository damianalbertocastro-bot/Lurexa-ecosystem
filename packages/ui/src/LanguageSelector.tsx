"use client";

import React, { useState, useRef, useEffect, useCallback, type HTMLAttributes } from "react";
import {
  useLocale,
  useTranslation,
  SUPPORTED_LOCALES,
  type SupportedLocale,
  type LocaleInfo,
} from "@lurexa/i18n";

export interface LanguageSelectorProps extends HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right";
  inverse?: boolean;
  variant?: "standalone" | "segmented" | "pill";
  compact?: boolean;
  refresh?: boolean;
  onLocaleChange?: (locale: SupportedLocale) => void;
  className?: string;
}

export function LanguageSelector({
  align = "right",
  inverse = false,
  variant = "standalone",
  compact = false,
  refresh = true,
  onLocaleChange,
  className = "",
  ...props
}: LanguageSelectorProps) {
  const { locale, localeInfo, setLocale } = useLocale();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = useCallback(
    (code: SupportedLocale) => {
      setIsOpen(false);
      setLocale(code, { refresh });
      if (onLocaleChange) {
        onLocaleChange(code);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("lurexa-locale-change", { detail: { locale: code } }));
      }
    },
    [setLocale, onLocaleChange, refresh],
  );

  // Determine button styling based on variant & theme with fixed, jitter-free dimensions
  const segDim = compact ? "h-8 w-[76px] min-w-[76px] max-w-[76px]" : "h-9 w-[80px] min-w-[80px] max-w-[80px]";
  const standDim = compact ? "h-9 w-[82px] min-w-[82px] max-w-[82px]" : "h-10 w-[86px] min-w-[86px] max-w-[86px]";
  const pillDim = compact ? "h-9 w-[88px] min-w-[88px] max-w-[88px]" : "h-10 w-[92px] min-w-[92px] max-w-[92px]";

  let buttonClasses = "";
  if (variant === "segmented") {
    buttonClasses = inverse
      ? `inline-flex ${segDim} shrink-0 items-center justify-between rounded-lg px-1.5 text-xs font-bold text-white hover:bg-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400`
      : `inline-flex ${segDim} shrink-0 items-center justify-between rounded-lg px-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`;
  } else if (variant === "pill") {
    buttonClasses = inverse
      ? `inline-flex ${pillDim} shrink-0 items-center justify-between rounded-full border border-white/20 bg-white/10 px-3 text-xs font-bold text-white shadow-xs backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400`
      : `inline-flex ${pillDim} shrink-0 items-center justify-between rounded-full border border-slate-200/90 bg-white/95 px-3 text-xs font-bold text-slate-800 shadow-xs backdrop-blur-md transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`;
  } else {
    // Default standalone: matches EcosystemDropdown and navbar controls with locked width
    buttonClasses = inverse
      ? `group inline-flex ${standDim} shrink-0 items-center justify-between rounded-xl border border-white/15 bg-white/10 px-2.5 text-xs font-bold text-white shadow-xs backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400`
      : `group inline-flex ${standDim} shrink-0 items-center justify-between rounded-xl border border-slate-200/90 bg-white/95 px-2.5 text-xs font-bold text-slate-800 shadow-xs backdrop-blur-md transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`;
  }

  const dropdownAlignClasses = align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right";

  return (
    <div
      ref={containerRef}
      className={`relative inline-block shrink-0 text-left ${isOpen ? "z-50" : ""} ${className}`}
      {...props}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${t("languages.selectorAriaLabel")}. ${localeInfo.name}`}
        title={`${t("languages.interfaceLanguage")}: ${localeInfo.name}`}
        className={buttonClasses}
      >
        {/* Globe Icon */}
        <svg
          className={`h-3.5 w-3.5 shrink-0 transition-colors ${
            inverse ? "text-slate-300 group-hover:text-white" : "text-slate-500 group-hover:text-indigo-600"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>

        {/* Current Locale Flag + Code */}
        <span className="flex items-center gap-0.5 font-mono tracking-wide font-extrabold uppercase text-[11px]">
          <span aria-hidden="true">{localeInfo.flag ?? "🌐"}</span>
          <span>{locale.toUpperCase()}</span>
        </span>

        {/* Dropdown Chevron */}
        <svg
          className={`h-3 w-3 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${
            inverse ? "text-slate-300" : "text-slate-400 group-hover:text-slate-600"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Language Menu Popover */}
      {isOpen && (
        <div
          className={`absolute ${dropdownAlignClasses} top-full mt-2 w-72 rounded-2xl p-2 z-[9999] transition-all duration-200 ${
            inverse
              ? "border border-slate-800 bg-slate-900/98 backdrop-blur-2xl shadow-2xl ring-1 ring-white/10 text-slate-100"
              : "border border-slate-200/90 bg-white/98 backdrop-blur-2xl shadow-2xl shadow-indigo-950/10 ring-1 ring-slate-900/5 text-slate-800"
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-3 py-2 rounded-xl mb-1.5 border ${
              inverse
                ? "border-slate-800/80 bg-slate-800/50"
                : "border-slate-100 bg-slate-50/80"
            }`}
          >
            <span
              className={`text-[10px] font-black uppercase tracking-[0.14em] ${
                inverse ? "text-sky-400" : "text-indigo-600"
              }`}
            >
              {t("languages.interfaceLanguage")}
            </span>
            <span className="text-[9px] font-bold tracking-wide text-slate-400 uppercase">
              {t("languages.multiL1Engine")}
            </span>
          </div>

          {/* Languages Listbox */}
          <ul
            ref={listboxRef}
            role="listbox"
            aria-label={t("languages.interfaceLanguage")}
            className="space-y-1"
          >
            {SUPPORTED_LOCALES.map((item: LocaleInfo) => {
              const isSelected = item.code === locale;

              const itemBgClass = inverse
                ? isSelected
                  ? "bg-sky-950/70 text-white font-bold border border-sky-800/70"
                  : "text-slate-200 hover:bg-slate-800/80 border border-transparent"
                : isSelected
                ? "bg-indigo-50/90 text-indigo-950 font-bold border border-indigo-100/90 shadow-xs"
                : "text-slate-800 hover:bg-slate-50 border border-transparent";

              const badgeClass = inverse
                ? isSelected
                  ? "bg-sky-500 text-slate-950 font-black"
                  : "bg-slate-800 text-slate-300 border border-slate-700 font-bold"
                : isSelected
                ? "bg-indigo-600 text-white font-black"
                : "bg-slate-100 text-slate-600 border border-slate-200/80 font-bold";

              const subTextClass = inverse
                ? isSelected
                  ? "text-sky-200/80"
                  : "text-slate-400"
                : isSelected
                ? "text-indigo-900/75"
                : "text-slate-500";

              return (
                <li key={item.code} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.code)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-colors duration-150 ${itemBgClass}`}
                  >
                    <div className="flex items-center gap-2.5 text-left">
                      <span className="text-lg leading-none" aria-hidden="true">
                        {item.flag ?? "🌐"}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[13px] leading-tight">
                          {item.name}
                        </span>
                        <span className={`text-[11px] leading-tight mt-0.5 ${subTextClass}`}>
                          {item.englishName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.regionalBadge && (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] uppercase tracking-wider ${badgeClass}`}
                        >
                          {item.regionalBadge}
                        </span>
                      )}

                      {isSelected ? (
                        <svg
                          className={`h-4 w-4 stroke-[2.5] ${
                            inverse ? "text-sky-400" : "text-indigo-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="w-4" />
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
