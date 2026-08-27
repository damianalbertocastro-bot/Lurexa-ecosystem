import Link from "next/link";
import { DocsMark } from "@lurexa/ui/DocsMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { getEcosystemUrl } from "@lurexa/config/domains";

const ecosystemUrl = getEcosystemUrl("root");
const sections = [
  ["Architecture", "/architecture"],
  ["Product", "/product"],
  ["Curriculum", "/curriculum"],
  ["Engineering", "/engineering"],
  ["Governance", "/governance"],
  ["Design", "/design"],
] as const;

export function DocsShell({ active, children }: { active?: string; children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f5f7ff] text-[#071d67]">
    <header className="sticky top-0 z-50 border-b border-[#dfe6f8]/90 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1480px] items-center gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]" aria-label="Lurexa Docs home">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#f0ecff] via-white to-[#e4fbf8] shadow-[0_8px_20px_rgba(69,63,175,.10)]"><DocsMark compact /></span>
          <span><b className="block text-lg font-black tracking-[-.055em]">Lurexa <span className="text-[#315fd7]">Docs</span></b><span className="hidden text-[10px] font-extrabold uppercase tracking-[.14em] text-[#8190b7] sm:block">Ecosystem knowledge base</span></span>
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex" aria-label="Documentation sections">{sections.map(([label,href])=><Link key={label} href={href} aria-current={active===label?"page":undefined} className={`rounded-xl px-3 py-2.5 text-sm font-extrabold transition ${active===label?"bg-[#eee9ff] text-[#592bd6]":"text-[#5d6f9d] hover:bg-[#f3f6ff] hover:text-[#071d67]"}`}>{label}</Link>)}</nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/search" aria-label="Search Lurexa Docs" className="inline-flex min-h-11 items-center rounded-xl border border-[#d7e0f6] bg-[#f8faff] px-3.5 text-sm font-extrabold text-[#315fd7] transition hover:border-[#b8c7f1] hover:bg-white">
            <span aria-hidden="true">⌕</span>
            <span className="ml-2 hidden sm:inline">Search</span>
          </Link>
          <EcosystemDropdown currentApp="docs" />
          <a href={ecosystemUrl} rel="noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-[#d7e0f6] bg-white px-3.5 text-sm font-extrabold text-[#3450a8] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b8c7f1] hover:shadow-md">
            Ecosystem ↗
          </a>
        </div>
      </div>
      <nav className="mx-auto flex max-w-[1480px] gap-2 overflow-x-auto px-5 pb-3 xl:hidden" aria-label="Documentation mobile sections">{sections.map(([label,href])=><Link key={label} href={href} aria-current={active===label?"page":undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-extrabold ${active===label?"border-[#592bd6] bg-[#592bd6] text-white":"border-[#d7e0f6] bg-white text-[#3450a8]"}`}>{label}</Link>)}</nav>
    </header>
    {children}
    <footer className="border-t border-[#dfe6f8] bg-white"><div className="mx-auto grid max-w-[1480px] gap-6 px-5 py-9 sm:px-8 md:grid-cols-[1fr_auto] md:items-end"><div><DocsMark/><p className="mt-3 max-w-xl text-sm leading-6 text-[#4d5e8c]">A rendered and searchable view over the canonical repository documentation in <code>Docs/</code>.</p></div><div className="text-left md:text-right"><Link href="/search" className="text-sm font-extrabold text-[#315fd7]">Search documentation →</Link><p className="mt-2 text-xs font-bold text-[#8a96b5]">Lurexa Learning Technologies · Canonical-source documentation</p></div></div></footer>
  </div>;
}
