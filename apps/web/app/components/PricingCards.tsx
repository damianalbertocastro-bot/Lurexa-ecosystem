"use client";

import React from "react";
import { LUREXA_PRICING_PLANS, type TierPricingPlan } from "@lurexa/types";

interface PricingCardsProps {
  learnUrl?: string;
  teachUrl?: string;
}

export function PricingCards({ learnUrl, teachUrl }: PricingCardsProps) {
  const planOrder: Array<"basic" | "plus" | "ultra"> = ["basic", "plus", "ultra"];

  const resolveCtaHref = (plan: TierPricingPlan) => {
    if (plan.id === "basic") {
      return learnUrl ? `${learnUrl}/signup?plan=basic` : plan.ctaHref;
    }
    if (plan.id === "plus") {
      return learnUrl ? `${learnUrl}/signup?plan=plus` : plan.ctaHref;
    }
    if (plan.id === "ultra") {
      return teachUrl ? `${teachUrl}/signup?plan=ultra` : (learnUrl ? `${learnUrl}/signup?plan=ultra` : plan.ctaHref);
    }
    return plan.ctaHref;
  };

  const renderFeatureItem = (feature: string) => {
    if (feature.includes(":")) {
      const [boldPart, ...rest] = feature.split(":");
      return (
        <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
          <span className="mt-0.5 font-bold text-indigo-600 dark:text-indigo-400">✓</span>
          <span>
            <strong className="font-semibold text-slate-900 dark:text-slate-100">{boldPart}:</strong>
            {rest.join(":")}
          </span>
        </li>
      );
    }

    return (
      <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
        <span className="mt-0.5 font-bold text-indigo-600 dark:text-indigo-400">✓</span>
        <span>
          <strong className="font-semibold text-slate-900 dark:text-slate-100">{feature}</strong>
        </span>
      </li>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
      {planOrder.map((key) => {
        const plan = LUREXA_PRICING_PLANS[key];
        const isHighlighted = plan.highlighted;

        return (
          <article
            key={plan.id}
            className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
              isHighlighted
                ? "bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-2xl ring-2 ring-indigo-500 scale-105 z-10"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md"
            }`}
          >
            <div>
              {/* Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full ${
                    isHighlighted
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {plan.badge}
                </span>
              </div>

              {/* Title & Price */}
              <h3
                className={`text-2xl font-extrabold tracking-tight mb-2 ${
                  isHighlighted ? "text-white" : "text-slate-900 dark:text-white"
                }`}
              >
                {plan.name}
              </h3>

              <div className="flex items-baseline gap-1 mb-4">
                <span
                  className={`text-4xl font-black tracking-tight ${
                    isHighlighted ? "text-white" : "text-slate-900 dark:text-white"
                  }`}
                >
                  {plan.priceMonthly === 0 ? "Free" : `$${plan.priceMonthly}`}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    isHighlighted ? "text-indigo-200" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {plan.priceMonthly === 0 ? "" : plan.billingPeriod}
                </span>
              </div>

              {/* Description */}
              <p
                className={`text-sm leading-relaxed mb-6 min-h-[44px] ${
                  isHighlighted ? "text-indigo-100" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {plan.description}
              </p>

              {/* Feature List */}
              <div
                className={`border-t pt-6 mb-8 ${
                  isHighlighted ? "border-indigo-800/60" : "border-slate-100 dark:border-slate-800"
                }`}
              >
                <p
                  className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                    isHighlighted ? "text-indigo-300" : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  Included Features
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => renderFeatureItem(feature))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div
              className={`pt-4 border-t ${
                isHighlighted ? "border-indigo-800/60" : "border-slate-100 dark:border-slate-800"
              }`}
            >
              <a
                href={resolveCtaHref(plan)}
                className={`w-full inline-flex items-center justify-center rounded-xl py-3 px-5 text-sm font-bold transition-colors ${
                  isHighlighted
                    ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900"
                }`}
              >
                {plan.ctaText}
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default PricingCards;
