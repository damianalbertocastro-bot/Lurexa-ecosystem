"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";

interface PointsSummary { gamification: { totalPoints: number } }

export default function PointsPage() {
  const router = useRouter();
  const [points, setPoints] = useState<number | null>(null);
  useEffect(() => { void authenticatedFetch("/api/learning?studentDashboard=1").then(async (response) => { if (!response.ok) throw new Error("Unable to load points."); const dashboard = await response.json() as PointsSummary; setPoints(dashboard.gamification.totalPoints); }).catch((error: unknown) => alert(error instanceof Error ? error.message : "Unable to load points.")); }, []);
  return <div className="min-h-screen bg-[var(--learn-canvas)] p-4 sm:p-8"><div className="mx-auto max-w-3xl space-y-6"><div className="flex items-center justify-between border-b border-[#dfe7fb] pb-6"><div><h1 className="text-4xl font-extrabold tracking-[-.06em] text-[#071d67]">Points & rewards</h1><p className="text-[#6677a5]">Your points grow as lessons are completed.</p></div><Button variant="secondary" onClick={() => router.push("/dashboard")}>Back to dashboard</Button></div><Card title="Points balance" subtitle="10 points are earned for each completed lesson."><div className="py-6 text-center"><p className="text-6xl">✦</p><p className="mt-3 text-4xl font-extrabold tracking-[-.06em] text-[#592bd6]">{points ?? 0} points</p><Badge variant="info">Balance is cumulative</Badge></div></Card><Card title="Rewards coming next"><p className="text-sm leading-6 text-[#5d6f9d]">Points are being tracked now. Reward redemption has not been implemented yet, so this balance cannot currently be spent or exchanged.</p></Card></div></div>;
}
