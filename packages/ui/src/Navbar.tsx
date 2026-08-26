"use client";

import type { ReactNode } from "react";
import { getEcosystemUrl, type EcosystemAppKey } from "@lurexa/config/domains";
import { MasterMark } from "./MasterMark";
import { EcosystemDropdown } from "./EcosystemDropdown";

export interface NavbarLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarProps {
  currentApp?: EcosystemAppKey;
  brandHref?: string;
  brandTitle?: string;
  brandSubtitle?: string;
  brandMark?: ReactNode;
  navLinks?: NavbarLink[];
  rightSlot?: ReactNode;
  inverse?: boolean;
  className?: string;
}

export function Navbar({
  currentApp,
  brandHref,
  brandTitle = "Lurexa",
  brandSubtitle,
  brandMark,
  navLinks = [],
  rightSlot,
  inverse = false,
  className = "",
}: NavbarProps) {
  const rootUrl = getEcosystemUrl("root");
  const resolvedBrandHref = brandHref ?? (currentApp && currentApp !== "root" ? "/" : rootUrl);

  const containerClasses = inverse
    ? "border-white/10 bg-[#071d67]/90 text-white"
    : "border-[#dfe6f8]/90 bg-white/90 text-[#071d67]";

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${containerClasses} ${className}`}>
      <div className="mx-auto flex min-h-[68px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <a
            href={resolvedBrandHref}
            className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7] focus-visible:ring-offset-2"
            aria-label={`${brandTitle} home`}
          >
            {brandMark ?? <MasterMark compact size="md" inverse={inverse} />}
            <span className="leading-tight">
              <b className="block text-lg font-black tracking-[-0.04em]">{brandTitle}</b>
              {brandSubtitle && (
                <span className="hidden text-[10px] font-extrabold uppercase tracking-[0.14em] opacity-70 sm:block">
                  {brandSubtitle}
                </span>
              )}
            </span>
          </a>
        </div>

        {navLinks.length > 0 && (
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={link.active ? "page" : undefined}
                className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition motion-reduce:transition-none ${
                  link.active
                    ? inverse
                      ? "bg-white/20 text-white"
                      : "bg-[#eef2ff] text-[#315fd7]"
                    : inverse
                    ? "text-indigo-100 hover:bg-white/10 hover:text-white"
                    : "text-[#5d6f9d] hover:bg-[#f3f6ff] hover:text-[#071d67]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2.5">
          <EcosystemDropdown currentApp={currentApp} inverse={inverse} />
          {rightSlot}
        </div>
      </div>
    </header>
  );
}
