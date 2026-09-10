"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { LanguageSelector } from "@lurexa/ui/LanguageSelector";
import { AuthService, type AuthenticatedUser } from "@lurexa/backend";
import { getEcosystemUrl } from "@lurexa/config/domains";
import { useTranslation } from "@lurexa/i18n";

type TelemetryTab = "tenants" | "mind" | "governance";

export default function AdminLandingPage() {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [activeTab, setActiveTab] = useState<TelemetryTab>("tenants");

  useEffect(() => {
    const unsub = AuthService.onUserChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const consoleHref = currentUser ? "/dashboard" : "/login";
  const consoleLabel = currentUser ? `${t("admin.openConsole")} →` : t("admin.adminConsole");

  return (
    <div className="min-h-screen bg-[#070e1c] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 1. Top-Left Far Utility Bar with Dual Access */}
      <div className="border-b border-white/10 bg-[#050b16]/90 backdrop-blur-md px-4 py-2 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={consoleHref}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 px-3 py-1 text-xs font-black tracking-wide text-indigo-200 transition"
              aria-label="Direct console access"
            >
              <span>🔐</span>
              <span>{consoleLabel}</span>
            </Link>

            <span className="hidden sm:inline-block h-3.5 w-px bg-white/15" />

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-slate-300">
                System Status: <span className="text-emerald-400">99.98% SLA Operational</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400 font-medium">
            <span>Region: <strong className="text-slate-200">US-East (Primary) + DR-Central</strong></span>
            <span className="h-3 w-px bg-white/15" />
            <span>Governance: <strong className="text-slate-200">Zero-Transcript LLM Policy</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a1931]/95 backdrop-blur-xl transition">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-8">
            <Link href="/" className="rounded-xl flex items-center gap-3" aria-label="Lurexa Admin Home">
              <ProductMark product="admin" inverse size="md" />
            </Link>

            <nav aria-label="Enterprise Navigation" className="hidden lg:flex items-center gap-1">
              <a
                href="#tenancy"
                className="rounded-xl px-3.5 py-2 text-xs font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Tenancy
              </a>
              <a
                href="#telemetry"
                className="rounded-xl px-3.5 py-2 text-xs font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {t("admin.navTelemetry")}
              </a>
              <a
                href="#rostering"
                className="rounded-xl px-3.5 py-2 text-xs font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {t("admin.navRostering")}
              </a>
              <a
                href="#security"
                className="rounded-xl px-3.5 py-2 text-xs font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {t("admin.navSecurity")}
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <LanguageSelector inverse />
            <ThemeToggle />
            <EcosystemDropdown currentApp="admin" inverse />

            <Link
              href={consoleHref}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 active:scale-95"
            >
              <span>{consoleLabel}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Hero Section with Deep Navy Gradient & Interactive Telemetry Card */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1931] via-[#0c1e3d] to-[#070e1c] pb-24 pt-16 sm:pt-20">
        {/* Subtle technical grid background effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero Titles & CTAs */}
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-950/60 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[.18em] text-indigo-300 shadow-inner">
              <span>🛡️</span>
              <span>{t("admin.eyebrow")}</span>
            </div>

            <h1 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl leading-[1.1]">
              {t("admin.title")}
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-300 font-medium">
              {t("admin.subtitle")}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href={consoleHref}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 px-6 py-3 text-sm font-black text-white shadow-xl shadow-indigo-600/30 transition hover:brightness-110 active:scale-95"
              >
                <span>{currentUser ? "Enter Admin Console →" : "Sign In to Admin Console →"}</span>
              </Link>
              <a
                href="#telemetry-card"
                className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-extrabold text-slate-200 transition hover:bg-white/15 hover:text-white"
              >
                <span>Inspect Live Telemetry</span>
                <span>↓</span>
              </a>
            </div>
          </div>

          {/* Interactive Real-Time Admin Telemetry Card */}
          <div
            id="telemetry-card"
            className="mx-auto max-w-4xl rounded-[32px] border border-white/15 bg-gradient-to-b from-[#112240]/90 to-[#0c182c]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
          >
            {/* Telemetry Card Header with Tab Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>
                <div>
                  <h3 className="text-base font-black text-white">Live Platform Health Stream</h3>
                  <p className="text-xs text-slate-400">Cryptographically signed observation telemetry</p>
                </div>
              </div>

              {/* Interactive Tabs */}
              <div className="flex rounded-xl bg-black/40 p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab("tenants")}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-black transition ${
                    activeTab === "tenants"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Tenants &amp; Seats
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("mind")}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-black transition ${
                    activeTab === "mind"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Mind Telemetry
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("governance")}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-black transition ${
                    activeTab === "governance"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Governance &amp; Privacy
                </button>
              </div>
            </div>

            {/* Tab 1: Tenants */}
            {activeTab === "tenants" && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Districts</p>
                    <b className="mt-1 block text-2xl font-black text-white">18</b>
                    <span className="text-[11px] font-semibold text-emerald-400">All Authorized</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Campuses</p>
                    <b className="mt-1 block text-2xl font-black text-white">94</b>
                    <span className="text-[11px] font-semibold text-indigo-300">Synchronized</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Seat Pool</p>
                    <b className="mt-1 block text-2xl font-black text-white">14,820</b>
                    <span className="text-[11px] font-semibold text-amber-300">86% Utilized</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">OneRoster Sync</p>
                    <b className="mt-1 block text-2xl font-black text-emerald-400">100%</b>
                    <span className="text-[11px] font-semibold text-slate-400">0 Sync Faults</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
                  <p className="text-xs font-black uppercase tracking-wider text-indigo-300">
                    Active District Deployments
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="font-bold text-slate-200">Santo Domingo Metro Public School District</span>
                      <span className="font-bold text-slate-400">4,200 seats · <span className="text-emerald-400">Live</span></span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="font-bold text-slate-200">Santiago Norte English Immersion Academy</span>
                      <span className="font-bold text-slate-400">2,850 seats · <span className="text-emerald-400">Live</span></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Boston-Dominican Dual Language Pilot</span>
                      <span className="font-bold text-slate-400">1,120 seats · <span className="text-emerald-400">Live</span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Mind Telemetry */}
            {activeTab === "mind" && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Projection p95</p>
                    <b className="mt-1 block text-2xl font-black text-emerald-400">22ms</b>
                    <span className="text-[11px] font-semibold text-slate-400">Real-time state</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">AI Quota Burn</p>
                    <b className="mt-1 block text-2xl font-black text-white">68%</b>
                    <span className="text-[11px] font-semibold text-indigo-300">Optimal envelope</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Event Stream</p>
                    <b className="mt-1 block text-2xl font-black text-white">3,420</b>
                    <span className="text-[11px] font-semibold text-slate-400">events / min</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Speech Model</p>
                    <b className="mt-1 block text-2xl font-black text-indigo-400">v2.4</b>
                    <span className="text-[11px] font-semibold text-emerald-400">Dominican L1 Active</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
                  <p className="text-xs font-black uppercase tracking-wider text-indigo-300">
                    Mind Real-Time Adaptation Pipeline
                  </p>
                  <p className="text-xs leading-relaxed text-slate-300">
                    Lurexa Mind produces zero-latency adaptive recommendations and phoneme diagnostics
                    without mutating raw learner identity. Authorized evidence flows continuously into
                    Lurexa Core records with complete cryptographic provenance.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Governance */}
            {activeTab === "governance" && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">LLM Privacy</p>
                    <b className="mt-1 block text-2xl font-black text-emerald-400">Zero-Log</b>
                    <span className="text-[11px] font-semibold text-slate-400">No training data</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Deletion Queue</p>
                    <b className="mt-1 block text-2xl font-black text-white">0</b>
                    <span className="text-[11px] font-semibold text-emerald-400">Clean slate</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tenant Isolation</p>
                    <b className="mt-1 block text-2xl font-black text-emerald-400">5 / 5</b>
                    <span className="text-[11px] font-semibold text-slate-400">Passed checks</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">FERPA / COPPA</p>
                    <b className="mt-1 block text-2xl font-black text-indigo-400">Verified</b>
                    <span className="text-[11px] font-semibold text-slate-400">Annual audit</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
                  <p className="text-xs font-black uppercase tracking-wider text-indigo-300">
                    Master Deletion &amp; Data Subject Guarantee
                  </p>
                  <p className="text-xs leading-relaxed text-slate-300">
                    When an authorized district superadmin executes a master student or tenant purge,
                    all Firestore records, audio recordings, adaptation weights, and vector projections
                    are permanently destroyed across all operational nodes with verifiable proof.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Feature Capabilities Section */}
      <section id="tenancy" className="border-t border-white/10 bg-[#060c18] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[.2em] text-indigo-400">
              ENTERPRISE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-[-0.04em] text-white">
              Engineered for district-scale deployment.
            </h2>
            <p className="text-sm leading-relaxed text-slate-400 font-medium">
              Every Lurexa product—Learn, Coach, Teach, and Studio—operates under
              strict centralized Core governance, role isolation, and real-time telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-3xl border border-white/10 bg-[#0b162c] p-6 space-y-4 hover:border-indigo-500/50 transition">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600/20 text-2xl text-indigo-400 border border-indigo-500/30">
                🏢
              </span>
              <h3 className="text-lg font-black text-white">Multi-Tenant Management</h3>
              <p className="text-xs leading-relaxed text-slate-400 font-medium">
                Administer individual school districts, grant campus seat pools,
                toggle institution status instantly, and isolate student directories
                under strict domain boundaries.
              </p>
            </div>

            {/* Feature 2 */}
            <div id="telemetry" className="rounded-3xl border border-white/10 bg-[#0b162c] p-6 space-y-4 hover:border-indigo-500/50 transition">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600/20 text-2xl text-blue-400 border border-blue-500/30">
                📊
              </span>
              <h3 className="text-lg font-black text-white">Core Telemetry &amp; Quotas</h3>
              <p className="text-xs leading-relaxed text-slate-400 font-medium">
                Continuous instrumentation of Lurexa Mind AI inference, token budgets,
                p95 projection latency, and learning pipeline throughput with zero
                synthetic guesswork.
              </p>
            </div>

            {/* Feature 3 */}
            <div id="rostering" className="rounded-3xl border border-white/10 bg-[#0b162c] p-6 space-y-4 hover:border-indigo-500/50 transition">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600/20 text-2xl text-emerald-400 border border-emerald-500/30">
                🔄
              </span>
              <h3 className="text-lg font-black text-white">Enterprise Rostering (SIS)</h3>
              <p className="text-xs leading-relaxed text-slate-400 font-medium">
                Seamless synchronization with OneRoster v1.2, Google Classroom, and
                district SIS feeds with automatic role provision, invite token generation,
                and class roster verification.
              </p>
            </div>

            {/* Feature 4 */}
            <div id="security" className="rounded-3xl border border-white/10 bg-[#0b162c] p-6 space-y-4 hover:border-indigo-500/50 transition">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-600/20 text-2xl text-rose-400 border border-rose-500/30">
                🗑️
              </span>
              <h3 className="text-lg font-black text-white">Master Privacy &amp; Deletion</h3>
              <p className="text-xs leading-relaxed text-slate-400 font-medium">
                Zero-retention LLM privacy contracts, complete GDPR/FERPA right-to-be-forgotten
                cascading deletion, and immutable cryptographic provenance logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Enterprise Banner & Footer */}
      <section className="border-t border-white/10 bg-gradient-to-br from-[#0c1a34] via-[#091428] to-[#050b16] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-white/15 bg-gradient-to-r from-indigo-900/40 via-blue-900/30 to-indigo-950/40 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Ready to govern your district&apos;s English learning ecosystem?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
                Access the operational admin console, manage tenant subscriptions,
                review real-time telemetry, or configure district-wide SIS rosters.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href={consoleHref}
                className="rounded-xl bg-white px-5 py-3 text-xs font-black text-slate-950 shadow-lg transition hover:bg-slate-100 active:scale-95"
              >
                {consoleLabel}
              </Link>
              <Link
                href="/profile"
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-black text-white transition hover:bg-white/15"
              >
                Superadmin Profile
              </Link>
            </div>
          </div>

          <footer className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-4">
              <ProductMark product="admin" inverse size="sm" />
              <span>© {new Date().getFullYear()} Lurexa Learning Technologies Inc. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-5 text-slate-400">
              <Link href="/dashboard" className="hover:text-white transition">Console</Link>
              <Link href="/profile" className="hover:text-white transition">Profile</Link>
              <a href={getEcosystemUrl("learn")} className="hover:text-white transition">Lurexa Learn</a>
              <a href={getEcosystemUrl("coach")} className="hover:text-white transition">Lurexa Coach</a>
              <a href={getEcosystemUrl("teach")} className="hover:text-white transition">Lurexa Teach</a>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
