import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lurexa Insight — Institutional Learning Analytics & Phonemic Intelligence",
  description: "Enterprise cohort diagnostics, phonemic error heatmaps, and instructional intervention routing.",
};

export default function InsightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-indigo-400 font-bold text-lg hover:opacity-90 transition">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 font-black ring-1 ring-indigo-500/30">
                  IN
                </span>
                <span>Lurexa <span className="text-white">Insight</span></span>
              </Link>

              <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
                <Link href="/" className="rounded-md px-3 py-1.5 hover:bg-slate-800/70 hover:text-white transition">
                  Overview
                </Link>
                <Link href="/cohorts" className="rounded-md px-3 py-1.5 hover:bg-slate-800/70 hover:text-white transition">
                  Phonemic Heatmaps
                </Link>
                <Link href="/interventions" className="rounded-md px-3 py-1.5 hover:bg-slate-800/70 hover:text-white transition">
                  Intervention Routing
                </Link>
                <Link href="/reports" className="rounded-md px-3 py-1.5 hover:bg-slate-800/70 hover:text-white transition">
                  Milestone Reports
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400 ring-1 ring-indigo-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Port 3007
              </span>

              <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-800 pl-3">
                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
                >
                  Learn (3001)
                </a>
                <a
                  href="http://localhost:3002"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
                >
                  Coach (3002)
                </a>
                <a
                  href="http://localhost:3006"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
                >
                  Studio (3006)
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-slate-800/80 bg-slate-950 px-4 py-6 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Lurexa Learning Technologies. All rights reserved.</p>
            <p className="text-slate-400">
              Lurexa Insight is governed by <span className="text-indigo-400 font-medium">Lurexa Core</span> authoritative evidence contracts.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
