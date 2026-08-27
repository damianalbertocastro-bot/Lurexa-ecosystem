import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { resolveLurexaPublicUrls } from "@lurexa/config/product-urls";

const nav = [
  ["Home", "/"],
  ["Dashboard", "/dashboard"],
  ["Practice", "/practice"],
  ["Pronunciation", "/pronunciation"],
  ["History", "/history"],
  ["Educators", "/educator"],
] as const;

export function CoachShell({ children, active }: { children: React.ReactNode; active?: string }) {
  const urls = resolveLurexaPublicUrls();
  return <div className="min-h-screen bg-[#f5fbff] text-[#071d67]">
    <header className="sticky top-0 z-40 border-b border-[#dbeaf5] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-4 sm:px-8">
        <Link href="/" aria-label="Lurexa Coach home"><ProductMark product="coach" /></Link>
        <nav aria-label="Coach navigation" className="hidden items-center gap-1 lg:flex">
          {nav.map(([label, href]) => <Link key={label} href={href} className={`rounded-xl px-3.5 py-2 text-sm font-extrabold transition ${active === label ? "bg-[#eee8ff] text-[#5c2ac7]" : "text-[#52689b] hover:bg-[#f3f7ff] hover:text-[#071d67]"}`}>{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <a href={urls.learn} className="hidden rounded-xl px-3 py-2 text-xs font-extrabold text-[#4560a1] sm:inline-flex">Learn</a>
          <a href={urls.teach} className="hidden rounded-xl px-3 py-2 text-xs font-extrabold text-[#4560a1] sm:inline-flex">Teach</a>
          <Link href="/login" className="inline-flex min-h-10 items-center rounded-xl bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] px-4 text-xs font-black text-white">Sign in</Link>
        </div>
      </div>
      <nav aria-label="Coach mobile navigation" className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-4 pb-3 lg:hidden">
        {nav.map(([label, href]) => <Link key={label} href={href} className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-extrabold ${active === label ? "bg-[#eee8ff] text-[#5c2ac7]" : "text-[#52689b]"}`}>{label}</Link>)}
      </nav>
    </header>
    {children}
  </div>;
}
