"use client";

import { useEffect, useMemo, useState } from "react";
import type { LearnerPulseProjectionV1, TeachInstructionalRosterV1, TeachRosterLearnerV1 } from "@lurexa/types";
import { LearnerPulse } from "@lurexa/ui/LearnerPulse";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";

const signatureEnabled = process.env.NEXT_PUBLIC_TEACH_SIGNATURE_V1 === "on";

async function authenticatedJson<T>(user: NonNullable<ReturnType<typeof useTeachAuth>["user"]>, url: string): Promise<T> {
  const token = await user.getIdToken();
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const body = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(body.error ?? "Unable to load instructional support.");
  return body;
}

export default function StudentsPage() {
  const { user } = useTeachAuth();
  const [roster, setRoster] = useState<TeachInstructionalRosterV1 | null>(null);
  const [selected, setSelected] = useState<TeachRosterLearnerV1 | null>(null);
  const [pulse, setPulse] = useState<LearnerPulseProjectionV1 | null>(null);
  const [loadingRoster, setLoadingRoster] = useState(true);
  const [loadingPulse, setLoadingPulse] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    void authenticatedJson<TeachInstructionalRosterV1>(user, "/api/teach/roster")
      .then((value) => {
        if (!active) return;
        setRoster(value);
        setSelected(value.courses.flatMap((course) => course.learners)[0] ?? null);
      })
      .catch((reason) => active && setError(reason instanceof Error ? reason.message : "Unable to load roster."))
      .finally(() => active && setLoadingRoster(false));
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!user || !selected || !signatureEnabled) {
      setPulse(null);
      return;
    }
    let active = true;
    setLoadingPulse(true);
    setError(null);
    const params = new URLSearchParams({
      learnerId: selected.learnerId,
      organizationId: selected.organizationId,
    });
    void authenticatedJson<LearnerPulseProjectionV1>(user, `/api/teach/signature?${params.toString()}`)
      .then((value) => active && setPulse(value))
      .catch((reason) => active && setError(reason instanceof Error ? reason.message : "Unable to load learner support."))
      .finally(() => active && setLoadingPulse(false));
    return () => { active = false; };
  }, [user, selected]);

  const learnerCount = useMemo(() => roster?.courses.reduce((total, course) => total + course.learners.length, 0) ?? 0, [roster]);

  return <TeachShell active="Students"><TeachPrivate><main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8">
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div><p className="text-[11px] font-extrabold tracking-[.18em] text-[#6b2bd9]">INSTRUCTIONAL SUPPORT</p><h1 className="mt-3 text-4xl font-black tracking-[-.055em] sm:text-5xl">Learners in your courses.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#6677a5]">Select a learner from an authorized course roster. Teach requests only the purpose-scoped Core projection needed for instructional support.</p></div>
      <div className="rounded-2xl border border-[#dfe6f8] bg-white px-5 py-4 text-sm text-[#536ba5]"><b className="block text-2xl text-[#071d67]">{loadingRoster ? "—" : learnerCount}</b> participating learners</div>
    </div>

    {error && <div role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-800">{error}</div>}

    <div className="mt-8 grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
      <section aria-label="Authorized course rosters" className="rounded-[28px] border border-[#dfe6f8] bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-extrabold tracking-[.16em] text-[#6b2bd9]">COURSE ROSTERS</p><h2 className="mt-2 text-xl font-black">Choose a learner</h2></div><span className="rounded-full bg-[#f0ecff] px-3 py-1.5 text-xs font-extrabold text-[#6b2bd9]">Core authorized</span></div>
        <div className="mt-5 space-y-5">
          {loadingRoster ? <p className="text-sm text-[#6677a5]" aria-live="polite">Loading authorized roster…</p> : roster?.courses.length ? roster.courses.map((course) => <div key={course.courseId}><p className="mb-2 text-xs font-extrabold uppercase tracking-[.12em] text-[#7180a8]">{course.courseTitle}</p><div className="space-y-2">{course.learners.length ? course.learners.map((learner) => <button key={`${course.courseId}:${learner.learnerId}`} type="button" onClick={() => setSelected(learner)} aria-pressed={selected?.learnerId === learner.learnerId && selected.courseId === learner.courseId} className={`w-full rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7] ${selected?.learnerId === learner.learnerId && selected.courseId === learner.courseId ? "border-[#6b2bd9] bg-[#f0ecff]" : "border-[#e3e9f7] bg-[#fbfcff] hover:border-[#b9c5ea]"}`}><div className="flex items-center justify-between gap-4"><div><b className="text-[#132a72]">{learner.displayName}</b><p className="mt-1 text-xs text-[#7180a8]">{learner.completedLessons}/{learner.totalLessons} lessons completed</p></div><span className="text-sm font-black text-[#315fd7]">{learner.progressPercent}%</span></div></button>) : <p className="rounded-2xl bg-[#f7f9ff] p-4 text-sm text-[#6677a5]">No participating learners yet.</p>}</div></div>) : <p className="text-sm text-[#6677a5]">No authorized course participation is available yet.</p>}
        </div>
      </section>

      <section aria-label="Learner instructional support" className="min-w-0">
        {!selected ? <div className="rounded-[28px] border border-dashed border-[#cbd6f1] bg-white p-8 text-sm text-[#6677a5]">Select a learner from an authorized roster to review instructional support.</div> : <>
          <article className="mb-5 rounded-[24px] border border-[#dfe6f8] bg-white p-5"><p className="text-[10px] font-extrabold tracking-[.16em] text-[#6b2bd9]">SELECTED LEARNER</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-black">{selected.displayName}</h2><p className="mt-1 text-sm text-[#6677a5]">{selected.courseTitle} · {selected.progressPercent}% course progress</p></div><span className="rounded-full bg-[#eef3ff] px-3 py-1.5 text-xs font-bold text-[#315fd7]">Purpose: teacher instructional support</span></div></article>
          {!signatureEnabled ? <div className="rounded-[28px] border border-[#dfe6f8] bg-white p-7"><p className="text-[10px] font-extrabold tracking-[.16em] text-[#6b2bd9]">SIGNATURE EXPERIENCE</p><h3 className="mt-2 text-xl font-black">Learner Pulse rollout is currently off.</h3><p className="mt-3 text-sm leading-6 text-[#6677a5]">Set <code className="rounded bg-[#f1f4fb] px-1.5 py-1">NEXT_PUBLIC_TEACH_SIGNATURE_V1=on</code> in a controlled environment to enable the purpose-scoped Pulse for roster-selected learners.</p></div> : loadingPulse ? <div aria-live="polite" className="rounded-[28px] border border-[#dfe6f8] bg-white p-7 text-sm text-[#6677a5]">Loading evidence-aware learner support…</div> : pulse ? <LearnerPulse pulse={pulse} /> : <div className="rounded-[28px] border border-[#dfe6f8] bg-white p-7 text-sm text-[#6677a5]">No learner projection is available for this selection.</div>}
        </>}
      </section>
    </div>

    {roster?.limitations?.length ? <aside className="mt-6 rounded-2xl bg-[#f7f9ff] px-5 py-4 text-xs leading-5 text-[#6677a5]"><b className="text-[#30457f]">Roster limitations:</b> {roster.limitations.join(" ")}</aside> : null}
  </main></TeachPrivate></TeachShell>;
}
