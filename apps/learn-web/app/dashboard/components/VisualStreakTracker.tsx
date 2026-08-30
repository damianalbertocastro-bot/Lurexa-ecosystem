"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@lurexa/ui/Card";
import { Button } from "@lurexa/ui/button";

interface VisualStreakTrackerProps {
  streakDays: number;
  lastActivityAt?: string | null;
}

interface DayState {
  dayLabel: string;
  dayNumber: number;
  isToday: boolean;
  isCompleted: boolean;
  isFuture: boolean;
}

export const VisualStreakTracker: React.FC<VisualStreakTrackerProps> = ({
  streakDays,
  lastActivityAt,
}) => {
  const router = useRouter();

  // MOCK_DATA: Map 7-day rolling window (Mon-Sun) based on client date and streak count
  const weekDays = useMemo<DayState[]>(() => {
    const today = new Date();
    const currentDayIndex = (today.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const dayNames = ["M", "T", "W", "T", "F", "S", "S"];

    return dayNames.map((dayLabel, index) => {
      const isToday = index === currentDayIndex;
      const isFuture = index > currentDayIndex;

      let isCompleted = false;
      if (!isFuture) {
        const daysAgo = currentDayIndex - index;
        if (streakDays > daysAgo) {
          isCompleted = true;
        }
      }

      const dateOffset = index - currentDayIndex;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + dateOffset);

      return {
        dayLabel,
        dayNumber: targetDate.getDate(),
        isToday,
        isCompleted,
        isFuture,
      };
    });
  }, [streakDays]);

  return (
    <Card
      className="border-0 bg-[var(--lx-surface)] shadow-lg shadow-slate-200/60 dark:shadow-none"
      title="Learning streak"
      subtitle="7-day momentum tracker"
    >
      <div className="space-y-4 pt-2">
        {/* Main Flame Counter & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-4xl select-none ${streakDays > 0 ? "animate-float" : "opacity-60"}`}>
              🔥
            </span>
            <div>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {streakDays} {streakDays === 1 ? "Day" : "Days"}
              </p>
              <p className="text-xs font-semibold text-[var(--lx-muted)]">
                {streakDays > 0 ? "Momentum active!" : "Start a lesson today"}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/streak")}
            className="rounded-xl px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 transition hover:bg-amber-50 dark:hover:bg-amber-950/40"
            aria-label="View full streak breakdown"
          >
            Details →
          </Button>
        </div>

        {/* Horizontal 7-Day Visual Row */}
        <div className="rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)]/80 p-3">
          <div className="grid grid-cols-7 gap-1 text-center sm:gap-2">
            {weekDays.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-bold text-[var(--lx-muted)]">
                  {day.dayLabel}
                </span>

                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-all duration-200 motion-reduce:transform-none ${
                    day.isCompleted
                      ? "animate-spring-pop bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm shadow-amber-500/30"
                      : day.isToday
                      ? "border-2 border-[var(--lx-primary)] bg-[var(--lx-surface)] text-[var(--lx-primary)] shadow-sm"
                      : "border border-[var(--lx-border)] bg-[var(--lx-surface)] text-[var(--lx-muted)] opacity-70"
                  } ${day.isToday ? "ring-2 ring-[var(--lx-primary)]/25 ring-offset-1" : ""}`}
                  title={`${day.dayLabel} - ${
                    day.isCompleted
                      ? "Completed"
                      : day.isToday
                      ? "Today"
                      : day.isFuture
                      ? "Upcoming"
                      : "Rest day"
                  }`}
                  aria-label={`${day.dayLabel}, ${
                    day.isCompleted ? "completed" : day.isToday ? "today" : "missed"
                  }`}
                >
                  {day.isCompleted ? (
                    <span className="text-[11px] select-none">🔥</span>
                  ) : (
                    <span>{day.dayNumber}</span>
                  )}

                  {day.isToday && (
                    <span className="absolute -top-1 -right-0.5 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--lx-primary)] opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--lx-primary)]" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {lastActivityAt && (
          <p className="text-right text-[11px] text-[var(--lx-muted)]">
            Last completed: {new Date(lastActivityAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </Card>
  );
};
