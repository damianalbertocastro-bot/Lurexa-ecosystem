"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/button";
import { useSoundEffects } from "@lurexa/ui/useSoundEffects";
import { useConfetti } from "@lurexa/ui/useConfetti";

interface Milestone {
  id: string;
  icon: string;
  title: string;
  description: string;
  earnedDate: string;
  isUnlocked: boolean;
}

interface MilestoneAchievementsCardProps {
  completedLessonsCount: number;
  streakDays: number;
  totalPoints: number;
  hasCompletedCourse: boolean;
  onStartLesson?: () => void;
}

export const MilestoneAchievementsCard: React.FC<MilestoneAchievementsCardProps> = ({
  completedLessonsCount,
  streakDays,
  totalPoints,
  hasCompletedCourse,
  onStartLesson,
}) => {
  const router = useRouter();
  const { playAchievement, playClick } = useSoundEffects();
  const { triggerConfetti } = useConfetti();

  // Authentic system milestones mapped strictly from verified progress events
  const earnedMilestones = useMemo<Milestone[]>(() => {
    const list: Milestone[] = [];

    if (completedLessonsCount >= 1) {
      list.push({
        id: "first_lesson",
        icon: "🎓",
        title: "First Step Forward",
        description: "Completed your first interactive lesson",
        earnedDate: "Active milestone",
        isUnlocked: true,
      });
    }

    if (streakDays >= 3) {
      list.push({
        id: "streak_3",
        icon: "🔥",
        title: "3-Day Consistency",
        description: "Built momentum across 3 consecutive days",
        earnedDate: "Active streak",
        isUnlocked: true,
      });
    }

    if (totalPoints >= 100) {
      list.push({
        id: "points_100",
        icon: "⭐",
        title: "Century Club",
        description: "Earned 100+ learning points",
        earnedDate: "Achieved",
        isUnlocked: true,
      });
    }

    if (hasCompletedCourse) {
      list.push({
        id: "course_mastery",
        icon: "🏆",
        title: "Course Graduate",
        description: "Fully completed an English learning path",
        earnedDate: "Achieved",
        isUnlocked: true,
      });
    }

    return list;
  }, [completedLessonsCount, streakDays, totalPoints, hasCompletedCourse]);

  return (
    <Card
      className="border-0 bg-[var(--lx-surface)] shadow-lg shadow-slate-200/60 dark:shadow-none"
      title="Recent milestones"
      subtitle="Authentic learning achievements"
      action={
        earnedMilestones.length > 0 ? (
          <Badge variant="info">{earnedMilestones.length} Earned</Badge>
        ) : null
      }
    >
      <div className="space-y-4 pt-2">
        {earnedMilestones.length > 0 ? (
          <div className="space-y-3">
            {earnedMilestones.map((milestone) => (
              <div
                key={milestone.id}
                onClick={() => {
                  playAchievement();
                  triggerConfetti();
                }}
                role="button"
                tabIndex={0}
                aria-label={`Milestone: ${milestone.title}`}
                className="group flex cursor-pointer items-center gap-3.5 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)]/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--lx-primary)]/40 hover:bg-[var(--lx-canvas)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-focus-ring)] active:scale-[0.99] motion-reduce:transform-none"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] text-xl shadow-xs transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none">
                  {milestone.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-[var(--lx-ink)]">
                    {milestone.title}
                  </p>
                  <p className="truncate text-[11px] text-[var(--lx-muted)]">
                    {milestone.description}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--lx-primary)]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--lx-primary)]">
                  {milestone.earnedDate}
                </span>
              </div>
            ))}

            <div className="pt-1 text-right">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  playClick();
                  router.push("/dashboard/points");
                }}
                className="rounded-xl px-2 text-xs font-bold text-[var(--lx-primary)] hover:text-[var(--lx-primary)]/80"
              >
                View all points & achievements →
              </Button>
            </div>
          </div>
        ) : (
          /* Clean motivating empty state */
          <div className="rounded-2xl border border-dashed border-[var(--lx-border)] bg-[var(--lx-canvas)]/50 p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-surface)] text-2xl shadow-xs">
              🎯
            </div>
            <p className="mt-3 text-xs font-bold text-[var(--lx-ink)]">
              No milestones unlocked yet
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[var(--lx-muted)]">
              Complete your first interactive lesson or Coach session to earn your first milestone badge.
            </p>
            {onStartLesson && (
              <Button
                variant="primary"
                size="sm"
                className="mt-3 w-full"
                onClick={onStartLesson}
              >
                Start First Lesson
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
