"use client";

import { useEffect, useMemo, useState } from "react";
import { TeachService } from "@lurexa/backend";
import type { TeachCourse, TeachEnrollment } from "@lurexa/types";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";

const filters = ["all", "english-proficiency", "teaching-practice", "assessment", "ai-digital", "course-design"] as const;
const filterLabel: Record<(typeof filters)[number], string> = { all: "For you", "english-proficiency": "English growth", "teaching-practice": "Teaching practice", assessment: "Assessment", "ai-digital": "Technology", "course-design": "Course design" };

export default function CoursesPage() {
  const { user } = useTeachAuth();
  const [courses, setCourses] = useState<TeachCourse[]>([]);
  const [enrollments, setEnrollments] = useState<TeachEnrollment[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [busyCourse, setBusyCourse] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [nextCourses, nextEnrollments] = await Promise.all([TeachService.listPublishedCourses(), TeachService.listEnrollments(user.uid)]);
        setCourses(nextCourses);
        setEnrollments(nextEnrollments);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load professional learning.");
      }
    })();
  }, [user]);

  const visible = useMemo(() => filter === "all" ? courses : courses.filter((course) => course.track === filter), [courses, filter]);
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

  return <TeachShell active="Learn"><TeachPrivate><main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8"><section className="grid gap-7 lg:grid-cols-[1fr_.8fr] lg:items-end"><div><p className="text-[11px] font-extrabold tracking-[.18em] text-[#6b2bd9]">PROFESSIONAL LEARNING</p><h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-.055em] sm:text-6xl">Courses that end in capability, not just completion.</h1></div><p className="max-w-xl text-base leading-7 text-[#4d5e8c]">Every learning path connects knowledge to practice, reflection, evidence, and the educator profile. Enrollment and progress now persist to your Lurexa account.</p></section>

{error && <p role="alert" className="mt-6 rounded-2xl bg-[#fff0f2] p-4 text-sm font-bold text-[#b52c49]">{error}</p>}
<section className="mt-9 flex flex-wrap gap-2">{filters.map((item)=><button key={item} onClick={()=>setFilter(item)} className={`min-h-11 rounded-full border px-4 text-sm font-extrabold ${filter===item?"border-[#6b2bd9] bg-[#6b2bd9] text-white":"border-[#d7e0f6] bg-white text-[#536ba5]"}`}>{filterLabel[item]}</button>)}</section>

<section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((course,i)=>{const enrollment=enrollmentFor(course.id); return <article key={course.id} className="group flex min-h-[310px] flex-col rounded-[26px] border border-[#dfe6f8] bg-white p-6 shadow-[0_12px_30px_rgba(32,52,128,.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_38px_rgba(32,52,128,.1)]"><div className={`h-2 w-16 rounded-full ${i%3===0?"bg-[#6b2bd9]":i%3===1?"bg-[#315fd7]":"bg-[#12cdd4]"}`}/><p className="mt-6 text-[10px] font-extrabold uppercase tracking-[.15em] text-[#7180a8]">{filterLabel[course.track]}</p><h2 className="mt-2 text-2xl font-black tracking-[-.04em]">{course.title}</h2><p className="mt-3 text-sm leading-6 text-[#4d5e8c]">{course.description}</p><div className="mt-auto pt-6">{enrollment && <div className="mb-4"><div className="h-2 overflow-hidden rounded-full bg-[#edf1fb]"><div className="h-full rounded-full bg-gradient-to-r from-[#6b2bd9] to-[#12cdd4]" style={{width:`${enrollment.progressPercent}%`}}/></div><p className="mt-2 text-xs font-extrabold text-[#536ba5]">{enrollment.progressPercent}% complete</p></div>}<div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-[#8994b4]">{course.modules.length} modules</span>{enrollment ? <a href={`/courses/${course.id}`} className="inline-flex min-h-11 items-center rounded-xl bg-[#f0ecff] px-4 text-sm font-extrabold text-[#6b2bd9]">Continue →</a> : <button disabled={busyCourse===course.id} onClick={()=>enroll(course.id)} className="min-h-11 rounded-xl bg-[#071d67] px-4 text-sm font-extrabold text-white disabled:opacity-60">{busyCourse===course.id?"Enrolling…":"Enroll"}</button>}</div></div></article>})}</section>

{!visible.length && <div className="mt-8 rounded-[28px] border border-dashed border-[#ccd7f2] bg-white p-8 text-center text-sm text-[#4d5e8c]">No courses match this filter yet.</div>}
<section className="mt-12 rounded-[30px] bg-[#071d67] p-7 text-white sm:p-10"><div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-[10px] font-extrabold tracking-[.18em] text-[#8df4ef]">PERSONALIZED PATHWAYS</p><h2 className="mt-3 text-3xl font-black tracking-[-.045em]">Your profile should decide what comes next.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100">English level, goals, completed learning, verified evidence, and professional interests become inputs for Lurexa Mind recommendations.</p></div><a href="/growth" className="inline-flex min-h-12 items-center rounded-xl bg-white px-5 text-sm font-extrabold text-[#26358c]">View my growth map →</a></div></section></main></TeachPrivate></TeachShell>;
}
