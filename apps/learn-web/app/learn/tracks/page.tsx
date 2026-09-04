"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SPECIALIZED_INDUSTRY_TRACKS, type SpecializedIndustryTrack } from "@lurexa/backend";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";
import type { CefrLevel, SubscriptionTier } from "@lurexa/types";

const CEFR_ORDER: Record<string, number> = {
  PRE_A1: 0,
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

function getTrackAccessStatus(
  track: SpecializedIndustryTrack,
  userLevel: CefrLevel,
  activeTier: SubscriptionTier,
  trackIndex: number
): {
  isUnlocked: boolean;
  status: "unlocked" | "locked_level" | "locked_tier";
  badgeLabel: string;
  badgeVariant: "success" | "warning" | "info" | "default";
  reason: string;
  actionText: string;
  actionHref: string;
} {
  const userRank = CEFR_ORDER[userLevel] ?? 1;
  const trackMinRank = CEFR_ORDER[track.minimumCefrLevel] ?? 2;

  // 1. CEFR Level check: user must be at or above minimum required level
  if (userRank < trackMinRank) {
    return {
      isUnlocked: false,
      status: "locked_level",
      badgeLabel: `🔒 Requires CEFR ${track.minimumCefrLevel}`,
      badgeVariant: "warning",
      reason: `Locked for learners below CEFR ${track.minimumCefrLevel} (Current: ${userLevel}). Complete foundational A1/A2 lessons first.`,
      actionText: "Practice A1 Lessons First →",
      actionHref: "/dashboard",
    };
  }

  // 2. Highest Paying Plans: ULTRA & ENTERPRISE have all courses fully available
  if (activeTier === "ULTRA" || activeTier === "ENTERPRISE") {
    return {
      isUnlocked: true,
      status: "unlocked",
      badgeLabel: "✓ Full Ultra Access",
      badgeVariant: "success",
      reason: "All specialized industry tracks and audio modules are fully available in your Ultra Plan.",
      actionText: "Explore Track & Modules →",
      actionHref: `/learn/tracks/${track.slug}`,
    };
  }

  // 3. Second Highest Paying Plan: PLUS has 1 course available (BPO Call Center), others locked
  if (activeTier === "PLUS") {
    if (trackIndex === 0 || track.slug === "dominican-bpo-call-center-english") {
      return {
        isUnlocked: true,
        status: "unlocked",
        badgeLabel: "✓ Plus Plan Track (1 of 1)",
        badgeVariant: "success",
        reason: "Available in your Plus Plan (1 Career Track included).",
        actionText: "Explore Track & Modules →",
        actionHref: `/learn/tracks/${track.slug}`,
      };
    }
    return {
      isUnlocked: false,
      status: "locked_tier",
      badgeLabel: "🔒 Available in Ultra Plan",
      badgeVariant: "warning",
      reason: "This additional course is available in the highest paying Ultra plan. Upgrade to Ultra to unlock all career tracks.",
      actionText: "Upgrade to Ultra to Unlock →",
      actionHref: "/billing?recommendedTier=ULTRA",
    };
  }

  // 4. Basic / Free Tier: Locked
  return {
    isUnlocked: false,
    status: "locked_tier",
    badgeLabel: "🔒 Plus & Ultra Only",
    badgeVariant: "warning",
    reason: "Specialized industry tracks are available with Plus (1 track) or Ultra (all tracks).",
    actionText: "View Plans & Upgrade →",
    actionHref: "/billing",
  };
}

export default function SpecializedTracksPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [activeTier, setActiveTier] = useState<SubscriptionTier>("PLUS");
  const [userCefrLevel, setUserCefrLevel] = useState<CefrLevel>("A2");

  const industries = ["all", "BPO", "Tourism & Hospitality", "Software Engineering"];

  const filteredTracks =
    selectedIndustry === "all"
      ? SPECIALIZED_INDUSTRY_TRACKS
      : SPECIALIZED_INDUSTRY_TRACKS.filter((t) =>
          t.targetIndustry.toLowerCase().includes(selectedIndustry.toLowerCase())
        );

  return (
    <main className="min-h-screen bg-[var(--lx-canvas)] px-4 py-10 sm:px-8 text-[var(--lx-ink)]">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Banner */}
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[var(--color-brand-navy)] via-[var(--color-brand-navy)] to-[var(--lx-primary)] p-8 text-white shadow-xl sm:p-12">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-[var(--lx-accent)] backdrop-blur-md">
              ⚡ Specialized Career Tracks
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Industry English for high-growth Dominican careers.
            </h1>
            <p className="text-sm leading-relaxed text-indigo-100 sm:text-base">
              Targeted communicative fluency, domain vocabulary, authentic client role-plays, and intelligibility refinement tailored for Dominican professionals.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">
                  ← Back to Dashboard
                </Button>
              </Link>
              <Link href="/billing">
                <Button variant="primary" size="sm">
                  Manage Subscription &amp; Plans →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Status Bar & Simulation Controls */}
        <section className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--lx-muted)]">
              Your Current Access Profile
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">Active Plan: {activeTier}</Badge>
              <Badge variant="default">CEFR Standing: {userCefrLevel}</Badge>
              <span className="text-xs text-[var(--lx-muted)] ml-1">
                {activeTier === "ULTRA" || activeTier === "ENTERPRISE"
                  ? "✓ All courses available (highest tier)"
                  : activeTier === "PLUS"
                  ? "✓ 1 course available in Plus tier; remaining available in Ultra"
                  : "🔒 Upgrade required for specialized tracks"}
              </span>
            </div>
          </div>

          {/* Quick Profile Switcher (Testing & Demo) */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-[var(--lx-muted)]">Simulate Tier:</span>
            {(["BASIC", "PLUS", "ULTRA"] as SubscriptionTier[]).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setActiveTier(tier)}
                className={`rounded-lg px-2.5 py-1 font-bold text-xs transition ${
                  activeTier === tier
                    ? "bg-[var(--lx-primary)] text-white"
                    : "bg-[var(--lx-canvas)] border border-[var(--lx-border)] text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
                }`}
              >
                {tier}
              </button>
            ))}

            <span className="font-bold text-[var(--lx-muted)] ml-2">Level:</span>
            {(["A1", "A2", "B1"] as CefrLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setUserCefrLevel(lvl)}
                className={`rounded-lg px-2 py-1 font-bold text-xs transition ${
                  userCefrLevel === lvl
                    ? "bg-indigo-600 text-white"
                    : "bg-[var(--lx-canvas)] border border-[var(--lx-border)] text-[var(--lx-muted)] hover:text-[var(--lx-ink)]"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </section>

        {/* Filter Pills */}
        <section className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--lx-muted)] mr-2">
            Industry:
          </span>
          {industries.map((ind) => (
            <Button
              key={ind}
              type="button"
              onClick={() => setSelectedIndustry(ind)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                selectedIndustry === ind
                  ? "bg-[var(--lx-primary)] text-white shadow-sm"
                  : "bg-[var(--lx-surface)] text-[var(--lx-muted)] border border-[var(--lx-border)] hover:text-[var(--lx-ink)]"
              }`}
            >
              {ind === "all" ? "All Career Tracks" : ind}
            </Button>
          ))}
        </section>

        {/* Tracks Grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTracks.map((track, trackIndex) => {
            const access = getTrackAccessStatus(track, userCefrLevel, activeTier, trackIndex);

            return (
              <Card
                key={track.id}
                interactive={access.isUnlocked}
                className={`flex flex-col justify-between transition-all duration-200 ${
                  !access.isUnlocked ? "opacity-90 border-slate-300 dark:border-slate-800" : ""
                }`}
                title={track.title}
                subtitle={track.titleEs}
                action={<Badge variant={access.badgeVariant}>{access.badgeLabel}</Badge>}
              >
                <div className="space-y-4 pt-2">
                  <p className="text-xs leading-5 text-[var(--lx-muted)]">
                    {track.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="info">Min CEFR: {track.minimumCefrLevel}</Badge>
                    <Badge variant="default">{track.estimatedHours} Hours</Badge>
                    <Badge variant="success">{track.modules.length} Modules</Badge>
                  </div>

                  {/* Access Status Explainer Box */}
                  <div
                    className={`rounded-2xl border p-3.5 space-y-1.5 text-xs ${
                      access.isUnlocked
                        ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 font-medium"
                        : access.status === "locked_level"
                        ? "bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 font-medium"
                        : "bg-slate-100/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 font-medium"
                    }`}
                  >
                    <p className="font-bold text-[11px] uppercase tracking-wider">
                      {access.isUnlocked ? "Access Status: Unlocked" : "Access Status: Locked"}
                    </p>
                    <p className="leading-relaxed">{access.reason}</p>
                  </div>

                  {/* Curriculum Highlights */}
                  <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)]/70 p-3.5 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[var(--lx-muted)]">
                      Curriculum Highlights
                    </p>
                    <ul className="space-y-1 text-xs text-[var(--lx-ink)]">
                      {track.modules.slice(0, 3).map((mod) => (
                        <li key={mod.id} className="flex items-center gap-2">
                          <span className="text-[var(--lx-primary)] font-bold">•</span>
                          <span className="truncate">{mod.title}</span>
                        </li>
                      ))}
                      {track.modules.length > 3 && (
                        <li className="text-[11px] font-medium text-[var(--lx-muted)]">
                          + {track.modules.length - 3} more specialized modules
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    {access.isUnlocked ? (
                      <Link href={access.actionHref} className="block w-full">
                        <Button variant="primary" className="w-full">
                          {access.actionText}
                        </Button>
                      </Link>
                    ) : (
                      <Link href={access.actionHref} className="block w-full">
                        <Button
                          variant={access.status === "locked_level" ? "secondary" : "primary"}
                          className="w-full"
                        >
                          {access.actionText}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
