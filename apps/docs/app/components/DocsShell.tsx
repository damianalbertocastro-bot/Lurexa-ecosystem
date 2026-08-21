import { MasterMark } from "@lurexa/ui/MasterMark";

const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";
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
      <div className="mx-auto flex max-w-[1480px] items-center gap-5 px-5 py-3 sm:px-8">
        <a href="/" className="flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]" aria-label="Lurexa Docs home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#eee9ff] to-[#e7fbfa] text-[#592bd6]"><MasterMark compact /></span>
          <span><b className="block text-lg font-black tracking-[-.055em]">Lurexa <span className="text-[#315fd7]">Docs</span></b><span className="hidden text-[10px] font-extrabold uppercase tracking-[.14em] text-[#8190b7] sm:block">Ecosystem knowledge base</span></span>
        </a>
        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex" aria-label="Documentation sections">{sections.map(([label,href])=><a key={label} href={href} aria-current={active===label?"page":undefined} className={`rounded-xl px-3.5 py-2.5 text-sm font-extrabold transition ${active===label?"bg-[#eee9ff] text-[#592bd6]":"text-[#5d6f9d] hover:bg-[#f3f6ff] hover:text-[#071d67]"}`}>{label}</a>)}</nav>
        <a href={ecosystemUrl} className="ml-auto inline-flex min-h-11 items-center rounded-xl border border-[#d7e0f6] bg-white px-4 text-sm font-extrabold text-[#3450a8] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b8c7f1] hover:shadow-md">Ecosystem ↗</a>
      </div>
      <nav className="mx-auto flex max-w-[1480px] gap-2 overflow-x-auto px-5 pb-3 xl:hidden" aria-label="Documentation mobile sections">{sections.map(([label,href])=><a key={label} href={href} aria-current={active===label?"page":undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-extrabold ${active===label?"border-[#592bd6] bg-[#592bd6] text-white":"border-[#d7e0f6] bg-white text-[#3450a8]"}`}>{label}</a>)}</nav>
    </header>
    {children}
    <footer className="border-t border-[#dfe6f8] bg-white"><div className="mx-auto grid max-w-[1480px] gap-6 px-5 py-9 sm:px-8 md:grid-cols-[1fr_auto] md:items-end"><div><div className="flex items-center gap-2 text-[#592bd6]"><MasterMark compact/><b className="text-lg tracking-[-.04em]">Lurexa Docs</b></div><p className="mt-3 max-w-xl text-sm leading-6 text-[#6677a5]">The documentation layer for Lurexa architecture, products, curriculum, engineering, governance, and design.</p></div><p className="text-xs font-bold text-[#8a96b5]">Lurexa Learning Technologies · Source-aligned documentation</p></div></footer>
  </div>;
}
