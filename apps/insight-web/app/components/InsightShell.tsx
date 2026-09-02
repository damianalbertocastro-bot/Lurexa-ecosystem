"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { CommandPalette } from "@lurexa/ui/CommandPalette";
import { Button } from "@lurexa/ui/button";

const nav = [
  ["Overview", "/"],
  ["Phonemic Heatmaps", "/cohorts"],
  ["Intervention Routing", "/interventions"],
  ["Milestone Reports", "/reports"],
] as const;

export function InsightShell({
  active,
  children,
}: {
  active: string;
  children: React.ReactNode;
}) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[var(--lx-canvas)] text-[var(--lx-ink)]">
      <header className="sticky top-0 z-40 border-b border-[var(--lx-border)] bg-[var(--lx-surface)]/90 backdrop-blur-xl shadow-xs">
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-3 sm:px-8">
          <Button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle navigation drawer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] text-slate-850 dark:text-white lg:hidden"
          >
            ☰
          </Button>

          <Link
            href="/"
            aria-label="Lurexa Insight home"
            className="shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-secondary)]"
          >
            <ProductMark product="insight" className="hidden sm:inline-flex" />
            <ProductMark product="insight" compact className="sm:hidden" />
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
            aria-label="Lurexa Insight navigation"
          >
            {nav.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                aria-current={active === label ? "page" : undefined}
                className={`rounded-xl px-3.5 py-2 text-xs font-black transition ${
                  active === label
                    ? "bg-[var(--lx-canvas)] text-[var(--lx-secondary)] shadow-xs"
                    : "text-[var(--lx-muted)] hover:bg-[var(--lx-canvas)] hover:text-[var(--lx-ink)]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              aria-label="Open search palette"
              className="hidden items-center gap-2 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3 py-1.5 text-xs font-semibold text-[var(--lx-muted)] shadow-xs transition hover:border-[var(--lx-border)] hover:text-[var(--lx-ink)] sm:inline-flex"
            >
              <span>Search</span>
              <kbd className="rounded bg-white/70 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 shadow-xs dark:bg-slate-800">
                ⌘K
              </kbd>
            </Button>

            <ThemeToggle />
            <EcosystemDropdown currentApp="insight" />
          </div>
        </div>

        {/* Mobile slide-out drawer */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="h-full w-72 max-w-[80vw] bg-[var(--lx-surface)] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[var(--lx-border)] pb-4">
                <ProductMark product="insight" compact />
                <Button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-xs text-slate-900 dark:text-white">✕</Button>
              </div>
              <nav className="mt-4 flex flex-col gap-1.5">
                {nav.map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                      active === label
                        ? "bg-[var(--lx-primary)] text-white"
                        : "text-slate-900 dark:text-slate-100 hover:bg-[var(--lx-canvas)]"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        <nav
          className="flex items-center gap-1 overflow-x-auto border-t border-[var(--lx-border)] px-4 py-2 lg:hidden"
          aria-label="Mobile navigation"
        >
          {nav.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              aria-current={active === label ? "page" : undefined}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                active === label
                  ? "bg-[var(--lx-canvas)] text-[var(--lx-secondary)]"
                  : "text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="mt-auto border-t border-[var(--lx-border)] bg-[var(--lx-surface)]">
        <div className="mx-auto grid max-w-[1440px] gap-7 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto]">
          <div>
            <ProductMark product="insight" />
            <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--lx-muted)]">
              Cross-product longitudinal analytics, CEFR velocity radar, Dominican Spanish linguistic diagnostics, and educator grade calibration.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-[var(--lx-muted)]">
            <Link href="/">Overview</Link>
            <Link href="/cohorts">Phonemic Heatmaps</Link>
            <Link href="/interventions">Intervention Routing</Link>
            <Link href="/reports">Milestone Reports</Link>
            <a href="https://learn.lurexa.org">Lurexa Learn ↗</a>
            <a href="https://teach.lurexa.org">Lurexa Teach ↗</a>
            <a href="https://lurexa.org">Ecosystem ↗</a>
          </div>
        </div>
      </footer>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
