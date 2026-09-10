"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { LanguageSelector } from "@lurexa/ui/LanguageSelector";
import { CommandPalette } from "@lurexa/ui/CommandPalette";
import { resolveLurexaPublicUrls } from "@lurexa/config/product-urls";
import { AuthService, type AuthenticatedUser } from "@lurexa/backend";
import { useTranslation } from "@lurexa/i18n";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Speaking Studio", href: "/practice" },
  { label: "Pronunciation", href: "/pronunciation" },
  { label: "History", href: "/history" },
  { label: "Educators", href: "/educator" },
  { label: "Profile", href: "/profile" },
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
  const router = useRouter();
  const urls = resolveLurexaPublicUrls();
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && !target.closest("[data-coach-account-menu]")) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const unsubscribe = AuthService.onUserChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await AuthService.logout();
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const getNavLabel = (label: string) => {
    switch (label) {
      case "Home": return t("nav.home");
      case "Dashboard": return t("nav.dashboard");
      case "Speaking Studio": return t("nav.speakingStudio");
      case "Pronunciation": return t("nav.pronunciation");
      case "History": return t("nav.history");
      case "Educators": return t("nav.educators");
      case "Profile": return t("nav.profile");
      default: return label;
    }
  };

  const visibleNavItems = navItems.filter((item) => {
    if (currentUser && item.href === "/") return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)] flex flex-col justify-between transition-colors duration-200">
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          inverse
            ? "border-white/10 bg-slate-950/90 text-white"
            : "border-[var(--lx-border)] bg-[var(--lx-surface)]/95 text-[var(--lx-ink)]"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1720px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <Link href={currentUser ? "/dashboard" : "/"} aria-label="Lurexa Coach Home" className="flex items-center gap-2 shrink-0">
              <ProductMark product="coach" inverse={inverse} size="md" />
            </Link>

            <nav aria-label="Coach desktop navigation" className="hidden md:flex items-center gap-1">
              {visibleNavItems.map((item) => {
                const isActive = active === item.label;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`rounded-xl px-3 py-2 text-xs font-extrabold transition ${
                      isActive
                        ? inverse
                          ? "bg-white/15 text-[var(--lx-accent)]"
                          : "bg-[var(--lx-primary)]/10 text-[var(--lx-primary)]"
                        : inverse
                        ? "text-slate-300 hover:bg-white/10 hover:text-white"
                        : "text-[var(--lx-muted)] hover:bg-[var(--lx-canvas)] hover:text-[var(--lx-ink)]"
                    }`}
                  >
                    {getNavLabel(item.label)}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Action Area (Proposal 1 Approved) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              aria-label="Open command palette"
              className={`hidden items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition lg:inline-flex ${
                inverse
                  ? "border-white/15 bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white"
                  : "border-[var(--lx-border)] bg-[var(--lx-canvas)] text-[var(--lx-muted)] hover:bg-[var(--lx-surface)] hover:text-[var(--lx-ink)]"
              }`}
            >
              <span>{t("nav.search")}</span>
              <kbd className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                inverse
                  ? "border-white/20 bg-white/10 text-slate-300"
                  : "border-[var(--lx-border)] bg-[var(--lx-surface)] text-[var(--lx-muted)]"
              }`}>
                {t("nav.searchShortcut")}
              </kbd>
            </button>

            {/* Unified Utility Capsule (Language + Theme + Ecosystem) */}
            <div className={`flex items-center gap-1 rounded-xl border p-1 shadow-2xs ${
              inverse ? "border-white/15 bg-white/10" : "border-[var(--lx-border)] bg-[var(--lx-canvas)]"
            }`}>
              <LanguageSelector variant="segmented" compact inverse={inverse} />
              <div className={`h-4 w-px ${inverse ? "bg-white/15" : "bg-[var(--lx-border)]"}`} aria-hidden="true" />
              <ThemeToggle className="h-8 w-8 rounded-lg border-0 bg-transparent shadow-none hover:bg-[var(--lx-surface)]" />
              <div className={`h-4 w-px ${inverse ? "bg-white/15" : "bg-[var(--lx-border)]"}`} aria-hidden="true" />
              <EcosystemDropdown currentApp="coach" compact inverse={inverse} className="border-0 bg-transparent shadow-none" />
            </div>

            <Link
              href="/practice"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--lx-accent)] to-[var(--lx-accent)] px-3.5 py-2 text-xs font-black text-slate-900 shadow-xs transition hover:brightness-105 active:scale-95 shrink-0"
            >
              <span>🎙️</span>
              <span className="hidden sm:inline">{t("nav.quickPractice")}</span>
              <span className="sm:hidden">Practice</span>
            </Link>

            {/* Desktop Profile & Sign out */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <Link
                href="/profile"
                aria-label="Learner Profile"
                className={`inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-extrabold transition shrink-0 ${
                  active === "Profile"
                    ? "border-[var(--lx-primary)] bg-[var(--lx-primary)]/10 text-[var(--lx-primary)]"
                    : inverse
                    ? "border-white/15 bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white"
                    : "border-[var(--lx-border)] bg-[var(--lx-surface)] text-[var(--lx-ink)] hover:border-[var(--lx-primary)]/60 hover:bg-[var(--lx-canvas)] shadow-xs"
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--lx-primary)] text-[11px] font-black text-white">
                  {currentUser?.displayName ? currentUser.displayName.slice(0, 1).toUpperCase() : (currentUser?.email ? currentUser.email.slice(0, 1).toUpperCase() : "👤")}
                </span>
                <span className="font-bold">
                  {currentUser?.displayName || (currentUser?.email ? currentUser.email.split("@")[0] : t("nav.profile"))}
                </span>
              </Link>

              {currentUser ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  aria-label="Sign out"
                  className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
                    inverse ? "text-slate-300 hover:bg-white/10 hover:text-white" : "text-[var(--lx-muted)] hover:bg-[var(--lx-canvas)] hover:text-[var(--lx-ink)]"
                  }`}
                >
                  {t("nav.signOut")}
                </button>
              ) : (
                <Link
                  href="/login"
                  className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
                    inverse ? "text-slate-300 hover:bg-white/10 hover:text-white" : "text-[var(--lx-muted)] hover:bg-[var(--lx-canvas)] hover:text-[var(--lx-ink)]"
                  }`}
                >
                  {t("nav.signIn")}
                </Link>
              )}
            </div>

            {/* Mobile Account Popover Menu */}
            <div data-coach-account-menu className="relative sm:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="User account controls"
                aria-expanded={mobileMenuOpen}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lx-primary)] text-[11px] font-black text-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                {currentUser?.displayName ? currentUser.displayName.slice(0, 1).toUpperCase() : (currentUser?.email ? currentUser.email.slice(0, 1).toUpperCase() : "👤")}
              </button>
              {mobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-2 shadow-2xl z-50 animate-scale-in text-xs font-extrabold text-[var(--lx-ink)]">
                  <div className="px-3 py-1.5 border-b border-[var(--lx-border)] mb-1 text-[11px] text-[var(--lx-muted)] truncate">
                    {currentUser?.displayName || currentUser?.email || "Account"}
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[var(--lx-canvas)] transition"
                  >
                    <span>👤</span>
                    <span>{t("nav.profile")}</span>
                  </Link>
                  {currentUser ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        void handleSignOut();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left"
                    >
                      <span>🚪</span>
                      <span>{t("nav.signOut")}</span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[var(--lx-canvas)] transition"
                    >
                      <span>🔑</span>
                      <span>{t("nav.signIn")}</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        <nav
          aria-label="Coach mobile navigation"
          className="mx-auto flex w-full max-w-[1720px] gap-1 overflow-x-auto px-4 pb-2.5 pt-0.5 md:hidden"
        >
          {visibleNavItems.map((item) => {
            const isActive = active === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  isActive
                    ? inverse
                      ? "bg-white/20 text-[var(--lx-accent)]"
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
            <a href={urls.ecosystem} className="hover:text-[var(--lx-primary)] transition">
              Ecosystem
            </a>
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
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
