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
  if (appKey === "teach") return <ProductMark product="teach" compact size="sm" />;
  if (appKey === "admin") return <ProductMark product="admin" compact size="sm" />;
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
    event.preventDefault();
    window.location.assign(url);
  }

  const buttonStyle = inverse
    ? "border-white/20 bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white"
    : "border-[#dfe6f8] bg-white text-[#071d67] hover:bg-[#f3f6ff] hover:border-[#b8c7f1] focus-visible:ring-[#315fd7]";

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`} {...props}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Lurexa ecosystem navigation switcher"
        className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-extrabold shadow-sm transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${buttonStyle}`}
      >
        <span className="grid h-5 w-5 place-items-center">
          <MasterMark compact size="sm" />
        </span>
        <span className="hidden sm:inline">Ecosystem</span>
        <svg
          aria-hidden="true"
          className={`h-4 w-4 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
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
          className={`absolute z-50 mt-2 w-80 rounded-2xl border border-[#dfe6f8] bg-white p-2 shadow-[0_20px_50px_rgba(7,29,103,0.15)] ring-1 ring-black/5 focus:outline-none ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="border-b border-[#eef2fc] px-3 py-2.5">
            <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#315fd7]">
              Lurexa Ecosystem
            </p>
            <p className="mt-0.5 text-xs font-medium text-[#6677a5]">
              One learner model across all connected surfaces.
            </p>
          </div>

          <div className="mt-1 space-y-1">
            {APPS_CONFIG.map((app) => {
              const url = getEcosystemUrl(app.key);
              const isCurrent = app.key === currentApp;

              return (
                <a
                  key={app.key}
                  href={url}
                  role="menuitem"
                  rel="noreferrer"
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={(event) => navigate(event, url, isCurrent)}
                  className={`group flex items-start gap-3 rounded-xl p-2.5 transition motion-reduce:transition-none ${
                    isCurrent
                      ? "bg-[#eef2ff] text-[#315fd7]"
                      : "text-[#071d67] hover:bg-[#f5f8ff] hover:text-[#315fd7]"
                  }`}
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white shadow-sm ring-1 ring-[#e6ecfb]">
                    <AppMark appKey={app.key} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black tracking-[-0.01em]">
                        {app.name}
                      </span>
                      {isCurrent ? (
                        <span className="rounded-full bg-[#315fd7] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white">
                          Current
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-[#8a9bbd] transition group-hover:translate-x-0.5 motion-reduce:transform-none">
                          ↗
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] leading-4 text-[#6677a5]">
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
