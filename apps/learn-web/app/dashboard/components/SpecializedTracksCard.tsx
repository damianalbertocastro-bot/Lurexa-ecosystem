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
      <div className="grid gap-4 pt-2 sm:grid-cols-3">
        {SPECIALIZED_INDUSTRY_TRACKS.map((track) => {
          const minRank = CEFR_RANKS[track.minimumCefrLevel.toUpperCase()] ?? 1;
          const isUnlocked = userRank >= minRank;

          if (isUnlocked) {
            return (
              <Link
                key={track.id}
                href={`/learn/tracks/${track.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="info">{track.targetIndustry}</Badge>
                    <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                      ✓ Ready ({track.minimumCefrLevel}+)
                    </span>
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-[var(--lx-ink)] group-hover:text-[var(--lx-primary)] transition-colors">
                    {track.title}
                  </h4>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--lx-muted)]">
                    {track.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[var(--lx-border)] pt-3 text-xs font-bold text-[var(--lx-primary)]">
                  <span>{track.modules.length} Modules</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">Enter Course →</span>
                </div>
              </Link>
            );
          }

          return (
            <div
              key={track.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-5 select-none"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {track.targetIndustry}
                  </span>
                  <span className="rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300">
                    🔒 Blocked ({track.minimumCefrLevel}+)
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-bold text-[var(--lx-muted)]">
                  {track.title}
                </h4>
                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--lx-muted)]/80">
                  {track.description}
                </p>
              </div>
              <div className="mt-4 border-t border-slate-200/80 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between text-[11px] font-medium text-rose-600 dark:text-rose-400">
                  <span>Requires CEFR {track.minimumCefrLevel} (Your Level: {userCefrLevel})</span>
                  <span>🔒</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

