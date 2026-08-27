"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";

interface StreakSummary { gamification: { streakDays: number; lastActivityAt: string | null } }

export default function StreakPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<StreakSummary["gamification"] | null>(null);
  useEffect(() => { void authenticatedFetch("/api/learning?studentDashboard=1").then(async (response) => { if (!response.ok) throw new Error("Unable to load streak."); const dashboard = await response.json() as StreakSummary; setSummary(dashboard.gamification); }).catch((error: unknown) => alert(error instanceof Error ? error.message : "Unable to load streak.")); }, []);
  return <div className="min-h-screen bg-[var(--learn-canvas)] p-4 sm:p-8"><div className="mx-auto max-w-3xl space-y-6"><div className="flex items-center justify-between border-b border-[#dfe7fb] pb-6"><div><h1 className="text-4xl font-extrabold tracking-[-.06em] text-[#071d67]">Your learning streak</h1><p className="text-[#4d5e8c]">Small, consistent learning sessions build progress.</p></div><Button variant="secondary" onClick={() => router.push("/dashboard")}>Back to dashboard</Button></div><Card title="Current streak" subtitle="Complete lessons on consecutive days to keep it going."><div className="py-6 text-center"><p className="text-6xl">🔥</p><p className="mt-3 text-4xl font-extrabold tracking-[-.06em] text-[#a66013]">{summary?.streakDays ?? 0} days</p><Badge variant="warning">Last activity: {summary?.lastActivityAt ? new Date(summary.lastActivityAt).toLocaleDateString() : "Start a lesson today"}</Badge></div></Card><Card title="How streaks work"><p className="text-sm leading-6 text-[#5d6f9d]">A day counts when a lesson is completed. Keep learning each day to grow the streak; after a missed day, the next completed lesson starts a new one.</p></Card></div></div>;
}
