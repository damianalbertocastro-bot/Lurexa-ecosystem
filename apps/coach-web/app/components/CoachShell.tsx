"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { CommandPalette } from "@lurexa/ui/CommandPalette";
import { resolveLurexaPublicUrls } from "@lurexa/config/product-urls";
import { AuthService, type AuthenticatedUser } from "@lurexa/backend";

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
  const router = useRouter();
  const urls = resolveLurexaPublicUrls();
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

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
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Action Area */}
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
              <span>Search</span>
              <kbd className={`rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                inverse
                  ? "border-white/20 bg-white/10 text-slate-300"
                  : "border-[var(--lx-border)] bg-[var(--lx-surface)] text-[var(--lx-muted)]"
              }`}>
                ⌘K
              </kbd>
            </button>

            <ThemeToggle />
            <EcosystemDropdown currentApp="coach" inverse={inverse} />

            <Link
              href="/practice"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--lx-accent)] to-[var(--lx-accent)] px-3.5 py-2 text-xs font-black text-slate-900 shadow-xs transition hover:brightness-105 active:scale-95 shrink-0"
            >
              <span>🎙️</span>
              <span className="hidden sm:inline">Quick Practice</span>
              <span className="sm:hidden">Practice</span>
            </Link>

            {/* Profile Button */}
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
              <span className="hidden sm:inline font-bold">
                {currentUser?.displayName || (currentUser?.email ? currentUser.email.split("@")[0] : "Profile")}
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
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
                  inverse ? "text-slate-300 hover:bg-white/10 hover:text-white" : "text-[var(--lx-muted)] hover:bg-[var(--lx-canvas)] hover:text-[var(--lx-ink)]"
                }`}
              >
                Sign in
              </Link>
            )}
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
