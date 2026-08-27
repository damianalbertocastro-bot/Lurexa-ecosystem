import { Skeleton } from "@lurexa/ui/Skeleton";

export default function TeachDashboardLoading() {
  return (
    <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="space-y-2">
          <Skeleton variant="line" className="h-3 w-32" />
          <Skeleton variant="heading" className="h-10 w-72" />
          <Skeleton variant="line" className="h-4 w-96" />
        </div>
        <Skeleton variant="card" className="h-12 w-44 rounded-xl" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <Skeleton variant="card" className="h-64 rounded-3xl" />
        <Skeleton variant="card" className="h-64 rounded-3xl" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Skeleton variant="card" className="h-80 rounded-3xl" />
        <Skeleton variant="card" className="h-80 rounded-3xl" />
      </div>
    </main>
  );
}
