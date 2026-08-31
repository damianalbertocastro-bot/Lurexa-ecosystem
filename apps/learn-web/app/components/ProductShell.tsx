"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { AuthService } from "@lurexa/backend";
import { ProductMark, type LurexaProduct } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { CommandPalette } from "@lurexa/ui/CommandPalette";
import { useToast } from "@lurexa/ui/Toast";
import { Button } from "@lurexa/ui/button";

interface ProductShellProps { children: ReactNode; area: "Learner space" | "Educator space" | "Practice space" | "Creator space"; homeHref: string; product?: LurexaProduct; }

export function ProductShell({ children, area, homeHref, product = "learn" }: ProductShellProps) {
  const router = useRouter();
  const { toast } = useToast();
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

  return <div className="min-h-screen bg-[var(--learn-canvas)] text-[var(--learn-ink)]">
    <header className="sticky top-0 z-30 border-b border-[var(--lx-border)] bg-[var(--lx-surface)]/90 shadow-[0_8px_24px_rgba(32,52,128,.05)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3"><Link href={homeHref} aria-label={`${product === "learn" ? "Lurexa Learn" : `Lurexa ${product[0].toUpperCase()}${product.slice(1)}`} home`} className="rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--lx-focus-ring)] focus:ring-offset-2"><ProductMark product={product}/></Link><span className="hidden h-6 w-px bg-[var(--lx-border)] sm:block"/><span className="hidden text-[10px] font-extrabold uppercase tracking-[.18em] text-[var(--lx-muted)] sm:block">{area}</span></div>
        <nav aria-label="Account controls" className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Open command search palette"
            className="hidden items-center gap-2 rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3 py-1.5 text-xs font-semibold text-[var(--lx-muted)] shadow-sm transition hover:border-[var(--lx-border)] hover:text-[var(--lx-ink)] sm:inline-flex"
          >
            <span>Search</span>
            <kbd className="rounded bg-[var(--lx-canvas)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--lx-muted)] shadow-xs">
              ⌘K
            </kbd>
          </Button>
          <ThemeToggle />
          <EcosystemDropdown currentApp="learn" />
          <Button type="button" onClick={signOut} className="rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-2 text-xs font-extrabold text-[var(--lx-ink)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--lx-border)] hover:bg-[var(--lx-canvas)] sm:px-3.5 sm:text-sm">Sign out</Button>
        </nav>
      </div>
    </header>
    {children}
    <CommandPalette
      isOpen={commandPaletteOpen}
      onClose={() => setCommandPaletteOpen(false)}
      onNavigate={(href) => router.push(href)}
    />
  </div>;
}
