import React from "react";
import { Skeleton } from "@lurexa/ui/Skeleton";

export default function TeacherCoursesLoading() {
  return (
    <div>
      <section className="border-b border-[#dfe7fb] bg-gradient-to-br from-white via-white to-[#f0f3ff] p-6 sm:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-2">
            <Skeleton variant="line" className="!h-3.5 !w-24" />
            <Skeleton variant="heading" className="!h-8 !w-64" />
            <Skeleton variant="line" className="!h-4 !w-80" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Skeleton variant="card" count={3} />
      </div>
    </div>
  );
}
