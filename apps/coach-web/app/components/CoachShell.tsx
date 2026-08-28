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
  const ecosystemLinks = [
    ["Lurexa", urls.ecosystem],
    ["Learn", urls.learn],
    ["Teach", urls.teach],
  ] as const;

  return <div className="min-h-screen bg-[#f5fbff] text-[#071d67]">
    <header className="sticky top-0 z-40 border-b border-[#dbeaf5] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-4 sm:px-8">
        <Link href="/" aria-label="Lurexa Coach home"><ProductMark product="coach" /></Link>
        <nav aria-label="Coach navigation" className="hidden items-center gap-1 lg:flex">
          {nav.map(([label, href]) => <Link key={label} href={href} className={`rounded-xl px-3.5 py-2 text-sm font-extrabold transition ${active === label ? "bg-[#eee8ff] text-[#5c2ac7]" : "text-[#52689b] hover:bg-[#f3f7ff] hover:text-[#071d67]"}`}>{label}</Link>)}
        </nav>
        <div className="flex items-center gap-1.5">
          <div className="hidden items-center gap-1 sm:flex" aria-label="Lurexa products">
            {ecosystemLinks.map(([label, href]) => <a key={label} href={href} className="rounded-xl px-3 py-2 text-xs font-extrabold text-[#4560a1] transition hover:bg-[#f3f7ff] hover:text-[#071d67]">{label}</a>)}
          </div>
          <Link href="/dashboard" className="hidden min-h-10 items-center rounded-xl border border-[#d7e0f6] px-4 text-xs font-black text-[#315fd7] md:inline-flex">Dashboard</Link>
          <Link href="/login" className="inline-flex min-h-10 items-center rounded-xl bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] px-4 text-xs font-black text-white">Sign in</Link>
        </div>
      </div>
      <nav aria-label="Coach mobile navigation" className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-4 pb-3 lg:hidden">
        {nav.map(([label, href]) => <Link key={label} href={href} className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-extrabold ${active === label ? "bg-[#eee8ff] text-[#5c2ac7]" : "text-[#52689b]"}`}>{label}</Link>)}
        {ecosystemLinks.map(([label, href]) => <a key={label} href={href} className="whitespace-nowrap rounded-xl px-3 py-2 text-xs font-extrabold text-[#4560a1]">{label}</a>)}
      </nav>
    </header>
    {children}
  </div>;

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
