"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { CommandPalette } from "@lurexa/ui/CommandPalette";

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
    <div className="flex min-h-screen flex-col justify-between bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* SaaS Editorial Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle navigation drawer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            ☰
          </button>

          {/* Logo Brand: Monogram + Wordmark + Badge */}
          <Link
            href="/"
            aria-label="Lurexa Insight home"
            className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-sm shadow-indigo-500/20 text-white">
              <ProductMark product="insight" compact size="sm" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Lurexa
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:border-indigo-800/60 dark:text-indigo-300">
                INSIGHT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden flex-1 items-center justify-center gap-1.5 lg:flex"
            aria-label="Lurexa Insight navigation"
          >
            {nav.map(([label, href]) => {
              const isActive = active === label;
              return (
                <Link
                  key={label}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-lg px-3.5 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-950 font-semibold dark:bg-slate-800 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-850"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              aria-label="Open search palette"
              className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs text-slate-500 shadow-2xs transition hover:border-slate-300 hover:text-slate-800 sm:inline-flex dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <span>Search</span>
              <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-200 shadow-2xs dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">
                ⌘K
              </kbd>
            </button>

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
              className="h-full w-72 max-w-[80vw] bg-white p-6 shadow-2xl dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
                    <ProductMark product="insight" compact size="sm" />
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">Insight</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>
              <nav className="mt-4 flex flex-col gap-1.5">
                {nav.map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      active === label
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Mobile secondary tab bar */}
        <nav
          className="flex items-center gap-1 overflow-x-auto border-t border-slate-200/80 px-4 py-2 lg:hidden dark:border-slate-800"
          aria-label="Mobile navigation"
        >
          {nav.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              aria-current={active === label ? "page" : undefined}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                active === label
                  ? "bg-slate-200/80 text-slate-950 dark:bg-slate-800 dark:text-white"
                  : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
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

      <footer className="mt-auto border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-[1440px] gap-7 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-600 text-white">
                <ProductMark product="insight" compact size="sm" />
              </span>
              <span className="font-bold text-slate-900 dark:text-white">Lurexa Insight</span>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Cross-product longitudinal analytics, CEFR velocity radar, Dominican Spanish linguistic diagnostics, and educator grade calibration.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white">Overview</Link>
            <Link href="/cohorts" className="hover:text-slate-900 dark:hover:text-white">Phonemic Heatmaps</Link>
            <Link href="/interventions" className="hover:text-slate-900 dark:hover:text-white">Intervention Routing</Link>
            <Link href="/reports" className="hover:text-slate-900 dark:hover:text-white">Milestone Reports</Link>
            <a href="https://learn.lurexa.org" className="hover:text-indigo-600">Lurexa Learn ↗</a>
            <a href="https://teach.lurexa.org" className="hover:text-indigo-600">Lurexa Teach ↗</a>
            <a href="https://lurexa.org" className="hover:text-indigo-600">Ecosystem ↗</a>
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
