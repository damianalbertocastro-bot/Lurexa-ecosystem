export default function LessonLoading() {
  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] px-4 py-8 sm:px-8" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-52 animate-pulse rounded-3xl bg-slate-200" />
        <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />
        <p className="text-sm font-medium text-slate-600">Loading your lesson…</p>
      </div>
    </main>
  );
}
