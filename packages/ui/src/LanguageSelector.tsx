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
  variant?: "standalone" | "segmented";
  compact?: boolean;
  onLocaleChange?: (locale: SupportedLocale) => void;
  className?: string;
}

export function LanguageSelector({
  align = "right",
  inverse = false,
  variant = "standalone",
  compact = false,
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
      setLocale(code);
      setIsOpen(false);
      if (onLocaleChange) {
        onLocaleChange(code);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("lurexa-locale-change", { detail: { locale: code } }));
      }
    },
    [setLocale, onLocaleChange],
  );

  // Determine button styling based on variant & theme
  let buttonClasses = "";
  if (variant === "segmented") {
    buttonClasses = inverse
      ? `inline-flex ${compact ? "h-7 sm:h-8 px-1.5" : "h-8 sm:h-9 px-2"} items-center gap-1.5 rounded-lg text-xs font-black text-white hover:bg-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400`
      : `inline-flex ${compact ? "h-7 sm:h-8 px-1.5" : "h-8 sm:h-9 px-2"} items-center gap-1.5 rounded-lg text-xs font-black text-[var(--lx-ink)] hover:bg-[var(--lx-surface)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-focus-ring)]`;
  } else {
    buttonClasses = inverse
      ? `inline-flex ${compact ? "h-8 px-2" : "h-9 sm:h-10 px-2.5 sm:px-3"} items-center gap-2 rounded-xl border border-white/15 bg-white/10 text-xs font-black text-white shadow-xs backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400`
      : `inline-flex ${compact ? "h-8 px-2" : "h-9 sm:h-10 px-2.5 sm:px-3"} items-center gap-2 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)]/95 text-xs font-black text-[var(--lx-ink)] shadow-xs backdrop-blur-md transition-all hover:bg-[var(--lx-canvas)] hover:border-[var(--lx-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-focus-ring)]`;
  }

  const dropdownAlignClasses = align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right";

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${isOpen ? "z-50" : ""} ${className}`}
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
          className={`h-4 w-4 shrink-0 ${inverse ? "text-slate-200" : "text-[var(--lx-muted)]"}`}
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

        {/* Current Locale Code Badge */}
        <span className="font-mono tracking-wider font-extrabold uppercase text-[11px] sm:text-xs">
          {locale.toUpperCase()}
        </span>

        {/* Dropdown Chevron */}
        <svg
          className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${
            inverse ? "text-slate-300" : "text-slate-400"
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
          className={`absolute ${dropdownAlignClasses} mt-2 w-72 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)]/98 backdrop-blur-2xl p-2 shadow-2xl ring-1 ring-slate-900/5 dark:border-slate-800 dark:bg-slate-900/98 dark:ring-white/10 z-[9999] transition-all`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--lx-border)] mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-indigo-600 dark:text-sky-400">
              {t("languages.interfaceLanguage")}
            </span>
            <span className="text-[9px] font-extrabold tracking-wide text-[var(--lx-muted)] uppercase">
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
              return (
                <li key={item.code} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.code)}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-colors ${
                      isSelected
                        ? "bg-indigo-50/90 text-indigo-950 font-bold border border-indigo-100/90 dark:bg-indigo-950/60 dark:text-white dark:border-indigo-800/60"
                        : "text-[var(--lx-ink)] hover:bg-[var(--lx-canvas)] dark:text-slate-200 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span className="font-extrabold text-[13px] leading-tight">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[var(--lx-muted)] leading-tight mt-0.5">
                        {item.englishName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.regionalBadge && (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                            isSelected
                              ? "bg-indigo-600 text-white dark:bg-sky-500 dark:text-slate-950"
                              : "bg-[var(--lx-canvas)] text-[var(--lx-muted)] border border-[var(--lx-border)]"
                          }`}
                        >
                          {item.regionalBadge}
                        </span>
                      )}

                      {isSelected ? (
                        <svg
                          className="h-4 w-4 text-indigo-600 dark:text-sky-400 stroke-[2.5]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
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
