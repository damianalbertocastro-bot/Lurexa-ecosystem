"use client";

import { useState, useRef, useEffect, type HTMLAttributes, type MouseEvent } from "react";
import { getEcosystemUrl, type EcosystemAppKey } from "@lurexa/config/domains";
import { MasterMark } from "./MasterMark";
import { ProductMark } from "./ProductMark";
import { DocsMark } from "./DocsMark";

export interface EcosystemDropdownProps extends HTMLAttributes<HTMLDivElement> {
  currentApp?: EcosystemAppKey;
  align?: "left" | "right";
  inverse?: boolean;
  openOnHover?: boolean;
  label?: string;
  compact?: boolean;
}

const APPS_CONFIG: Array<{
  key: EcosystemAppKey;
  name: string;
  shortName: string;
  badge?: string;
  description: string;
  tag: string;
}> = [
  {
    key: "learn",
    name: "Lurexa Learn",
    shortName: "Learn",
    description: "Adaptive student & educator operational learning space",
    tag: "A1–B1 Production",
  },
  {
    key: "coach",
    name: "Lurexa Coach",
    shortName: "Coach",
    description: "Adaptive speaking, pronunciation & fluency AI practice",
    tag: "Dominican English AI",
  },
  {
    key: "teach",
    name: "Lurexa Teach",
    shortName: "Teach",
    description: "Professional educator development, credentials & community",
    tag: "Educator Platform",
  },
  {
    key: "admin",
    name: "Lurexa Admin",
    shortName: "Admin",
    description: "Institutional governance, compliance & platform operations",
    tag: "Trust & Governance",
  },
  {
    key: "insight",
    name: "Lurexa Insight",
    shortName: "Insight",
    description: "Institutional cohort analytics & phonemic error telemetry",
    tag: "Analytics & Radar",
  },
  {
    key: "studio",
    name: "Lurexa Studio",
    shortName: "Studio",
    description: "Curriculum authoring, knowledge design & pedagogical studio",
    tag: "Authoring Suite",
  },
  {
    key: "docs",
    name: "Lurexa Docs",
    shortName: "Docs",
    description: "Canonical architecture, curriculum & engineering specifications",
    tag: "Knowledge Base",
  },
];

function AppMark({ appKey }: { appKey: EcosystemAppKey }) {
  if (appKey === "root") return <MasterMark compact size="sm" />;
  if (appKey === "docs") return <DocsMark compact size="sm" />;
  if (appKey === "learn") return <ProductMark product="learn" compact size="sm" />;
  if (appKey === "coach") return <ProductMark product="coach" compact size="sm" />;
  if (appKey === "teach") return <ProductMark product="teach" compact size="sm" />;
  if (appKey === "admin") return <ProductMark product="admin" compact size="sm" />;
  if (appKey === "insight") return <ProductMark product="insight" compact size="sm" />;
  if (appKey === "studio") return <ProductMark product="studio" compact size="sm" />;
  return <MasterMark compact size="sm" />;
}

function shouldUseNativeNavigation(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export function EcosystemDropdown({
  currentApp,
  align = "right",
  inverse = false,
  openOnHover = false,
  label = "Ecosystem",
  compact = false,
  className = "",
  ...props
}: EcosystemDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleMouseEnter = () => {
    if (!openOnHover) return;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!openOnHover) return;
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  function navigate(event: MouseEvent<HTMLAnchorElement>, url: string, isCurrent = false) {
    setIsOpen(false);
    if (isCurrent || shouldUseNativeNavigation(event)) return;
    window.location.href = url;
  }

  const buttonStyle = inverse
    ? "border-white/15 bg-white/10 text-white shadow-sm backdrop-blur-md hover:bg-white/20 hover:border-white/25 focus-visible:ring-sky-400"
    : "border-slate-200/90 bg-white/95 text-slate-800 shadow-sm backdrop-blur-md hover:bg-slate-50 hover:border-slate-300 hover:text-slate-950 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800";

  return (
    <div
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block text-left ${className}`}
      {...props}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Lurexa ecosystem navigation switcher"
        className={`group inline-flex min-h-10 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${buttonStyle}`}
      >
        <span className="grid h-5 w-5 place-items-center transition-transform group-hover:scale-105">
          <MasterMark compact size="sm" />
        </span>
        {!compact && <span className="hidden sm:inline font-bold tracking-tight">{label}</span>}
        <svg
          aria-hidden="true"
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 motion-reduce:transition-none ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-sky-400" : "group-hover:text-slate-600 dark:group-hover:text-slate-200"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-label="Lurexa ecosystem surfaces"
          className={`absolute z-[9999] mt-2.5 w-88 sm:w-96 max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-2xl p-2.5 shadow-2xl ring-1 ring-slate-900/5 focus:outline-none dark:border-slate-800 dark:bg-slate-900/95 dark:ring-white/10 ${
            align === "right" ? "right-0" : "left-0"
          } animate-scale-in`}
        >
          {/* Header */}
          <div className="rounded-xl bg-slate-50/80 p-3.5 border border-slate-100 dark:bg-slate-800/50 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-sky-400">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-sky-400 animate-pulse" />
                Lurexa Ecosystem
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Unified Architecture
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              One evolving Learner Model across all specialized surfaces.
            </p>
          </div>

          {/* App Items */}
          <div className="mt-2 space-y-1">
            {APPS_CONFIG.map((app) => {
              const url = getEcosystemUrl(app.key);
              const isCurrent = app.key === currentApp;

              return (
                <a
                  key={app.key}
                  href={url}
                  role="menuitem"
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={(event) => navigate(event, url, isCurrent)}
                  className={`group flex items-start gap-3 rounded-xl p-2.5 transition-colors motion-reduce:transition-none ${
                    isCurrent
                      ? "bg-indigo-50/80 text-indigo-950 border border-indigo-100/80 dark:bg-indigo-950/40 dark:text-white dark:border-indigo-800/40"
                      : "text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white shadow-xs border transition-transform group-hover:scale-105 ${
                    isCurrent ? "border-indigo-200 dark:bg-slate-800 dark:border-indigo-700" : "border-slate-200/80 dark:bg-slate-800 dark:border-slate-700"
                  }`}>
                    <AppMark appKey={app.key} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`text-xs font-bold tracking-tight ${
                        isCurrent ? "text-indigo-900 dark:text-indigo-200" : "text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-sky-400"
                      }`}>
                        {app.name}
                      </span>
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-sky-400 font-medium transition-transform group-hover:translate-x-0.5">
                          ↗
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400 font-normal line-clamp-1">
                      {app.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

