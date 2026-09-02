import Link from "next/link";
import { DocsMark } from "@lurexa/ui/DocsMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";

const sections = [
  ["Architecture", "/architecture"],
  ["Product", "/product"],
  ["Curriculum", "/curriculum"],
  ["Engineering", "/engineering"],
  ["Governance", "/governance"],
  ["Design", "/design"],
] as const;

export function DocsShell({ active, children }: { active?: string; children: React.ReactNode }) {
  return <div className="min-h-screen bg-[var(--lx-surface)] text-[var(--color-brand-navy)]">
    <header className="sticky top-0 z-50 border-b border-[var(--lx-surface)]/90 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1480px] items-center gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-secondary)]" aria-label="Lurexa Docs home">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[var(--lx-surface)] via-[var(--lx-canvas)] to-[var(--lx-surface)] shadow-[0_8px_20px_rgba(69,63,175,.10)]"><DocsMark compact /></span>
          <span><b className="block text-lg font-black tracking-[-.055em]">Lurexa <span className="text-[var(--lx-secondary)]">Docs</span></b><span className="hidden text-[10px] font-extrabold uppercase tracking-[.14em] text-[var(--lx-muted)] sm:block">Ecosystem knowledge base</span></span>
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex" aria-label="Documentation sections">{sections.map(([label,href])=><Link key={label} href={href} aria-current={active===label?"page":undefined} className={`rounded-xl px-3 py-2.5 text-sm font-extrabold transition ${active===label?"bg-[var(--lx-surface)] text-[var(--lx-primary)]":"text-[var(--lx-muted)] hover:bg-[var(--lx-surface)] hover:text-[var(--color-brand-navy)]"}`}>{label}</Link>)}</nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/search" aria-label="Search Lurexa Docs" className="inline-flex min-h-11 items-center rounded-xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] px-3.5 text-sm font-extrabold text-[var(--lx-secondary)] transition hover:border-[var(--lx-border)] hover:bg-white">
            <span aria-hidden="true">⌕</span>
            <span className="ml-2 hidden sm:inline">Search</span>
          </Link>
          <ThemeToggle />
          <EcosystemDropdown currentApp="docs" />
        </div>
      </div>
      <nav className="mx-auto flex max-w-[1480px] gap-2 overflow-x-auto px-5 pb-3 xl:hidden" aria-label="Documentation mobile sections">{sections.map(([label,href])=><Link key={label} href={href} aria-current={active===label?"page":undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-extrabold ${active===label?"border-[var(--lx-primary)] bg-[var(--lx-primary)] text-white":"border-[var(--lx-border)] bg-white text-[var(--lx-primary)]"}`}>{label}</Link>)}</nav>
    </header>
    {children}
    <footer className="border-t border-[var(--lx-surface)] bg-white"><div className="mx-auto grid max-w-[1480px] gap-6 px-5 py-9 sm:px-8 md:grid-cols-[1fr_auto] md:items-end"><div><DocsMark/><p className="mt-3 max-w-xl text-sm leading-6 text-[var(--lx-muted)]">A rendered and searchable view over the canonical repository documentation in <code>Docs/</code>.</p></div><div className="text-left md:text-right"><Link href="/search" className="text-sm font-extrabold text-[var(--lx-secondary)]">Search documentation →</Link><p className="mt-2 text-xs font-bold text-[var(--lx-muted)]">Lurexa Learning Technologies · Canonical-source documentation</p></div></div></footer>
  </div>;
}
