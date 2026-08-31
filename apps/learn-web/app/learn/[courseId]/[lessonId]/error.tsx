"use client";

import { useEffect } from "react";
import { Button } from "@lurexa/ui/button";

export default function LessonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unable to render lesson", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] px-4 py-8 sm:px-8">
      <section className="mx-auto max-w-2xl rounded-3xl bg-[var(--lx-surface)] p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">Lurexa Learn</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">We couldn’t open this lesson.</h1>
        <p className="mt-3 text-[var(--lx-muted)]">Try again. If the issue continues, return to your dashboard and reopen the lesson.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={reset} className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">Try again</Button>
          <a href="/dashboard" className="rounded-xl border border-[var(--lx-border)] px-5 py-3 font-semibold text-[var(--lx-ink)]">Back to dashboard</a>
        </div>
      </section>
    </main>
  );
}
