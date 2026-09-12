"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { AuthService } from "@lurexa/backend";
import { ProductMark, type LurexaProduct } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { LanguageSelector } from "@lurexa/ui/LanguageSelector";
import { CommandPalette } from "@lurexa/ui/CommandPalette";
import { useToast } from "@lurexa/ui/Toast";
import { Button } from "@lurexa/ui/button";
import { LearnerMobileBottomBar } from "@lurexa/ui/navigation";
import { useTranslation } from "@lurexa/i18n";

interface ProductShellProps {
  children: ReactNode;
  area: "Learner space" | "Educator space" | "Practice space" | "Creator space";
  homeHref: string;
  product?: LurexaProduct;
}

export function ProductShell({ children, area, homeHref, product = "learn" }: ProductShellProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  // Close mobile account menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  async function signOut() {
    try {
      await AuthService.logout();
      router.replace("/login");
    } catch {
      toast({
        variant: "error",
        title: "Sign out failed",
        description: "We could not sign you out. Please try again.",
      });
    }
  }

  const isLearnerSpace = area === "Learner space" || area === "Practice space";

  return (
    <div className="min-h-screen bg-[var(--learn-canvas)] text-[var(--learn-ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--lx-border)] bg-[var(--lx-surface)]/90 shadow-[0_8px_24px_rgba(32,52,128,.05)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[64px] sm:min-h-[72px] max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              href={homeHref}
              aria-label={`${product === "learn" ? "Lurexa Learn" : `Lurexa ${product[0].toUpperCase()}${product.slice(1)}`} home`}
              className="rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--lx-focus-ring)] focus:ring-offset-2"
            >
              <ProductMark product={product} />
            </Link>
            <span className="hidden h-6 w-px bg-[var(--lx-border)] sm:block" />
            <span className="hidden text-[10px] font-extrabold uppercase tracking-[.18em] text-[var(--lx-muted)] sm:block">
              {area}
            </span>
          </div>

          <nav aria-label="Account controls" className="flex items-center gap-1.5 sm:gap-2">
            <Button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              aria-label="Open command search palette"
              className="hidden items-center gap-2 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3 py-1.5 text-xs font-semibold text-[var(--lx-muted)] shadow-sm transition hover:border-[var(--lx-border)] hover:text-[var(--lx-ink)] sm:inline-flex"
            >
              <span>{t("nav.search")}</span>
              <kbd className="rounded bg-[var(--lx-canvas)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--lx-muted)] shadow-xs">
                {t("nav.searchShortcut")}
              </kbd>
            </Button>

            {/* Proposal 1 Approved: Unified Utility Capsule (Language + Theme + Ecosystem) */}
            <div className="flex items-center gap-1 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-1 shadow-2xs">
              <LanguageSelector variant="segmented" compact />
              <div className="h-4 w-px bg-[var(--lx-border)]" aria-hidden="true" />
              <ThemeToggle className="h-8 w-8 rounded-lg border-0 bg-transparent shadow-none hover:bg-[var(--lx-surface)]" />
              <div className="h-4 w-px bg-[var(--lx-border)]" aria-hidden="true" />
              <EcosystemDropdown currentApp="learn" compact className="border-0 bg-transparent shadow-none" />
            </div>

            {/* Desktop Profile & Sign Out buttons */}
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link
                href="/profile"
                className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs font-extrabold text-[var(--lx-ink)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--lx-border)] hover:bg-[var(--lx-canvas)] sm:text-sm"
              >
                {t("nav.profile")}
              </Link>
              <Button
                type="button"
                onClick={signOut}
                className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs font-extrabold text-[var(--lx-ink)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--lx-border)] hover:bg-[var(--lx-canvas)] sm:text-sm"
              >
                {t("nav.signOut")}
              </Button>
            </div>

            {/* Mobile Collapsed Profile Menu (Proposal 1 Approved) */}
            <div ref={mobileMenuRef} className="relative sm:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="User account controls"
                aria-expanded={mobileMenuOpen}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] text-sm shadow-xs transition hover:bg-[var(--lx-canvas)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-focus-ring)]"
              >
                <span aria-hidden="true">👤</span>
              </button>
              {mobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-2 shadow-2xl z-50 animate-scale-in">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold text-[var(--lx-ink)] hover:bg-[var(--lx-canvas)] transition"
                  >
                    <span>👤</span>
                    <span>{t("nav.profile")}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      void signOut();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left"
                  >
                    <span>🚪</span>
                    <span>{t("nav.signOut")}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className={isLearnerSpace ? "pb-20 md:pb-0" : ""}>{children}</main>
      {isLearnerSpace && <LearnerMobileBottomBar />}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(href) => router.push(href)}
      />
    </div>
  );
}
