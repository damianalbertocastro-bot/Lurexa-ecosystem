import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lurexa Studio — Learning Object Authoring & CEFR Governance",
  description:
    "Author, lint, and publish immutable CEFR-aligned learning objects and articulatory remediation activities across the Lurexa ecosystem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-black text-lg shadow-sm">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black tracking-tight text-slate-900">
                    Lurexa <span className="text-amber-600">Studio</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Authoring &amp; Governance
                  </span>
                </div>
              </Link>

              <nav className="hidden items-center gap-1 md:flex">
                <Link
                  href="/"
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/author"
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Author Workbench
                </Link>
                <Link
                  href="/catalog"
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Governed Catalog
                </Link>
                <Link
                  href="/linter"
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  CEFR Linter
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100/80 px-2.5 py-1 text-[11px] font-semibold text-slate-600 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Port 3006 · Core Connected</span>
              </div>

              <Link
                href="/author"
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700 active:scale-95"
              >
                + New Knowledge Object
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-slate-200 bg-white py-8 text-slate-600">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Lurexa Studio</span>
                <span className="text-xs text-slate-400">· Creative &amp; Constructive Layer</span>
              </div>
              <p className="text-xs text-slate-500">
                Lurexa Learning Technologies © 2026. Authoritative Knowledge Objects governed in Lurexa Core.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
