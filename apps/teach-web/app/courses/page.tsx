"use client";

import { useEffect, useMemo, useState } from "react";
import { TeachService } from "@lurexa/backend";
import type { EducatorProfile, TeachCourse, TeachEnrollment } from "@lurexa/types";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";
import { Button } from "@lurexa/ui/button";

const filters = ["all", "english-proficiency", "teaching-practice", "assessment", "ai-digital", "course-design"] as const;
const filterLabel: Record<(typeof filters)[number], string> = { all: "For you", "english-proficiency": "English growth", "teaching-practice": "Teaching practice", assessment: "Assessment", "ai-digital": "Technology", "course-design": "Course design" };

export default function CoursesPage() {
  const { user } = useTeachAuth();
  const [courses, setCourses] = useState<TeachCourse[]>([]);
  const [enrollments, setEnrollments] = useState<TeachEnrollment[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [profile, setProfile] = useState<EducatorProfile | null>(null);
  const [busyCourse, setBusyCourse] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [nextCourses, nextEnrollments, nextProfile] = await Promise.all([
          TeachService.listPublishedCourses(),
          TeachService.listEnrollments(user.uid),
          TeachService.getEducatorProfile(user.uid),
        ]);
        setCourses(nextCourses);
        setEnrollments(nextEnrollments);
        setProfile(nextProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load professional learning.");
      }
    })();
  }, [user]);

  const visible = useMemo(() => {
    if (filter === "all") {
      // Prioritize recommended courses if educator has CEFR standing from diagnostic
      if (profile?.cefrLevel) {
        return [...courses].sort((a, b) => {
          const aMatch = a.cefrTarget === profile.cefrLevel ? -1 : 0;
          const bMatch = b.cefrTarget === profile.cefrLevel ? -1 : 0;
          return aMatch - bMatch;
        });
      }
      return courses;
    }
    return courses.filter((course) => course.track === filter);
  }, [courses, filter, profile]);
  const enrollmentFor = (courseId: string) => enrollments.find((item) => item.courseId === courseId);

  const enroll = async (courseId: string) => {
    if (!user) return;
    setBusyCourse(courseId);
    setError("");
    try {
      const enrollment = await TeachService.enroll(user.uid, courseId);
      setEnrollments((current) => current.some((item) => item.id === enrollment.id) ? current : [...current, enrollment]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enrollment failed.");
    } finally {
      setBusyCourse(null);
    }
  };

  return (
    <TeachShell active="Learn">
      <TeachPrivate>
        <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8">
          <section className="grid gap-7 lg:grid-cols-[1fr_.8fr] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold tracking-[.18em] text-[var(--lx-primary)]">PROFESSIONAL LEARNING</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-.055em] sm:text-6xl">Courses that end in capability, not just completion.</h1>
            </div>
            <p className="max-w-xl text-base leading-7 text-[var(--lx-muted)]">Every learning path connects knowledge to practice, reflection, evidence, and the educator profile. Enrollment and progress now persist to your Lurexa account.</p>
          </section>

          {error && <p role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-slate-900 shadow-xs dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100">{error}</p>}
          
          <section className="mt-9 flex flex-wrap gap-2">
            {filters.map((item) => (
              <Button key={item} onClick={() => setFilter(item)} className={`min-h-11 rounded-full border px-4 text-sm font-extrabold ${filter === item ? "border-[var(--lx-primary)] bg-[var(--lx-primary)] text-white" : "border-[var(--lx-border)] bg-[var(--lx-surface)] text-[var(--lx-muted)]"}`}>
                {filterLabel[item]}
              </Button>
            ))}
          </section>

          <section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((course, i) => {
              const enrollment = enrollmentFor(course.id);
              return (
                <article key={course.id} className="group flex min-h-[310px] flex-col rounded-[26px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-[var(--lx-card-shadow)] transition hover:-translate-y-1 hover:shadow-[0_20px_38px_rgba(32,52,128,.1)]">
                  <div className={`h-2 w-16 rounded-full ${i % 3 === 0 ? "bg-[var(--lx-primary)]" : i % 3 === 1 ? "bg-[var(--lx-secondary)]" : "bg-[var(--lx-accent)]"}`} />
                  <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[.15em] text-[var(--lx-muted)]">{filterLabel[course.track]}</p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-.04em]">{course.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--lx-muted)]">{course.description}</p>
                  <div className="mt-auto pt-6">
                    {enrollment && (
                      <div className="mb-4">
                        <div className="h-2 overflow-hidden rounded-full bg-[var(--lx-surface)]">
                          <div className="h-full rounded-full bg-gradient-to-r from-[var(--lx-primary)] to-[var(--lx-accent)]" style={{ width: `${enrollment.progressPercent}%` }} />
                        </div>
                        <p className="mt-2 text-xs font-extrabold text-[var(--lx-muted)]">{enrollment.progressPercent}% complete</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-[var(--lx-muted)]">{course.modules.length} modules</span>
                      {enrollment ? (
                        <a href={`/courses/${course.id}`} className="inline-flex min-h-11 items-center rounded-xl bg-[var(--lx-surface)] px-4 text-sm font-extrabold text-[var(--lx-primary)]">Continue →</a>
                      ) : (
                        <Button disabled={busyCourse === course.id} onClick={() => enroll(course.id)} className="min-h-11 rounded-xl bg-[var(--lx-primary)] px-4 text-sm font-extrabold text-white hover:opacity-90 disabled:opacity-60">{busyCourse === course.id ? "Enrolling…" : "Enroll"}</Button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {!visible.length && <div className="mt-8 rounded-[28px] border border-dashed border-[var(--lx-border)] bg-[var(--lx-surface)] p-8 text-center text-sm text-[var(--lx-muted)]">No courses match this filter yet.</div>}
          <section className="mt-12 rounded-[30px] bg-[#0a1931] p-7 text-white shadow-xl sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-[10px] font-black tracking-[.18em] text-[#50e3c2]">PERSONALIZED PATHWAYS</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-.045em] text-white">Your profile should decide what comes next.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100">English level, goals, completed learning, verified evidence, and professional interests become inputs for Lurexa Mind recommendations.</p>
              </div>
              <a href="/growth" className="inline-flex min-h-12 items-center rounded-xl bg-white px-6 text-sm font-extrabold text-slate-900 shadow-md transition hover:bg-slate-100">View my growth map →</a>
            </div>
          </section>
        </main>
      </TeachPrivate>
    </TeachShell>
  );
}
