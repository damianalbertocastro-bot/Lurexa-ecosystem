"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
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

export function getInitials(nameOrEmail?: string | null): string {
  if (!nameOrEmail) return "L";
  const cleaned = nameOrEmail.trim();
  if (cleaned.includes("@")) {
    const username = cleaned.split("@")[0] || "L";
    return username.slice(0, 2).toUpperCase();
  }
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
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

export const DashboardGreetingHeader: React.FC<DashboardGreetingHeaderProps> = ({
  user,
  streakDays,
  totalPoints,
  onOpenTour,
}) => {
  const router = useRouter();

  const greeting = useMemo(() => getTimeOfDayGreeting(), []);
  const displayName = useMemo(() => getDisplayName(user), [user]);
  const initials = useMemo(() => getInitials(user?.displayName || user?.email), [user]);
  const avatarUrl = user?.photoURL;

  return (
    <header className="rounded-3xl border border-[#dfe7fb] bg-white p-6 shadow-[0_12px_32px_rgba(32,52,128,.06)] sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left: Avatar + Greeting & Subhead */}
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative flex-shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={`${displayName}'s avatar`}
                className="h-16 w-16 rounded-2xl border-2 border-indigo-100 object-cover shadow-md shadow-indigo-100/50"
              />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-black text-white shadow-md shadow-indigo-500/20"
                aria-label={`Avatar initials: ${initials}`}
              >
                {initials}
              </div>
            )}
            <span
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[10px] text-white shadow-sm"
              title="Online"
              aria-hidden="true"
            >
              ✓
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-[.18em] text-indigo-700">
                {greeting}
              </span>
              {onOpenTour && (
                <button
                  type="button"
                  onClick={onOpenTour}
                  className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Open guided onboarding tour"
                >
                  ✨ Tour
                </button>
              )}
            </div>
            <h1 className="mt-1 truncate text-2xl font-black tracking-tight text-[#071d67] sm:text-3xl">
              {displayName}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Keep your momentum. Pick up exactly where you left off.
            </p>
          </div>
        </div>

        {/* Right: Quick Action Badges */}
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
          <button
            type="button"
            className="group flex items-center gap-2 rounded-2xl border border-amber-200/80 bg-amber-50/70 px-4 py-2.5 text-left transition hover:border-amber-300 hover:bg-amber-100/60 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            onClick={() => router.push("/dashboard/streak")}
            aria-label={`View streak details: ${streakDays} day streak`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🔥</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Streak</p>
              <p className="text-sm font-black text-amber-950">{streakDays} {streakDays === 1 ? "Day" : "Days"}</p>
            </div>
          </button>

          <button
            type="button"
            className="group flex items-center gap-2 rounded-2xl border border-indigo-200/80 bg-indigo-50/70 px-4 py-2.5 text-left transition hover:border-indigo-300 hover:bg-indigo-100/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => router.push("/dashboard/points")}
            aria-label={`View points & rewards: ${totalPoints} points`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">⭐</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">Points</p>
              <p className="text-sm font-black text-indigo-950">{totalPoints} Pts</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
