import React from "react";
import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { resolveLurexaPublicUrls } from "@lurexa/config/product-urls";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Speaking Studio", href: "/practice" },
  { label: "Pronunciation", href: "/pronunciation" },
  { label: "History", href: "/history" },
  { label: "Educators", href: "/educator" },
] as const;

export function CoachShell({
  children,
  active,
  inverse = false,
}: {
  children: React.ReactNode;
  active?: string;
  inverse?: boolean;
}) {
  const urls = resolveLurexaPublicUrls();

  return (
    <div className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)] flex flex-col justify-between transition-colors duration-200">
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          inverse
            ? "border-white/10 bg-slate-950/90 text-white"
            : "border-[var(--lx-border)] bg-[var(--lx-surface)]/95 text-[var(--lx-ink)]"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-6">
            <Link href="/" aria-label="Lurexa Coach Home" className="flex items-center gap-2">
              <ProductMark product="coach" inverse={inverse} size="md" />
            </Link>

            <nav aria-label="Coach desktop navigation" className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = active === item.label;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${
                      isActive
                        ? inverse
                          ? "bg-white/15 text-[#9dfbf9]"
                          : "bg-[var(--lx-primary)]/10 text-[var(--lx-primary)]"
                        : inverse
                        ? "text-slate-300 hover:bg-white/10 hover:text-white"
                        : "text-[var(--lx-muted)] hover:bg-[var(--lx-canvas)] hover:text-[var(--lx-ink)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={urls.ecosystem}
              className={`hidden sm:inline-flex rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                inverse ? "text-slate-300 hover:text-white" : "text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
              }`}
            >
              Lurexa ↗
            </a>
            <a
              href={urls.learn}
              className={`hidden sm:inline-flex rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                inverse ? "text-slate-300 hover:text-white" : "text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
              }`}
            >
              Learn ↗
            </a>
            <a
              href={urls.teach}
              className={`hidden sm:inline-flex rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                inverse ? "text-slate-300 hover:text-white" : "text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
              }`}
            >
              Teach ↗
            </a>


            <ThemeToggle />
            <EcosystemDropdown currentApp="coach" inverse={inverse} />

            <Link
              href="/practice"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#12cdd4] to-[#0ba5a8] px-4 py-2 text-xs font-black text-[#071d67] shadow-sm transition hover:brightness-105 active:scale-95"
            >
              <span>🎙️</span>
              <span className="hidden sm:inline">Quick Practice</span>
              <span className="sm:hidden">Practice</span>
            </Link>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        <nav
          aria-label="Coach mobile navigation"
          className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2.5 pt-0.5 md:hidden"
        >
          {navItems.map((item) => {
            const isActive = active === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  isActive
                    ? inverse
                      ? "bg-white/20 text-[#9dfbf9]"
                      : "bg-[var(--lx-primary)]/10 text-[var(--lx-primary)]"
                    : inverse
                    ? "text-slate-300"
                    : "text-[var(--lx-muted)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="flex-1">{children}</div>

      {/* Global Footer */}
      <footer className="border-t border-[var(--lx-border)] bg-[var(--lx-surface)] py-10 text-xs text-[var(--lx-muted)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            <ProductMark product="coach" size="sm" />
            <span>© {new Date().getFullYear()} Lurexa Learning Technologies. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-bold">
            <Link href="/placement" className="hover:text-[var(--lx-primary)] transition">
              Diagnostic Placement
            </Link>
            <Link href="/practice" className="hover:text-[var(--lx-primary)] transition">
              Speaking Studio
            </Link>
            <a href={urls.learn} className="hover:text-[var(--lx-primary)] transition">
              Lurexa Learn
            </a>
            <a href={urls.teach} className="hover:text-[var(--lx-primary)] transition">
              Lurexa Teach
            </a>
            <Link href="/login" className="hover:text-[var(--lx-primary)] transition">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
