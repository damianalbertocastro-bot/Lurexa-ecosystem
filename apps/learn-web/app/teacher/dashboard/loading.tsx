import React from "react";
import { Skeleton } from "@lurexa/ui/Skeleton";

export default function TeacherDashboardLoading() {
  return (
    <div>
      {/* Banner Skeleton */}
      <section className="border-b border-[#dfe7fb] bg-gradient-to-br from-white via-white to-[#f0f3ff] p-6 sm:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-2">
            <Skeleton variant="line" className="!h-3.5 !w-36" />
            <Skeleton variant="heading" className="!h-8 !w-72" />
            <Skeleton variant="line" className="!h-4 !w-96" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
        <Skeleton variant="card" />
      </div>
    </div>
  );
}
