"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@lurexa/ui/Avatar";
import { useSoundEffects } from "@lurexa/ui/useSoundEffects";
import { useConfetti } from "@lurexa/ui/useConfetti";
import type { AuthenticatedUser } from "@lurexa/backend";

interface DashboardGreetingHeaderProps {
  user: AuthenticatedUser | null;
  streakDays: number;
  totalPoints: number;
  onOpenTour?: () => void;
}

export function getTimeOfDayGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function getDisplayName(user: AuthenticatedUser | null): string {
  if (!user) return "Learner";
  if (user.displayName && user.displayName.trim().length > 0) {
    return user.displayName.trim();
  }
  if (user.email && user.email.trim().length > 0) {
    const emailPrefix = user.email.split("@")[0] || "Learner";
    return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  }
  return "Learner";
}

const LEVEL_TITLES = [
  "Novice Explorer",
  "Curious Builder",
  "Active Speaker",
  "Fluent Communicator",
  "Language Master",
];

export const DashboardGreetingHeader: React.FC<DashboardGreetingHeaderProps> = ({
  user,
  streakDays,
  totalPoints,
  onOpenTour,
}) => {
  const router = useRouter();
  const { playClick, playAchievement } = useSoundEffects();
  const { triggerConfetti } = useConfetti();

  const greeting = useMemo(() => getTimeOfDayGreeting(), []);
  const displayName = useMemo(() => getDisplayName(user), [user]);

  // Level Progression Logic
  const level = Math.max(1, Math.floor(totalPoints / 100) + 1);
  const currentLevelProgress = totalPoints % 100;
  const levelTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  return (
    <header className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-[var(--lx-card-shadow)] sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left: Avatar + Greeting & Subhead */}
        <div className="flex items-center gap-4 sm:gap-5">
          <Avatar
            src={user?.photoURL}
            name={user?.displayName || user?.email}
            size="xl"
            online={true}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-[.18em] text-[var(--lx-primary)]">
                {greeting}
              </span>
              {onOpenTour && (
                <button
                  type="button"
                  onClick={onOpenTour}
                  className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-[var(--lx-primary)] transition hover:bg-indigo-500/20 focus:outline-none"
                  aria-label="Open guided onboarding tour"
                >
                  ✨ Tour
                </button>
              )}
            </div>
            <h1 className="mt-1 truncate text-2xl font-black tracking-tight text-[var(--lx-ink)] sm:text-3xl">
              {displayName}
            </h1>

            {/* Level & XP Mini Tracker */}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--lx-canvas)] border border-[var(--lx-border)] px-2.5 py-0.5 text-[11px] font-extrabold text-[var(--lx-ink)]">
                <span className="text-xs">⚡</span>
                Level {level}: {levelTitle}
              </span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-[var(--lx-canvas)] border border-[var(--lx-border)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--lx-primary)] to-[var(--lx-secondary)] transition-all duration-500"
                    style={{ width: `${currentLevelProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-[var(--lx-muted)]">
                  {currentLevelProgress}/100 XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Badges */}
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--lx-border)] pt-4 md:border-t-0 md:pt-0">
          <button
            type="button"
            className="group flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-left transition hover:border-amber-500/50 hover:bg-amber-500/15 focus:outline-none active:scale-95"
            onClick={() => {
              playAchievement();
              triggerConfetti();
              router.push("/dashboard/streak");
            }}
            aria-label={`View streak details: ${streakDays} day streak`}
          >
            <span className="text-xl group-hover:scale-125 transition-transform duration-200">🔥</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">Streak</p>
              <p className="text-sm font-black text-amber-950 dark:text-amber-100">{streakDays} {streakDays === 1 ? "Day" : "Days"}</p>
            </div>
          </button>

          <button
            type="button"
            className="group flex items-center gap-2.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-left transition hover:border-indigo-500/50 hover:bg-indigo-500/15 focus:outline-none active:scale-95"
            onClick={() => {
              playClick();
              router.push("/dashboard/points");
            }}
            aria-label={`View points & rewards: ${totalPoints} points`}
          >
            <span className="text-xl group-hover:scale-125 transition-transform duration-200">⭐</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300">Points</p>
              <p className="text-sm font-black text-indigo-950 dark:text-indigo-100">{totalPoints} Pts</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
