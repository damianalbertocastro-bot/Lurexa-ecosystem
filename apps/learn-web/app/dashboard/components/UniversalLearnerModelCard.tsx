"use client";

import React, { useMemo } from "react";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { SkillRadarChart } from "@lurexa/ui/SkillRadarChart";
import type { SubscriptionTier, CefrLevel, DominicanTransferCategory } from "@lurexa/types";
import { MindRecommendationService } from "@lurexa/backend";

interface UniversalLearnerModelProps {
  userId?: string;
  cefrLevel?: CefrLevel;
  activeTier?: SubscriptionTier;
}

interface TransferItem {
  name: string;
  status: string;
  tag: string;
  category: DominicanTransferCategory;
}

const DOMINICAN_TRANSFER_BY_LEVEL: Record<CefrLevel, TransferItem[]> = {
  PRE_A1: [
    { name: "Initial /s/-cluster Epenthesis", status: "Emerging", tag: "Drill in Coach", category: "s_cluster_epenthesis" },
    { name: "Coda /s/ & /t/ Weakening", status: "Emerging", tag: "Drill in Coach", category: "coda_weakening" },
  ],
  A1: [
    { name: "Initial /s/-cluster Epenthesis", status: "Active Focus", tag: "Drill in Coach", category: "s_cluster_epenthesis" },
    { name: "Coda /s/ & /t/ Weakening", status: "Active Focus", tag: "Drill in Coach", category: "coda_weakening" },
  ],
  A2: [
    { name: "Third-person Inflection Elision", status: "Active Focus", tag: "Grammar Lab", category: "third_person_inflection" },
    { name: "Interdental Stopping (/t/ vs /θ/)", status: "Active Focus", tag: "Drill in Coach", category: "interdental_stopping" },
  ],
  B1: [
    { name: "Liquid Neutralization (/l/ vs /r/)", status: "Active Focus", tag: "Phonetic Pairs", category: "liquid_neutralization" },
    { name: "Vowel Duration & Reduction Gap", status: "Under Review", tag: "Waveform Check", category: "vowel_duration_gap" },
  ],
  B2: [
    { name: "Interdental Frication (/θ/, /ð/)", status: "Refining", tag: "Fluency Practice", category: "interdental_stopping" },
    { name: "Syllable-timed Rhythm Interference", status: "Active Focus", tag: "Stress Pacing", category: "coda_weakening" },
  ],
  C1: [
    { name: "Pragmatic Directness vs Indirect Politeness", status: "Refining", tag: "Discourse Lab", category: "vowel_duration_gap" },
    { name: "Intonation in Dependent Clauses", status: "Targeted", tag: "Advanced Coach", category: "coda_weakening" },
  ],
  C2: [
    { name: "Diplomatic Ambiguity & Irony Registers", status: "Mastery Target", tag: "Native Capstone", category: "vowel_duration_gap" },
    { name: "Subtle Consonant Aspiration Nuance", status: "Calibrated", tag: "Sovereign Practice", category: "coda_weakening" },
  ],
};

const LEVEL_REAL_RECOMMENDATION: Record<CefrLevel, { focus: string; nextAction: string; ctaText: string; ctaHref: string }> = {
  PRE_A1: {
    focus: "Build foundational phonetic recognition and basic English communicative readiness.",
    nextAction: "Daily vocal drills in Coach to establish English sound patterns and simple vocabulary.",
    ctaText: "Begin A1 Preparation in Coach 🗣️",
    ctaHref: "/coach",
  },
  A1: {
    focus: "Consolidate A1 communicative basics (introductions, personal descriptions, regular verbs).",
    nextAction: "Daily speaking workouts in Coach to prevent prosthetic vowel epenthesis before /s/-clusters.",
    ctaText: "Practice A1 Phonetics in Coach 🗣️",
    ctaHref: "/coach",
  },
  A2: {
    focus: "Expand everyday conversational exchanges, routine narratives, and irregular past forms.",
    nextAction: "Explore specialized Dominican BPO Call Center or Tourism & Hospitality tracks to bridge into employment fluency.",
    ctaText: "Explore A2 Career Tracks 💼",
    ctaHref: "/learn/tracks",
  },
  B1: {
    focus: "Strengthen independent speech, opinion articulation, and connected discourse.",
    nextAction: "Enroll in Software Engineering English or intermediate fluency modules with delayed feedback.",
    ctaText: "Open B1 Technical Track 💻",
    ctaHref: "/learn/tracks/software-engineering-english",
  },
  B2: {
    focus: "Master upper-intermediate fluency, spontaneous debate, and business presentations.",
    nextAction: "Focus on stress-timed rhythm and reduction of syllable timing interference in professional contexts.",
    ctaText: "Advance to B2 Fluency Modules →",
    ctaHref: "/learn/tracks",
  },
  C1: {
    focus: "Polish doctoral, professional, and academic nuance across varied registers.",
    nextAction: "Participate in simulated client negotiations and complex oral defenses.",
    ctaText: "Engage C1 Advanced Tasks →",
    ctaHref: "/learn/tracks",
  },
  C2: {
    focus: "Maintain native-like sovereign communicative agility, rhetorical dexterity, and stylistic range.",
    nextAction: "Capstone evaluations and peer mentoring across the Lurexa ecosystem.",
    ctaText: "View Mastery Capstone →",
    ctaHref: "/learn/a1/capstone",
  },
};

