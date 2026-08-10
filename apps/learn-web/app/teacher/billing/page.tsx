"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { ProgressBar } from "@lurexa/ui/ProgressBar";
import { BillingService, PLAN_CONFIGS, PlanLimits } from "@lurexa/backend";
import { PricingPlan } from "@lurexa/types";

export default function TeacherBillingPage() {
  const [currentPlan, setCurrentPlan] = useState<PricingPlan>("free");
  const [limits, setLimits] = useState<PlanLimits>(PLAN_CONFIGS["free"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadBilling() {
      const sub = await BillingService.getSubscription("org_demo");
      if (sub) {
        setCurrentPlan(sub.plan);
        setLimits(PLAN_CONFIGS[sub.plan]);
      }
    }
    loadBilling();
  }, []);

  const handleUpgrade = async (plan: PricingPlan) => {
    setLoading(true);
    try {
      const session = await BillingService.createCheckoutSession("org_demo", plan);
      window.location.href = session.checkoutUrl;
    } catch (err: any) {
      alert("Failed to initiate checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Billing & Subscription Management</h1>
            <p className="text-slate-500">Manage plan tiers, student seats, and usage limits</p>
          </div>
          <Badge variant={currentPlan === "free" ? "default" : "success"}>
            Active Plan: {currentPlan.toUpperCase()}
          </Badge>
        </div>

        {/* Current Usage Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Student Seats" subtitle="Enrolled / Capacity">
            <div className="space-y-2 pt-2">
              <span className="text-2xl font-bold text-slate-900">
                18 / {limits.maxStudents}
              </span>
              <ProgressBar value={(18 / limits.maxStudents) * 100} />
            </div>
          </Card>

          <Card title="AI Queries / Student" subtitle="Monthly guardrail cap">
            <div className="space-y-2 pt-2">
              <span className="text-2xl font-bold text-indigo-600">
                {limits.aiQueriesPerStudentMonth} Queries
              </span>
              <p className="text-xs text-slate-500">Resets on the 1st of every month</p>
            </div>
          </Card>

          <Card title="Offline Support" subtitle=" Dominican Republic sync">
            <div className="pt-2">
              <Badge variant={limits.offlineSupport ? "success" : "warning"}>
                {limits.offlineSupport ? "Enabled ✓" : "Requires Basic Plan"}
              </Badge>
            </div>
          </Card>
        </div>

        {/* Pricing Tier Matrix */}
        <Card title="Available Pricing Plans" subtitle="Select a plan that fits your school's scale">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Free Tier */}
            <div className="rounded-xl border border-slate-200 p-6 flex flex-col justify-between bg-white">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900">Free Tier</h3>
                <p className="text-2xl font-extrabold text-slate-900">$0 <span className="text-xs font-normal text-slate-500">/mo</span></p>
                <ul className="text-xs space-y-2 text-slate-600 pt-2">
                  <li>• Up to 20 students</li>
                  <li>• 3 courses</li>
                  <li>• 10 AI queries/student/mo</li>
                  <li>• Basic analytics</li>
                </ul>
              </div>
              <Button
                variant="secondary"
                className="mt-6 w-full"
                disabled={currentPlan === "free"}
              >
                {currentPlan === "free" ? "Current Plan" : "Downgrade"}
              </Button>
            </div>

            {/* Basic Tier */}
            <div className="rounded-xl border-2 border-indigo-600 p-6 flex flex-col justify-between bg-indigo-50/20 relative">
              <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                POPULAR
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900">Basic Plan</h3>
                <p className="text-2xl font-extrabold text-slate-900">$9 <span className="text-xs font-normal text-slate-500">/mo</span></p>
                <ul className="text-xs space-y-2 text-slate-600 pt-2">
                  <li>• Up to 100 students</li>
                  <li>• Unlimited courses</li>
                  <li>• 50 AI queries/student/mo</li>
                  <li>• Offline PWA sync enabled</li>
                </ul>
              </div>
              <Button
                variant="primary"
                className="mt-6 w-full"
                onClick={() => handleUpgrade("basic")}
                isLoading={loading}
              >
                {currentPlan === "basic" ? "Current Plan" : "Upgrade to Basic"}
              </Button>
            </div>

            {/* Pro Tier */}
            <div className="rounded-xl border border-slate-200 p-6 flex flex-col justify-between bg-white">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900">Pro Plan</h3>
                <p className="text-2xl font-extrabold text-slate-900">$29 <span className="text-xs font-normal text-slate-500">/mo</span></p>
                <ul className="text-xs space-y-2 text-slate-600 pt-2">
                  <li>• Up to 500 students</li>
                  <li>• Unlimited courses</li>
                  <li>• 200 AI queries/student/mo</li>
                  <li>• Advanced analytics & alerts</li>
                </ul>
              </div>
              <Button
                variant="secondary"
                className="mt-6 w-full"
                onClick={() => handleUpgrade("pro")}
                isLoading={loading}
              >
                {currentPlan === "pro" ? "Current Plan" : "Upgrade to Pro"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}