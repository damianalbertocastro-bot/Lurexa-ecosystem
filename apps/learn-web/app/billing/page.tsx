"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@lurexa/ui/button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { SUBSCRIPTION_PRICING_PLANS, DEFAULT_TIER_QUOTAS, type SubscriptionTier } from "@lurexa/types";

function BillingContent() {
  const searchParams = useSearchParams();
  const recommendedTier = searchParams.get("recommendedTier") as SubscriptionTier | null;
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(recommendedTier || "PLUS");
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  const plans: Array<{
    tier: SubscriptionTier;
    name: string;
    monthlyPrice: number;
    annualMonthlyPrice: number;
    popular?: boolean;
    description: string;
    highlights: string[];
    quotas: typeof DEFAULT_TIER_QUOTAS[SubscriptionTier];
  }> = [
    {
      tier: "BASIC",
      name: "Lurexa Basic",
      monthlyPrice: 0,
      annualMonthlyPrice: 0,
      description: "Free level placement and core foundational trial lessons.",
      highlights: [
        "Oral CEFR diagnostic placement",
        "3 level-matched trial modules",
        "40 AI tutor conversational turns/mo",
        "15 Coach voice minutes/mo",
        "Standard latency cloud processing",
      ],
      quotas: DEFAULT_TIER_QUOTAS.BASIC,
    },
    {
      tier: "PLUS",
      name: "Lurexa Plus",
      monthlyPrice: 9.99,
      annualMonthlyPrice: 8.25,
      popular: true,
      description: "High-volume speaking practice with live Dominican phonemic feedback.",
      highlights: [
        "120 Coach voice minutes / month",
        "200 AI conversational turns / month",
        "Live acoustic waveform and phonetic alignment",
        "Targeted Dominican /s/ cluster and coda drills",
        "1 full offline module caching",
        "Access to 1 Specialized Career Track (BPO)",
      ],
      quotas: DEFAULT_TIER_QUOTAS.PLUS,
    },
    {
      tier: "ULTRA",
      name: "Lurexa Ultra",
      monthlyPrice: 19.99,
      annualMonthlyPrice: 16.5,
      description: "Full ecosystem access powered by the real-time Universal Learner Model.",
      highlights: [
        "300+ Coach voice minutes / month with streaming audio",
        "1,000 AI conversational turns / month",
        "Universal Learner Model: real-time Coach ↔ Learn error sync",
        "Unrestricted access to all Specialized Career Tracks",
        "Unlimited offline module downloads & background sync",
        "B1/B2 Capstone Project oral evaluations",
        "Educator qualification & Lurexa Teach synchrony",
      ],
      quotas: DEFAULT_TIER_QUOTAS.ULTRA,
    },
    {
      tier: "ENTERPRISE",
      name: "Campus & Enterprise",
      monthlyPrice: 49.99,
      annualMonthlyPrice: 39.99,
      description: "Institutional deployment with cohort telemetry and instructor analytics.",
      highlights: [
        "1,500+ voice minutes / month",
        "5,000 AI turns / month",
        "Lurexa Insight cohort phonemic error radar",
        "Institutional curriculum authoring with Studio",
        "Dedicated pedagogical SLA and SAML SSO",
      ],
      quotas: DEFAULT_TIER_QUOTAS.ENTERPRISE,
    },
  ];

  const handleSelectPlan = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setUpgradeSuccess(`Plan preference updated to ${tier} (${billingCycle}). Your subscription quota is active.`);
  };

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] px-4 py-10 sm:px-8 text-[var(--lx-ink)]">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--lx-border)] pb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <ProductMark product="learn" size="sm" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-brand-navy)]">
                Plans &amp; Subscription Benefits
              </h1>
              <p className="text-xs text-[var(--lx-muted)]">
                Transparent pricing built for individuals, Caribbean learners, and educational institutions.
              </p>
            </div>
          </div>

          <Link href="/dashboard">
            <Button variant="secondary" size="sm">
              ← Back to Dashboard
            </Button>
          </Link>
        </header>

        {upgradeSuccess && (
          <div
            role="status"
            className="rounded-2xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-4 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-4 shadow-sm animate-fade-slide-up"
          >
            <span>✓ {upgradeSuccess}</span>
            <button
              type="button"
              onClick={() => setUpgradeSuccess(null)}
              className="text-xs underline hover:no-underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="inline-flex items-center rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-xl px-5 py-2 text-xs font-black transition ${
                billingCycle === "monthly"
                  ? "bg-[var(--lx-primary)] text-white shadow-sm"
                  : "text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`rounded-xl px-5 py-2 text-xs font-black transition flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-[var(--lx-primary)] text-white shadow-sm"
                  : "text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
              }`}
            >
              <span>Annual Billing</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                Save 20%
              </span>
            </button>
          </div>
          <p className="text-[11px] font-medium text-[var(--lx-muted)]">
            All plans include continuous CEFR adaptation and universal Learner Model persistence.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => {
            const isRecommended = recommendedTier === p.tier;
            const isSelected = selectedTier === p.tier;
            const price = billingCycle === "monthly" ? p.monthlyPrice : p.annualMonthlyPrice;

            return (
              <Card
                key={p.tier}
                className={`flex flex-col justify-between transition-all duration-200 ${
                  p.popular || isRecommended
                    ? "border-2 border-[var(--lx-primary)] shadow-xl relative"
                    : "border border-[var(--lx-border)]"
                }`}
                title={p.name}
                subtitle={p.description}
                action={
                  isRecommended ? (
                    <Badge variant="info">Recommended</Badge>
                  ) : p.popular ? (
                    <Badge variant="success">Most Popular</Badge>
                  ) : undefined
                }
              >
                <div className="space-y-6 pt-4 flex-1 flex flex-col justify-between">
                  {/* Price Block */}
                  <div className="border-b border-[var(--lx-border)] pb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-[var(--color-brand-navy)]">
                        ${price === 0 ? "0" : price.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-[var(--lx-muted)]">
                        / month
                      </span>
                    </div>
                    {billingCycle === "annual" && p.monthlyPrice > 0 && (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        Billed annually (${(price * 12).toFixed(2)}/yr)
                      </span>
                    )}
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2.5 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[var(--lx-muted)]">
                      Plan Inclusions
                    </p>
                    <ul className="space-y-2 text-xs text-[var(--lx-ink)]">
                      {p.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span className="leading-snug">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Action */}
                  <div className="pt-4 border-t border-[var(--lx-border)]">
                    <Button
                      variant={p.popular || isRecommended ? "primary" : "secondary"}
                      className="w-full"
                      onClick={() => handleSelectPlan(p.tier)}
                    >
                      {isSelected
                        ? "Active Plan"
                        : p.tier === "BASIC"
                        ? "Current Tier"
                        : `Upgrade to ${p.tier}`}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <section className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-[var(--color-brand-navy)]">
              Detailed Plan Capabilities &amp; Quotas
            </h2>
            <p className="text-xs text-[var(--lx-muted)]">
              Compare voice limits, AI turns, and cross-ecosystem synchronization features.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--lx-ink)]">
              <thead>
                <tr className="border-b border-[var(--lx-border)] text-[var(--lx-muted)] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">Feature</th>
                  <th className="py-3 px-4 font-bold">Basic</th>
                  <th className="py-3 px-4 font-bold">Plus ($9.99/mo)</th>
                  <th className="py-3 px-4 font-bold">Ultra ($19.99/mo)</th>
                  <th className="py-3 px-4 font-bold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lx-border)]">
                <tr>
                  <td className="py-3 px-4 font-semibold">Coach Voice Practice / mo</td>
                  <td className="py-3 px-4 font-mono">15 min</td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">120 min</td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">300+ min</td>
                  <td className="py-3 px-4 font-mono font-bold">1,500 min</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">AI Conversational Turns / mo</td>
                  <td className="py-3 px-4 font-mono">40 turns</td>
                  <td className="py-3 px-4 font-mono">200 turns</td>
                  <td className="py-3 px-4 font-mono font-bold">1,000 turns</td>
                  <td className="py-3 px-4 font-mono font-bold">5,000 turns</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Specialized Industry Tracks</td>
                  <td className="py-3 px-4 text-slate-400">Preview only</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">1 Career Track (BPO)</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">All Career Tracks Unlocked</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">Custom Industry Tracks</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Universal Learner Model Error Sync</td>
                  <td className="py-3 px-4 text-slate-400">—</td>
                  <td className="py-3 px-4 text-slate-400">—</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">✓ Real-time Sync</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">✓ Real-time Sync</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Offline Module Downloads</td>
                  <td className="py-3 px-4 text-slate-400">—</td>
                  <td className="py-3 px-4 font-mono">1 Module</td>
                  <td className="py-3 px-4 font-mono font-bold">Unlimited</td>
                  <td className="py-3 px-4 font-mono font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Dominican Phonemic Contrast Drills</td>
                  <td className="py-3 px-4 font-semibold">Foundational</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">✓ Full Acoustic Wave</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">✓ Full Acoustic Wave</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">✓ Cohort Telemetry</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--lx-canvas)] flex items-center justify-center p-8 text-xs text-[var(--lx-muted)]">
          Loading billing plans…
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}
