"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { CommandPalette } from "@lurexa/ui/CommandPalette";
import { useTeachAuth } from "./TeachAuthProvider";
import { Button } from "@lurexa/ui/button";

const nav = [
  ["Home", "/"],
  ["Dashboard", "/dashboard"],
  ["Learning", "/courses"],
  ["Growth Plan", "/growth-plan"],
  ["Evidence", "/growth"],
  ["Community", "/community"],
  ["Assessment", "/assessment"],
  ["Credentials", "/certifications"],
] as const;

export function TeachShell({ active, children }: { active: string; children: React.ReactNode }) {
  const { user, profile, loading, logout } = useTeachAuth();
  const router = useRouter();
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

  const signOut = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-[var(--teach-mist)] text-[var(--teach-ink)]">
      <header className="sticky top-0 z-40 border-b border-[var(--lx-border)] bg-[var(--lx-surface)]/90 backdrop-blur-xl shadow-xs">
        <div className="mx-auto flex max-w-[1440px] items-center gap-5 px-5 py-3 sm:px-8">
          <Link
            href="/"
            aria-label="Lurexa Teach home"
            className="shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-secondary)]"
          >
            <ProductMark product="teach" className="hidden sm:inline-flex" />
            <ProductMark product="teach" compact className="sm:hidden" />
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
            aria-label="Lurexa Teach navigation"
          >
            {nav.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                aria-current={active === label ? "page" : undefined}
                className={`rounded-xl px-3.5 py-2 text-xs font-black transition ${
                  active === label
                    ? "bg-[var(--lx-canvas)] text-[var(--lx-primary)] shadow-xs"
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
              <kbd className="rounded bg-[var(--lx-canvas)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--lx-muted)] shadow-xs">
                ⌘K
              </kbd>
            </Button>

            <ThemeToggle />
            <EcosystemDropdown currentApp="teach" />

            {!loading && user ? (
              <>
                <Link
                  href="/profile"
                  aria-label="My profile"
                  className="inline-flex min-h-10 items-center rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 text-xs font-extrabold text-[var(--lx-ink)] sm:px-4"
                >
                  <span className="sm:hidden" aria-hidden="true">◉</span>
                  <span className="hidden sm:inline">{profile?.displayName || "My profile"}</span>
                </Link>
                <Button
                  type="button"
                  onClick={signOut}
                  aria-label="Sign out"
                  className="min-h-10 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 text-xs font-extrabold text-[var(--lx-ink)] hover:bg-[var(--lx-canvas)] sm:px-4 transition"
                >
                  <span className="sm:hidden" aria-hidden="true">↗</span>
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-10 items-center rounded-xl bg-gradient-to-br from-[var(--lx-primary)] to-[var(--lx-secondary)] px-3 text-xs font-extrabold text-white shadow-md sm:px-4"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        <nav
          className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-5 pb-3 lg:hidden"
          aria-label="Lurexa Teach mobile navigation"
        >
          {nav.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              aria-current={active === label ? "page" : undefined}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-extrabold ${
                active === label
                  ? "border-[var(--lx-primary)] bg-[var(--lx-primary)] text-white"
                  : "border-[var(--lx-border)] bg-[var(--lx-surface)] text-[var(--lx-muted)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      {children}

      <footer className="border-t border-[var(--lx-border)] bg-[var(--lx-surface)]">
        <div className="mx-auto grid max-w-[1440px] gap-7 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto]">
          <div>
            <ProductMark product="teach" />
            <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--lx-muted)]">
              Grow your language, teaching practice, professional evidence, and professional network in one connected educator-development experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-[var(--lx-muted)]">
            <Link href="/growth-plan">Growth plan</Link>
            <Link href="/courses">Professional learning</Link>
            <Link href="/growth">Evidence</Link>
            <Link href="/community">Community</Link>
            <Link href="/assessment">Assessment</Link>
            <Link href="/certifications">Credentials</Link>
            <a href={ecosystemUrl}>Lurexa ecosystem ↗</a>
          </div>
        </div>
      </footer>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(href) => router.push(href)}
      />
    </div>
  );
}
