"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AuthService } from "@lurexa/backend";
import { ProductMark, type LurexaProduct } from "@lurexa/ui/ProductMark";

const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";

interface ProductShellProps { children: ReactNode; area: "Learner space" | "Educator space" | "Practice space" | "Creator space"; homeHref: string; product?: LurexaProduct; }

export function ProductShell({ children, area, homeHref, product = "learn" }: ProductShellProps) {
  const router = useRouter();
  async function signOut() { try { await AuthService.logout(); router.replace("/login"); } catch { window.alert("We could not sign you out. Please try again."); } }

  return <div className="min-h-screen bg-[var(--learn-canvas)] text-[var(--learn-ink)]">
    <header className="sticky top-0 z-30 border-b border-[#dfe7fb] bg-white/90 shadow-[0_8px_24px_rgba(32,52,128,.05)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3"><a href={homeHref} className="rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d5add] focus:ring-offset-2"><ProductMark product={product}/></a><span className="hidden h-6 w-px bg-[#dfe7fb] sm:block"/><span className="hidden text-[10px] font-extrabold uppercase tracking-[.18em] text-[#6677a5] sm:block">{area}</span></div>
        <nav aria-label="Account controls" className="flex items-center gap-2"><a href={ecosystemUrl} className="rounded-xl px-3 py-2 text-xs font-extrabold text-[#4b619b] transition hover:bg-[#eef3ff] hover:text-[#1d5add] sm:text-sm"><span className="hidden sm:inline">Lurexa ecosystem</span><span className="sm:hidden">Ecosystem</span></a><button type="button" onClick={signOut} className="rounded-xl border border-[#d7e0f6] bg-white px-3 py-2 text-xs font-extrabold text-[#334b87] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b6c8f4] hover:bg-[#f7f9ff] sm:px-3.5 sm:text-sm">Sign out</button></nav>
      </div>
    </header>{children}
  </div>;
}