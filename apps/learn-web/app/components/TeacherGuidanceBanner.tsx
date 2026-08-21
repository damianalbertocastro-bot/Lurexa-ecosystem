"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import type { TeacherInterventionBrief } from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";

function readError(payload: unknown, fallback: string): string {
  if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
    const error = (payload as { error?: unknown }).error;
    if (typeof error === "string") return error;
  }
  return fallback;
}

export function TeacherGuidanceBanner() {
  const pathname = usePathname();
  const router = useRouter();
  const [guidance, setGuidance] = useState<TeacherInterventionBrief | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/teacher")) return;
    const unsubscribe = AuthService.onUserChanged(async (user) => {
      if (!user) {
        setGuidance(null);
        return;
      }
      try {
        const response = await authenticatedFetch("/api/learning/teacher-intervention?learner=1");
        const body: unknown = await response.json();
        if (!response.ok) throw new Error(readError(body, "Unable to load teacher guidance."));
        const items = body as TeacherInterventionBrief[];
        setGuidance(items[0] ?? null);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to load teacher guidance.");
      }
    });
    return unsubscribe;
  }, [pathname]);

  if (pathname.startsWith("/teacher") || !guidance?.response) return null;

  const currentGuidance = guidance;
  const response = currentGuidance.response;
  const lessonHref = currentGuidance.recentLessonId
    ? `/learn/${currentGuidance.courseId}/${currentGuidance.recentLessonId}`
    : null;

  async function acknowledge() {
    if (closing) return;
    setClosing(true);
    setError(null);
    try {
      const result = await authenticatedFetch("/api/learning/teacher-intervention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "acknowledge", interventionId: currentGuidance.id }),
      });
      const body: unknown = await result.json();
      if (!result.ok) throw new Error(readError(body, "Unable to mark teacher guidance as reviewed."));
      setGuidance(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to mark teacher guidance as reviewed.");
    } finally {
      setClosing(false);
    }
  }

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-3xl border border-emerald-200 bg-white p-5 shadow-2xl shadow-emerald-950/15 sm:bottom-6 sm:p-6" aria-live="polite">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-emerald-700">Teacher guidance</p>
          <h2 className="mt-2 text-lg font-bold text-slate-950">Your teacher sent a next step.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{response.teacherNote}</p>
          <div className="mt-3 rounded-2xl bg-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">Recommended action</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{response.recommendedAction}</p>
            <p className="mt-2 text-xs text-slate-600">Priority: {response.priority}</p>
          </div>
          {error ? <p className="mt-3 text-sm font-medium text-rose-700" role="alert">{error}</p> : null}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:max-w-[220px] sm:justify-end">
          {lessonHref ? (
            <button type="button" onClick={() => router.push(lessonHref)} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500">
              Open recommended lesson
            </button>
          ) : null}
          <button type="button" onClick={() => void acknowledge()} disabled={closing} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {closing ? "Saving…" : "Mark as reviewed"}
          </button>
        </div>
      </div>
    </aside>
  );
}
