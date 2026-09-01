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
}

const APPS_CONFIG: Array<{
  key: EcosystemAppKey;
  name: string;
  shortName: string;
  badge?: string;
  description: string;
}> = [
  {
    key: "learn",
    name: "Lurexa Learn",
    shortName: "Learn",
    description: "Student & educator operational learning space",
  },
  {
    key: "coach",
    name: "Lurexa Coach",
    shortName: "Coach",
    description: "Adaptive speaking, pronunciation & fluency practice",
  },
  {
    key: "teach",
    name: "Lurexa Teach",
    shortName: "Teach",
    description: "Professional development, credentials & community",
  },
  {
    key: "admin",
    name: "Lurexa Admin",
    shortName: "Admin",
    description: "Institutional governance & platform operations",
  },
  {
    key: "insight",
    name: "Lurexa Insight",
    shortName: "Insight",
    description: "Institutional analytics & cohort intelligence",
  },
  {
    key: "studio",
    name: "Lurexa Studio",
    shortName: "Studio",
    description: "Curriculum authoring & knowledge design",
  },
  {
    key: "docs",
    name: "Lurexa Docs",
    shortName: "Docs",
    description: "Canonical architecture & curriculum knowledge base",
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
  className = "",
  ...props
}: EcosystemDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  function navigate(event: MouseEvent<HTMLAnchorElement>, url: string, isCurrent = false) {
    setIsOpen(false);
    if (isCurrent || shouldUseNativeNavigation(event)) return;
    // Direct navigation to target ecosystem subdomain
    window.location.href = url;
  }

  const buttonStyle = inverse
    ? "border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 focus-visible:ring-white"
    : "border-[var(--lx-border)] bg-[var(--lx-surface)] text-[var(--lx-ink)] backdrop-blur-md hover:bg-[var(--lx-canvas)] hover:border-[var(--lx-secondary)] focus-visible:ring-[var(--lx-secondary)]";

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`} {...props}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Lurexa ecosystem navigation switcher"
        className={`inline-flex min-h-10 items-center gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-extrabold shadow-sm transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${buttonStyle}`}
      >
        <span className="grid h-5 w-5 place-items-center">
          <MasterMark compact size="sm" />
        </span>
        <span className="hidden sm:inline font-bold">Ecosystem</span>
        <svg
          aria-hidden="true"
          className={`h-4 w-4 text-[var(--lx-muted)] transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180 text-[var(--lx-secondary)]" : ""}`}
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
          className={`absolute z-[9999] mt-2 w-84 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)]/98 backdrop-blur-xl p-2.5 shadow-2xl ring-1 ring-black/5 focus:outline-none ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="border-b border-[var(--lx-border)] px-3.5 py-3">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--lx-secondary)]">
              Lurexa Ecosystem
            </p>
            <p className="mt-1 text-xs font-medium text-[var(--lx-muted)]">
              One learner model across all connected surfaces.
            </p>
          </div>

          <div className="mt-1.5 space-y-1">
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
                  className={`group flex items-start gap-3 rounded-xl p-2.5 transition motion-reduce:transition-none ${
                    isCurrent
                      ? "bg-[var(--lx-canvas)] text-[var(--lx-secondary)] shadow-2xs"
                      : "text-[var(--lx-ink)] hover:bg-[var(--lx-canvas)] hover:text-[var(--lx-secondary)]"
                  }`}
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--lx-canvas)] shadow-2xs ring-1 ring-[var(--lx-border)]">
                    <AppMark appKey={app.key} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black tracking-[-0.01em] text-[var(--lx-ink)] group-hover:text-[var(--lx-secondary)]">
                        {app.name}
                      </span>
                      {isCurrent ? (
                        <span className="rounded-full bg-[var(--lx-secondary)] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white">
                          Current
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-[var(--lx-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--lx-secondary)] motion-reduce:transform-none">
                          ↗
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] leading-4 text-[var(--lx-muted)]">
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