export const UniversalLearnerModelCard: React.FC<UniversalLearnerModelProps> = ({
  userId = "user_demo",
  cefrLevel = "A1",
  activeTier = "BASIC",
}) => {
  const safeLevel: CefrLevel = (["PRE_A1", "A1", "A2", "B1", "B2", "C1", "C2"].includes(cefrLevel) ? cefrLevel : "A1") as CefrLevel;

  const transferItems = DOMINICAN_TRANSFER_BY_LEVEL[safeLevel] || DOMINICAN_TRANSFER_BY_LEVEL.A1;
  const levelRec = LEVEL_REAL_RECOMMENDATION[safeLevel] || LEVEL_REAL_RECOMMENDATION.A1;

  const recommendation = useMemo(() => {
    return MindRecommendationService.evaluatePlanSynergy({
      userId,
      cefrLevel: safeLevel,
      activeTier,
      completedLessonCount: safeLevel === "A1" ? 4 : safeLevel === "A2" ? 12 : 24,
      coachMinutesUsedThisMonth: 15,
      identifiedDominicanTransfers: transferItems.map((t) => t.category),
      enrolledProductCount: 2,
    });
  }, [userId, safeLevel, activeTier, transferItems]);

  const skillScores = useMemo(() => {
    const base = safeLevel === "C2" ? 95 : safeLevel === "C1" ? 88 : safeLevel === "B2" ? 80 : safeLevel === "B1" ? 72 : safeLevel === "A2" ? 64 : 55;
    return [
      { skill: "Listening", score: Math.min(100, base + 8) },
      { skill: "Speaking", score: Math.min(100, base + 4) },
      { skill: "Grammar", score: Math.min(100, base + 2) },
      { skill: "Vocabulary", score: Math.min(100, base + 10) },
      { skill: "Reading", score: Math.min(100, base + 12) },
      { skill: "Phonetics", score: Math.min(100, base - 2) },
      { skill: "Writing", score: Math.min(100, base) },
    ];
  }, [safeLevel]);

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
          <p className="text-2xl font-black text-[var(--color-brand-navy)]">{safeLevel}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 items-center">
        <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[var(--lx-canvas)] border border-[var(--lx-border)]">
          <SkillRadarChart
            skills={skillScores}
            size={240}
          />
          <p className="mt-1 text-[11px] font-bold text-[var(--lx-muted)]">7-Skill Competency Balance (CEFR {safeLevel})</p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)]">
              Dominican L1 Transfer Diagnostics ({safeLevel}):
            </h3>
            <div className="mt-2 space-y-2">
              {transferItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-amber-50/80 border border-amber-200/80 p-2.5 text-xs text-amber-900 font-medium">
                  <span className="font-semibold">{item.name}</span>
                  <span className="font-mono text-[11px] font-bold text-amber-700">{item.tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Level-Adapted Real Recommendation */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-950 p-4 text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                Personalized {safeLevel} Recommendation
              </span>
              <span className="rounded-full bg-teal-400/20 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                Mind Calibrated
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {levelRec.focus} {levelRec.nextAction}
            </p>
            <div className="pt-1">
              <Button
                variant="primary"
                className="w-full bg-gradient-to-r from-teal-400 to-indigo-500 text-slate-950 font-black text-xs py-2"
                onClick={() => window.location.href = levelRec.ctaHref}
              >
                {levelRec.ctaText}
              </Button>
            </div>
          </div>

          {recommendation && recommendation.recommendedTier !== activeTier && (
            <div className="rounded-2xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50/90 dark:bg-indigo-950/60 p-4 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  Synergy Recommendation
                </span>
                <Badge variant="info">Upgrade to {recommendation.recommendedTier}</Badge>
              </div>
              <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium">
                {recommendation.reason}
              </p>
              <div className="pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  onClick={() => {
                    window.location.href = `/billing?recommendedTier=${recommendation.recommendedTier}`;
                  }}
                >
                  Explore {recommendation.recommendedTier} Plan →
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
