"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@lurexa/ui/Badge";
import { ProgressBar } from "@lurexa/ui/ProgressBar";
import { AuthService, BillingService, OrganizationService, PLAN_CONFIGS, type PlanLimits } from "@lurexa/backend";
import type { PricingPlan } from "@lurexa/types";

export default function TeacherBillingPage() {
  const [currentPlan, setCurrentPlan] = useState<PricingPlan>("free");
  const [limits, setLimits] = useState<PlanLimits>(PLAN_CONFIGS.free);
  const [studentSeats, setStudentSeats] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => AuthService.onUserChanged(async (user) => {
    if (!user) {
      setError("Sign in as an educator to view organization plan details.");
      setLoading(false);
      return;
    }
    try {
      const membership = (await OrganizationService.getMembershipsForUser(user.uid)).find((item) => ["owner", "admin", "teacher"].includes(item.role));
      if (!membership) throw new Error("No educator organization is available for this account.");
      const [subscription, seatUsage] = await Promise.all([
        BillingService.getSubscription(membership.orgId),
        BillingService.getStudentSeatUsage(membership.orgId),
      ]);
      const plan = subscription?.plan ?? "free";
      setCurrentPlan(plan);
      setLimits(PLAN_CONFIGS[plan]);
      setStudentSeats(seatUsage);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load plan details.");
    } finally {
      setLoading(false);
    }
  }), []);

  const seatPercent = limits.maxStudents > 0 ? Math.min(100, (studentSeats / limits.maxStudents) * 100) : 0;
  const planRows: Array<{ id: PricingPlan; label: string; availability: string }> = [
    { id: "free", label: "Free", availability: "Available now" },
    { id: "basic", label: "Basic", availability: "Commerce not enabled" },
    { id: "pro", label: "Pro", availability: "Commerce not enabled" },
    { id: "enterprise", label: "Enterprise", availability: "Commercial configuration pending" },
  ];

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8 sm:py-12">
      <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071d67] via-[#17368f] to-[#592bd6] px-6 py-10 text-white shadow-[0_22px_60px_rgba(35,48,133,.18)] sm:px-10 sm:py-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#12cdd4]/20 blur-3xl" />
        <div className="relative max-w-3xl"><p className="text-[11px] font-extrabold tracking-[.2em] text-[#8df4ef]">ORGANIZATION PLAN · LUREXA LEARN</p><h1 className="mt-4 text-4xl font-black tracking-[-.055em] sm:text-5xl">Understand the limits currently applied.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100">This surface reports the organization’s stored subscription and observable seat usage. Paid checkout is not exposed until commerce is actually configured.</p></div>
      </section>

      {loading ? <div className="mt-6 rounded-[26px] border border-[#dfe6f8] bg-white p-7 text-[#6677a5]">Loading plan details…</div> : null}
      {error ? <div role="alert" className="mt-6 rounded-[26px] border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-700">{error}</div> : null}

      {!loading && !error ? <>
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-[26px] border border-[#dfe6f8] bg-white p-6 shadow-[0_12px_30px_rgba(32,52,128,.06)]"><p className="text-[10px] font-extrabold tracking-[.15em] text-[#7280a6]">STUDENT SEATS</p><b className="mt-3 block text-3xl tracking-[-.055em] text-[#071d67]">{studentSeats} / {limits.maxStudents}</b><div className="mt-4"><ProgressBar value={seatPercent} /></div></article>
          <article className="rounded-[26px] border border-[#dfe6f8] bg-white p-6 shadow-[0_12px_30px_rgba(32,52,128,.06)]"><p className="text-[10px] font-extrabold tracking-[.15em] text-[#7280a6]">AI QUERY GUARDRAIL</p><b className="mt-3 block text-3xl tracking-[-.055em] text-[#592bd6]">{limits.aiQueriesPerStudentMonth}</b><p className="mt-2 text-xs leading-5 text-[#6677a5]">Configured monthly allowance per learner. This is a plan limit, not current usage.</p></article>
          <article className="rounded-[26px] border border-[#cfeee9] bg-[#e9fbf9] p-6 shadow-[0_12px_30px_rgba(32,52,128,.05)]"><p className="text-[10px] font-extrabold tracking-[.15em] text-[#137d7f]">OFFLINE SUPPORT</p><div className="mt-4"><Badge variant={limits.offlineSupport ? "success" : "warning"}>{limits.offlineSupport ? "Enabled" : "Not included"}</Badge></div><p className="mt-3 text-xs leading-5 text-[#477a76]">Capability follows the stored plan configuration.</p></article>
        </section>

        <section className="mt-6 rounded-[30px] border border-[#dfe6f8] bg-white p-7 shadow-[0_14px_36px_rgba(32,52,128,.07)] sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold tracking-[.18em] text-[#592bd6]">PLAN CONFIGURATION</p><h2 className="mt-2 text-2xl font-black tracking-[-.04em] text-[#10245f]">Current plan: {currentPlan}</h2></div><Badge variant={currentPlan === "free" ? "default" : "success"}>{currentPlan.toUpperCase()}</Badge></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{planRows.map((plan) => { const config = PLAN_CONFIGS[plan.id]; const active = plan.id === currentPlan; return <article key={plan.id} className={`rounded-[24px] border p-5 ${active ? "border-[#592bd6] bg-[#f3f1ff]" : "border-[#dfe6f8] bg-[#f9faff]"}`}><div className="flex items-center justify-between gap-2"><h3 className="text-lg font-black text-[#10245f]">{plan.label}</h3>{active ? <Badge variant="info">Current</Badge> : null}</div><ul className="mt-4 space-y-2 text-sm leading-5 text-[#6677a5]"><li>Up to {config.maxStudents.toLocaleString()} students</li><li>{config.maxCourses < 0 ? "Unlimited" : config.maxCourses} courses</li><li>{config.aiQueriesPerStudentMonth} AI queries / student / month</li><li>{config.offlineSupport ? "Offline support included" : "Offline support not included"}</li></ul><p className="mt-5 border-t border-[#dfe6f8] pt-4 text-xs font-extrabold text-[#7b87aa]">{plan.availability}</p></article>; })}</div>
          <p className="mt-6 rounded-2xl bg-[#fffaf2] p-5 text-sm leading-6 text-[#76664e]"><b>Commerce boundary:</b> no paid plan price or upgrade button is shown until the Stripe/server-side checkout flow, pricing source of truth, subscription webhook handling, and billing-state reconciliation are implemented.</p>
        </section>
      </> : null}
    </main>
  );
}
