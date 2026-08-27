import { Skeleton } from "@lurexa/ui/Skeleton";

export default function TeachCoursesLoading() {
  return (
    <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 space-y-8 animate-fade-in">
      <div className="space-y-3">
        <Skeleton variant="line" className="h-3 w-32" />
        <Skeleton variant="heading" className="h-10 w-96" />
        <Skeleton variant="line" className="h-4 w-[500px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-72 rounded-3xl" />
        ))}
      </div>
    </main>
  );
}
