"use client";

import React from "react";
import Link from "next/link";
import { SPECIALIZED_INDUSTRY_TRACKS } from "@lurexa/backend";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";

const CEFR_RANKS: Record<string, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

interface SpecializedTracksCardProps {
  userCefrLevel?: string;
}

export const SpecializedTracksCard: React.FC<SpecializedTracksCardProps> = ({
  userCefrLevel = "A1",
}) => {
  const userRank = CEFR_RANKS[userCefrLevel.toUpperCase()] ?? 1;

  // Filter tracks to those that the learner has unlocked or show eligible tracks
  const unlockedTracks = SPECIALIZED_INDUSTRY_TRACKS.filter((track) => {
    const minRank = CEFR_RANKS[track.minimumCefrLevel.toUpperCase()] ?? 1;
    return userRank >= minRank;
  });

  const lockedTracks = SPECIALIZED_INDUSTRY_TRACKS.filter((track) => {
    const minRank = CEFR_RANKS[track.minimumCefrLevel.toUpperCase()] ?? 1;
    return userRank < minRank;
  });

  return (
    <Card
      className="border-0 bg-[var(--lx-surface)] shadow-lg shadow-slate-200/60 dark:shadow-none"
      title="Specialized Career Tracks"
      subtitle={`Industry-focused English for Dominican professionals (Your Level: ${userCefrLevel})`}
      action={
        <Link href="/learn/tracks">
          <Button variant="ghost" size="sm">
            View all ({SPECIALIZED_INDUSTRY_TRACKS.length}) →
          </Button>
        </Link>
      }
    >
      {unlockedTracks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--lx-border)] bg-[var(--lx-canvas)]/40 p-6 text-center">
          <p className="text-sm font-semibold text-[var(--lx-ink)]">
            Career Tracks unlock starting at CEFR A2
          </p>
          <p className="mt-1 text-xs text-[var(--lx-muted)]">
            Complete your A1 Foundations lessons or take the Placement Diagnostic to unlock BPO Call Center, Tourism, and Software Engineering English tracks.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {lockedTracks.map((track) => (
              <span
                key={track.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lx-border)] bg-[var(--lx-surface)] px-3 py-1 text-[11px] font-medium text-[var(--lx-muted)]"
              >
                🔒 {track.title} ({track.minimumCefrLevel}+)
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-3 pt-2 sm:grid-cols-3">
          {unlockedTracks.map((track) => (
            <Link
              key={track.id}
              href={`/learn/tracks/${track.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)]/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--lx-primary)]/50 hover:bg-[var(--lx-canvas)] hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="info">{track.targetIndustry}</Badge>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ Unlocked ({track.minimumCefrLevel}+)
                  </span>
                </div>
                <h4 className="mt-2.5 text-xs font-bold text-[var(--lx-ink)] group-hover:text-[var(--lx-primary)] transition-colors">
                  {track.title}
                </h4>
                <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[var(--lx-muted)]">
                  {track.description}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[var(--lx-border)] pt-2.5 text-[10px] font-bold text-[var(--lx-primary)]">
                <span>{track.modules.length} Modules</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </Link>
          ))}

          {lockedTracks.map((track) => (
            <div
              key={track.id}
              className="flex flex-col justify-between rounded-2xl border border-dashed border-[var(--lx-border)] bg-[var(--lx-canvas)]/30 p-4 opacity-70"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {track.targetIndustry}
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    🔒 Requires {track.minimumCefrLevel}
                  </span>
                </div>
                <h4 className="mt-2.5 text-xs font-bold text-[var(--lx-ink)]">
                  {track.title}
                </h4>
                <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[var(--lx-muted)]">
                  {track.description}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[var(--lx-border)] pt-2.5 text-[10px] font-semibold text-[var(--lx-muted)]">
                <span>Unlocks at {track.minimumCefrLevel}</span>
                <span>🔒</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

