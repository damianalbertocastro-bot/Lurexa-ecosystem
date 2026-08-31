"use client";

import React, { useMemo } from "react";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { SkillRadarChart } from "@lurexa/ui/SkillRadarChart";
import type { SubscriptionTier, CefrLevel } from "@lurexa/types";
import { MindRecommendationService } from "@lurexa/backend";

interface UniversalLearnerModelProps {
  userId?: string;
  cefrLevel?: CefrLevel;
  activeTier?: SubscriptionTier;
}

export const UniversalLearnerModelCard: React.FC<UniversalLearnerModelProps> = ({
  userId = "user_demo",
  cefrLevel = "A1",
  activeTier = "BASIC",
}) => {
  const recommendation = useMemo(() => {
    return MindRecommendationService.evaluatePlanSynergy({
      userId,
      cefrLevel,
      activeTier,
      completedLessonCount: 8,
      coachMinutesUsedThisMonth: 12,
      identifiedDominicanTransfers: ["coda_weakening", "s_cluster_epenthesis"],
      enrolledProductCount: 2,
    });
  }, [userId, cefrLevel, activeTier]);

  return (
    <article className="rounded-3xl border border-indigo-100 bg-[var(--lx-surface)] p-6 sm:p-8 shadow-lg shadow-indigo-100/50 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--lx-border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Universal Learner Model</span>
            <Badge variant="info">Tier: {activeTier}</Badge>
          </div>
          <h2 className="text-xl font-black text-[var(--color-brand-navy)] tracking-tight mt-1">
            Single Evolving Profile across Lurexa
          </h2>
          <p className="text-xs text-[var(--lx-muted)]">
            One learner. One persistent representation adapting across Learn, Coach, and Teach.
          </p>
        </div>

        <div className="rounded-2xl bg-indigo-50 border border-indigo-200/60 px-4 py-2 text-center">
          <p className="text-[10px] font-bold uppercase text-indigo-700">CEFR Standing</p>
          <p className="text-2xl font-black text-[var(--color-brand-navy)]">{cefrLevel}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 items-center">
        <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[var(--lx-canvas)] border border-[var(--lx-border)]">
          <SkillRadarChart
            skills={[
              { skill: "Listening", score: 65 },
              { skill: "Speaking", score: 72 },
              { skill: "Grammar", score: 60 },
              { skill: "Vocabulary", score: 75 },
              { skill: "Reading", score: 80 },
              { skill: "Phonetics", score: 55 },
              { skill: "Writing", score: 58 },
            ]}
            size={240}
          />
          <p className="mt-1 text-[11px] font-bold text-[var(--lx-muted)]">7-Skill Competency Balance</p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)]">Dominican L1 Transfer Diagnostics:</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-amber-50/80 border border-amber-200/80 p-2.5 text-xs text-amber-900">
                <span className="font-semibold">Coda /s/ &amp; /t/ Weakening</span>
                <span className="font-mono text-[11px] font-bold text-amber-700">Drill in Coach</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-amber-50/80 border border-amber-200/80 p-2.5 text-xs text-amber-900">
                <span className="font-semibold">Initial /s/-cluster Epenthesis</span>
                <span className="font-mono text-[11px] font-bold text-amber-700">Active</span>
              </div>
            </div>
          </div>

          {recommendation && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-950 p-4 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">Synergy Recommendation</span>
                <span className="rounded-full bg-teal-400/20 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                  Upgrade to {recommendation.recommendedTier}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{recommendation.reason}</p>
              <Button
                variant="primary"
                className="w-full bg-gradient-to-r from-teal-400 to-indigo-500 text-slate-950 font-black text-xs py-2"
                onClick={() => alert(`Redirecting to ${recommendation.recommendedTier} upgrade checkout...`)}
              >
                Explore {recommendation.recommendedTier} Plan →
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
