import React from "react";
import { Skeleton } from "@lurexa/ui/Skeleton";

export default function PlacementLoading() {
  return (
    <div className="min-h-screen bg-[var(--lx-canvas)] p-4 sm:p-8">
      <div className="mx-auto max-w-2xl space-y-6 pt-12">
        <Skeleton variant="heading" className="!h-10 !w-2/3 mx-auto" />
        <Skeleton variant="line" className="!h-4 !w-1/2 mx-auto" />
        <Skeleton variant="card" className="mt-8" />
      </div>
    </div>
  );
}
