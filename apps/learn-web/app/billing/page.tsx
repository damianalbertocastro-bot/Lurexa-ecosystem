"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@lurexa/ui/button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { DEFAULT_TIER_QUOTAS, LUREXA_PRICING_PLANS, type SubscriptionTier } from "@lurexa/types";

function BillingContent() {
  const searchParams = useSearchParams();
  const recommendedTier = searchParams.get("recommendedTier") as SubscriptionTier | null;
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(recommendedTier || "PLUS");
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  const plans = [
    {
      tier: "BASIC" as const,
      name: "Lurexa Basic",
      monthlyPrice: LUREXA_PRICING_PLANS.basic.priceMonthly,
      annualMonthlyPrice: LUREXA_PRICING_PLANS.basic.annualPriceMonthly ?? LUREXA_PRICING_PLANS.basic.priceMonthly,
      description: "Free placement and core foundational trial lessons.",
      highlights: [
        "Oral CEFR diagnostic placement",
        "3 level-matched trial modules",
        "40 AI tutor conversational turns/mo",
        "15 Coach voice minutes/mo",
        "Standard cloud processing",
      ],
      quotas: DEFAULT_TIER_QUOTAS.BASIC,
    },
    {
      tier: "PLUS" as const,
      name: "Lurexa Plus",
      monthlyPrice: LUREXA_PRICING_PLANS.plus.priceMonthly,
      annualMonthlyPrice: LUREXA_PRICING_PLANS.plus.annualPriceMonthly ?? LUREXA_PRICING_PLANS.plus.priceMonthly,
      popular: true,
      description: "Dedicated single-product mastery with premium voice for the subscribed product.",
      highlights: [
        "Learn Plus or Coach Plus",
        "120 voice practice minutes/mo",
        "Premium ElevenLabs voice for the subscribed product",
        "200 AI conversational turns/mo",
        "1 full offline module",
      ],
      quotas: DEFAULT_TIER_QUOTAS.PLUS,
    },
    {
      tier: "ULTRA" as const,
      name: "Lurexa Ultra",
      monthlyPrice: LUREXA_PRICING_PLANS.ultra.priceMonthly,
      annualMonthlyPrice: LUREXA_PRICING_PLANS.ultra.annualPriceMonthly ?? LUREXA_PRICING_PLANS.ultra.priceMonthly,
      description: "Full Learn + Coach with deeper cross-product adaptation and premium AI/speech.",
      highlights: [
        "Full Learn + Coach access",
        "300+ Coach voice minutes/mo with streaming audio",
        "Universal Learner Model: real-time Coach ↔ Learn error sync",
        "Unlimited offline module downloads & background sync",
        "B1/B2 Capstone Project evaluation",
      ],
      quotas: DEFAULT_TIER_QUOTAS.ULTRA,
    },
  ];

  const handleSelectPlan = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setUpgradeSuccess(
      `Plan preference updated to ${tier} (${billingCycle}). Billing remains a planning flow until server-owned commerce is enabled.`
    );
  };

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] px-4 py-10 sm:px-8 text-[var(--lx-ink)]">
      <div className="mx-auto max-w-7xl space-y-10">
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
                Individual plans plus a separate contract-based Business model.
              </p>
            </div>
          </div>
          <Link href="/dashboard">
            <Button variant="secondary" size="sm">← Back to Dashboard</Button>
          </Link>
        </header>

        {upgradeSuccess && (
          <div
            role="status"
            className="rounded-2xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-4 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-4 shadow-sm"
          >
            <span>✓ {upgradeSuccess}</span>
            <button type="button" onClick={() => setUpgradeSuccess(null)} className="text-xs underline">
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="inline-flex items-center rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-xl px-5 py-2 text-xs font-black transition ${billingCycle === "monthly" ? "bg-[var(--lx-primary)] text-white shadow-sm" : "text-[var(--lx-muted)]"}`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`rounded-xl px-5 py-2 text-xs font-black transition ${billingCycle === "annual" ? "bg-[var(--lx-primary)] text-white shadow-sm" : "text-[var(--lx-muted)]"}`}
            >
              Annual Billing
            </button>
          </div>
          <p className="text-[11px] font-medium text-[var(--lx-muted)]">
            Business pricing is contract/quote based and is not represented as a fixed public SKU.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => {
            const isRecommended = recommendedTier === p.tier;
            const isSelected = selectedTier === p.tier;
            const price = billingCycle === "monthly" ? p.monthlyPrice : p.annualMonthlyPrice;

            return (
              <Card
                key={p.tier}
                className={`flex flex-col justify-between ${p.popular || isRecommended ? "border-2 border-[var(--lx-primary)] shadow-xl relative" : "border border-[var(--lx-border)]"}`}
                title={p.name}
                subtitle={p.description}
                action={
                  isRecommended ? <Badge variant="info">Recommended</Badge> :
                  p.popular ? <Badge variant="success">Most Popular</Badge> : undefined
                }
              >
                <div className="space-y-6 pt-4 flex-1 flex flex-col justify-between">
                  <div className="border-b border-[var(--lx-border)] pb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-[var(--color-brand-navy)]">
                        ${price === 0 ? "0" : price.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-[var(--lx-muted)]">/ month</span>
                    </div>
                    {billingCycle === "annual" && p.monthlyPrice > 0 && (
                      <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">
                        Billed annually (${(price * 12).toFixed(2)}/yr)
                      </span>
                    )}
                  </div>

                  <ul className="space-y-2.5 flex-1 text-xs text-[var(--lx-ink)]">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span className="leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-[var(--lx-border)]">
                    <Button
                      variant={p.popular || isRecommended ? "primary" : "secondary"}
                      className="w-full"
                      onClick={() => handleSelectPlan(p.tier)}
                    >
                      {isSelected ? "Selected" : p.tier === "BASIC" ? "Current Tier" : `Select ${p.name.replace("Lurexa ", "")}`}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card
          title="Lurexa Business"
          subtitle="For small and medium organizations"
          className="border border-[var(--lx-border)]"
        >
          <div className="space-y-4 text-sm text-[var(--lx-ink)]">
            <p>
              Business is an organization contract rather than another individual plan. Organizations receive configured access to the Lurexa ecosystem with negotiated learner/seat allowances and pooled usage.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2 text-xs">
              {[
                "Groups and cohorts",
                "Assignments",
                "Analytics and reporting",
                "Role management and audit",
                "SSO and data export",
                "Teacher/admin management",
                "Custom curricula",
                "Studio authoring, branding and integrations",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-[var(--lx-muted)]">
              Support, usage limits and customization are negotiated by contract. Business pricing is quote based.
            </p>
          </div>
        </Card>

        <section className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-[var(--color-brand-navy)]">Commercial boundary</h2>
          <p className="mt-2 text-xs text-[var(--lx-muted)]">
            Learn Plus and Coach Plus include premium ElevenLabs only for the subscribed product. Ultra currently covers Learn + Coach; future products are not automatically included.
          </p>
        </section>
      </div>
    </main>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--lx-canvas)] flex items-center justify-center p-8 text-xs text-[var(--lx-muted)]">Loading plans…</div>}>
      <BillingContent />
    </Suspense>
  );
}
