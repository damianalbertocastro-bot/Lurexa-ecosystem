import React from "react";
import { Skeleton } from "@lurexa/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--lx-canvas)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8 animate-pulse">
        {/* Greeting Header Skeleton */}
        <div className="rounded-3xl border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <Skeleton variant="avatar" className="!h-16 !w-16 !rounded-2xl" />
              <div className="space-y-2">
                <Skeleton variant="line" className="!h-3 !w-28" />
                <Skeleton variant="heading" className="!h-7 !w-48" />
                <Skeleton variant="line" className="!h-4 !w-64" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-12 w-28 rounded-2xl bg-slate-100 dark:bg-slate-800" />
              <div className="h-12 w-28 rounded-2xl bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
          <div className="space-y-6">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        </div>
      </div>
    </div>
  );
}
