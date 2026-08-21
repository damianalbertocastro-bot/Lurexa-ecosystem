"use client";

import { useRouter } from "next/navigation";
import { MasterMark } from "@lurexa/ui/MasterMark";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { useTeachAuth } from "./TeachAuthProvider";

const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";
const nav = [
  ["Home", "/"], ["Dashboard", "/dashboard"], ["Learn", "/courses"], ["Community", "/community"], ["Growth", "/growth"], ["Credentials", "/certifications"],
] as const;

export function TeachShell({ active, children }: { active: string; children: React.ReactNode }) {
  const { user, profile, loading, logout } = useTeachAuth();
  const router = useRouter();
  const signOut = async () => { await logout(); router.replace("/"); };

  return <div className="min-h-screen bg-[#f5f7ff] text-[#0b1f5f]">
    <header className="sticky top-0 z-40 border-b border-[#dfe6f8]/90 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center gap-5 px-5 py-3 sm:px-8">
        <a href="/" aria-label="Lurexa Teach home" className="shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]"><ProductMark product="teach" /></a>
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Lurexa Teach navigation">{nav.map(([label,href])=><a key={label} href={href} aria-current={active===label?"page":undefined} className={`rounded-xl px-3.5 py-2.5 text-sm font-extrabold transition ${active===label?"bg-[#eee9ff] text-[#592bd6]":"text-[#596b9c] hover:bg-[#f3f6ff] hover:text-[#071d67]"}`}>{label}</a>)}</nav>
        <div className="ml-auto flex items-center gap-2">
          <a href={ecosystemUrl} aria-label="Lurexa ecosystem" className="grid h-11 w-11 place-items-center rounded-xl border border-[#dfe6f8] bg-white text-[#592bd6] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><MasterMark compact /></a>
          {!loading && user ? <><a href="/profile" className="hidden min-h-11 items-center rounded-xl border border-[#dfe6f8] bg-white px-4 text-sm font-extrabold text-[#30457f] sm:inline-flex">{profile?.displayName || "My profile"}</a><button type="button" onClick={signOut} className="hidden min-h-11 rounded-xl bg-[#071d67] px-4 text-sm font-extrabold text-white sm:block">Sign out</button></> : <a href="/login" className="hidden min-h-11 items-center rounded-xl bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] px-4 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(71,65,190,.22)] sm:inline-flex">Sign in</a>}
        </div>
      </div>
      <nav className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-5 pb-3 lg:hidden" aria-label="Lurexa Teach mobile navigation">{nav.map(([label,href])=><a key={label} href={href} aria-current={active===label?"page":undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-extrabold ${active===label?"border-[#592bd6] bg-[#592bd6] text-white":"border-[#d7e0f6] bg-white text-[#3450a8]"}`}>{label}</a>)}</nav>
    </header>
    {children}
    <footer className="border-t border-[#dfe6f8] bg-white"><div className="mx-auto grid max-w-[1440px] gap-7 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto]"><div><ProductMark product="teach"/><p className="mt-4 max-w-xl text-sm leading-6 text-[#6677a5]">Grow your language, teaching practice, professional evidence, and professional network in one connected educator experience.</p></div><div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-[#53679f]"><a href="/courses">Learning</a><a href="/community">Community</a><a href="/growth">Growth</a><a href="/certifications">Credentials</a><a href={ecosystemUrl}>Lurexa ecosystem ↗</a></div></div></footer>
  </div>;
}
