"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { TeachService } from "@lurexa/backend";
import type { TeachCourse, TeachEnrollment } from "@lurexa/types";
import { TeachShell } from "../../components/TeachShell";
import { TeachPrivate } from "../../components/TeachPrivate";
import { useTeachAuth } from "../../components/TeachAuthProvider";
import { useSoundEffects } from "@lurexa/ui/useSoundEffects";
import { useConfetti } from "@lurexa/ui/useConfetti";
import { Button } from "@lurexa/ui/button";

export default function CourseRuntimePage() {
  const params = useParams<{ courseId: string }>();
  const { user } = useTeachAuth();
  const { playSuccess, playAchievement } = useSoundEffects();
  const { triggerConfetti } = useConfetti();
  const [course, setCourse] = useState<TeachCourse | null>(null);
  const [enrollment, setEnrollment] = useState<TeachEnrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !params.courseId) return;
    (async () => {
      try {
        const [nextCourse, enrollments] = await Promise.all([
          TeachService.getCourse(params.courseId),
          TeachService.listEnrollments(user.uid),
        ]);
        setCourse(nextCourse);
        setEnrollment(enrollments.find((item) => item.courseId === params.courseId) ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load this course.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, params.courseId]);

  const completed = useMemo(() => new Set(enrollment?.completedModuleIds ?? []), [enrollment]);

  const ensureEnrollment = async () => {
    if (!user || !course) return null;
    if (enrollment) return enrollment;
    const next = await TeachService.enroll(user.uid, course.id);
    setEnrollment(next);
    return next;
  };

  const toggleModule = async (moduleId: string) => {
    if (!course) return;
    setSaving(moduleId);
    setError("");
    try {
      const current = await ensureEnrollment();
      if (!current) return;
      const ids = new Set(current.completedModuleIds);
      const isCompleting = !ids.has(moduleId);
      if (ids.has(moduleId)) ids.delete(moduleId); else ids.add(moduleId);
      const nextIds = Array.from(ids);
      await TeachService.updateEnrollmentProgress(current.id, nextIds, course.modules.length);
      const progressPercent = Math.round((nextIds.length / course.modules.length) * 100);
      setEnrollment({ ...current, completedModuleIds: nextIds, progressPercent, status: progressPercent === 100 ? "completed" : "active", updatedAt: new Date().toISOString() });
      if (isCompleting) {
        if (progressPercent === 100) {
          playAchievement();
          triggerConfetti();
        } else {
          playSuccess();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Progress could not be saved.");
    } finally {
      setSaving(null);
    }
  };

  return <TeachShell active="Learn"><TeachPrivate><main className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8">{loading ? <div role="status" className="py-20 text-center text-sm font-bold text-[var(--lx-muted)]">Loading course…</div> : !course ? <div className="rounded-[28px] border border-[var(--lx-surface)] bg-white p-8"><h1 className="text-2xl font-black">Course not found</h1><a href="/courses" className="mt-4 inline-flex text-sm font-extrabold text-[var(--lx-secondary)]">Back to professional learning →</a></div> : <><section className="rounded-[34px] bg-gradient-to-br from-[var(--color-brand-navy)] via-[#203b95] to-[var(--lx-primary)] p-7 text-white sm:p-10"><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[var(--lx-accent)]">{course.track.replaceAll("-", " ")}</p><h1 className="mt-3 max-w-4xl text-4xl font-black tracking-[-.055em] sm:text-6xl">{course.title}</h1><p className="mt-5 max-w-3xl text-base leading-7 text-indigo-100">{course.description}</p><div className="mt-8"><div className="h-3 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[var(--lx-accent)]" style={{width:`${enrollment?.progressPercent ?? 0}%`}}/></div><p className="mt-2 text-sm font-extrabold text-indigo-100">{enrollment?.progressPercent ?? 0}% complete</p></div></section>{error && <p role="alert" className="mt-5 rounded-2xl bg-[#fff0f2] p-4 text-sm font-bold text-[#b52c49]">{error}</p>}<section className="mt-7 grid gap-5 lg:grid-cols-[1fr_.36fr]"><article className="rounded-[28px] border border-[var(--lx-surface)] bg-white p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">LEARNING SEQUENCE</p><h2 className="mt-2 text-2xl font-black">Modules and evidence</h2>{course.modules.sort((a,b)=>a.order-b.order).map((module)=><div key={module.id} className="mt-6 border-t border-[#edf1fb] pt-6"><div className="flex items-start gap-4"><Button type="button" onClick={()=>toggleModule(module.id)} disabled={saving===module.id} aria-pressed={completed.has(module.id)} className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-sm font-black ${completed.has(module.id)?"border-[#157b70] bg-[#e4f8f2] text-[#157b70]":"border-[#d7e0f6] bg-white text-[var(--lx-primary)]"}`}>{saving===module.id?"…":completed.has(module.id)?"✓":module.order}</Button><div className="min-w-0"><h3 className="text-lg font-black">{module.title}</h3><p className="mt-2 text-sm leading-6 text-[var(--lx-muted)]">{module.description || "Learn the concept, apply it to educator practice, and record meaningful evidence when required."}</p>{module.evidenceRequired && <a href={`/growth?courseId=${course.id}&moduleId=${module.id}`} className="mt-3 inline-flex min-h-11 items-center text-sm font-extrabold text-[var(--lx-secondary)]">Submit evidence for this module →</a>}</div></div></div>)}</article><aside className="space-y-5"><article className="rounded-[28px] border border-[var(--lx-surface)] bg-white p-6"><p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">CAPABILITIES</p><div className="mt-4 flex flex-wrap gap-2">{course.competencyIds.map((item)=><span key={item} className="rounded-full bg-[#f0ecff] px-3 py-2 text-xs font-extrabold text-[var(--lx-primary)]">{item.replaceAll("-", " ")}</span>)}</div></article><article className="rounded-[28px] bg-[#fffaf2] p-6"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#a05e20]">COMPLETION RULE</p><p className="mt-3 text-sm leading-6 text-[#76664e]">Module completion tracks participation. Evidence-required modules still need appropriate portfolio evidence before they can support a credential.</p></article></aside></section></>}</main></TeachPrivate></TeachShell>;
}
