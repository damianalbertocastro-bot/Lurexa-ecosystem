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
  // When granular per-day activity logs become exposed from Core/persistence, this mock mapper will be replaced with direct daily records.
  const weekDays = useMemo<DayState[]>(() => {
    const today = new Date();
    const currentDayIndex = (today.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const dayNames = ["M", "T", "W", "T", "F", "S", "S"];

    return dayNames.map((dayLabel, index) => {
      const isToday = index === currentDayIndex;
      const isFuture = index > currentDayIndex;

      // Calculate if this day in the past week falls within the active streak
      let isCompleted = false;
      if (!isFuture) {
        const daysAgo = currentDayIndex - index;
        if (streakDays > daysAgo) {
          isCompleted = true;
        }
      }

      // Compute display date number
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
      className="border-0 bg-white shadow-lg shadow-slate-200/60"
      title="Learning streak"
      subtitle="7-day momentum tracker"
    >
      <div className="space-y-4 pt-2">
        {/* Main Flame Counter & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🔥</span>
            <div>
              <p className="text-2xl font-black text-amber-600">
                {streakDays} {streakDays === 1 ? "Day" : "Days"}
              </p>
              <p className="text-xs font-semibold text-slate-500">
                {streakDays > 0 ? "Momentum active!" : "Start a lesson today"}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => router.push("/dashboard/streak")}
            className="rounded-xl px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="View full streak breakdown"
          >
            Details →
          </Button>
        </div>

        {/* Horizontal 7-Day Visual Row */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="grid grid-cols-7 gap-1 text-center sm:gap-2">
            {weekDays.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400">
                  {day.dayLabel}
                </span>

                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-all ${
                    day.isCompleted
                      ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm shadow-amber-500/30"
                      : day.isToday
                      ? "border-2 border-indigo-600 bg-white text-indigo-600 shadow-sm"
                      : "border border-slate-200 bg-white text-slate-400"
                  } ${day.isToday ? "ring-2 ring-indigo-200 ring-offset-1" : ""}`}
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
                    <span className="text-[11px]">🔥</span>
                  ) : (
                    <span>{day.dayNumber}</span>
                  )}

                  {day.isToday && (
                    <span className="absolute -top-1 -right-0.5 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-600" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {lastActivityAt && (
          <p className="text-right text-[11px] text-slate-400">
            Last completed: {new Date(lastActivityAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </Card>
  );
};
