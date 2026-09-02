"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { Button } from "@lurexa/ui/button";
import { Badge } from "@lurexa/ui/Badge";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";
import { ThemeToggle } from "@lurexa/ui/ThemeToggle";
import { getEcosystemUrl } from "@lurexa/config/domains";

const ecosystemUrl = getEcosystemUrl("root");

const PRODUCTS = [
  {
    id: "learn",
    name: "Lurexa Learn",
    url: "http://localhost:3000",
    desc: "Primary learner platform: A1–C2 interactive lessons, roleplay simulator, diagnostic placement test, and teacher delivery.",
    roleCapability: "Access all courses, preview lessons, test placement diagnostics, and oversee classes.",
    color: "from-indigo-600 to-blue-700",
  },
  {
    id: "coach",
    name: "Lurexa Coach",
    url: "http://localhost:3002",
    desc: "AI spoken English & pronunciation coach: Live acoustic speech analyzer, phonetics workouts, Dominican L1 transfer remediation.",
    roleCapability: "Access speaking acoustic studio, test voice probes, and inspect phonemic diagnostic profiles.",
    color: "from-teal-600 to-emerald-700",
  },
  {
    id: "teach",
    name: "Lurexa Teach",
    url: "http://localhost:3005",
    desc: "Educator professional development: Teacher diagnostic placement, CEFR growth courses, T1–T5 credentials, and educator approvals.",
    roleCapability: "Review educator approval requests, inspect teacher growth trajectories, and award credentials.",
    color: "from-violet-600 to-purple-800",
  },
  {
    id: "insight",
    name: "Lurexa Insight",
    url: "http://localhost:3003",
    desc: "Institutional learning intelligence: Campus cohort analytics, proficiency progression tracking, and privacy-preserved metrics.",
    roleCapability: "View platform-wide institutional analytics, macro CEFR distribution, and campus engagement metrics.",
    color: "from-cyan-600 to-sky-800",
  },
  {
    id: "studio",
    name: "Lurexa Studio",
    url: "http://localhost:3001",
    desc: "Curriculum authoring & instructional design: Knowledge Object builder, lesson schema generator, publication pipelines.",
    roleCapability: "Create and publish official ecosystem curriculum, modify modules, and review drafted knowledge objects.",
    color: "from-amber-600 to-orange-700",
  },
  {
    id: "admin",
    name: "Lurexa Admin",
    url: "http://localhost:3004",
    desc: "Ecosystem master operations: User directory, master data pruning, tenant license billing, and platform audit logs.",
    roleCapability: "Full root authority: user management, data reset, file deletion, and platform governance.",
    color: "from-slate-800 to-slate-950",
  },
] as const;

export default function AdminToolsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] text-[var(--lx-ink)]">
      {/* Top Header */}
      <section className="border-b border-white/10 bg-gradient-to-br from-[var(--color-brand-navy)] via-[var(--color-brand-navy-light)] to-[var(--lx-secondary)] text-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <a href={ecosystemUrl} rel="noreferrer" className="rounded-xl">
              <ProductMark product="admin" inverse />
            </a>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">Superadmin</Badge>
              <Link href="/" className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 hover:bg-white/10 hover:text-white">
                Overview
              </Link>
              <Link href="/users" className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-100 hover:bg-white/10 hover:text-white">
                Users &amp; Profiles
              </Link>
              <Link href="/tools" className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-black text-white">
                Ecosystem Tools
              </Link>
              <Link href="/data-management" className="rounded-xl px-3 py-1.5 text-xs font-extrabold text-rose-200 hover:bg-rose-500/20 hover:text-white">
                Master Deletion 🗑️
              </Link>
              <ThemeToggle />
              <EcosystemDropdown currentApp="admin" inverse />
              <Button
                type="button"
                onClick={async () => {
                  await AuthService.logout();
                  router.replace("/login");
                }}
                className="min-h-10 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-white hover:text-[var(--color-brand-navy)]"
              >
                Sign out
              </Button>
            </div>
          </header>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-300">
              Platform Master Launchpad
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Ecosystem Tools &amp; Products
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-indigo-100">
              As Superadmin, your authenticated session carries sovereign root authority across all products in the Lurexa ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Grid of Products */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((prod) => (
            <article
              key={prod.id}
              className="flex flex-col justify-between rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-sm transition hover:border-[var(--lx-primary)]/50 hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <ProductMark product={prod.id as any} />
                  <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-violet-800">
                    Superadmin SSO
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-black text-[var(--lx-ink)]">{prod.name}</h2>
                  <p className="mt-1 text-xs text-[var(--lx-muted)] leading-relaxed">{prod.desc}</p>
                </div>

                <div className="rounded-2xl bg-[var(--lx-canvas)] p-3 border border-[var(--lx-border)]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--lx-primary)]">
                    Superadmin Authority:
                  </p>
                  <p className="mt-1 text-xs text-[var(--lx-ink)]">{prod.roleCapability}</p>
                </div>
              </div>

              <div className="pt-6">
                <a
                  href={prod.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full"
                >
                  <Button
                    type="button"
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-2.5 text-xs font-bold text-white hover:from-indigo-500 hover:to-indigo-600 shadow-sm"
                  >
                    Open {prod.name} ↗
                  </Button>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
