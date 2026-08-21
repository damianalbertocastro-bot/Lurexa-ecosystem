"use client";

import { useEffect, useMemo, useState } from "react";
import { TeachMindService, TeachService } from "@lurexa/backend";
import type { TeachEnrollment, TeachEvidenceSubmission, TeachRecommendation } from "@lurexa/types";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";

export default function DashboardPage() {
  const { user, profile } = useTeachAuth();
  const [enrollments, setEnrollments] = useState<TeachEnrollment[]>([]);
  const [evidence, setEvidence] = useState<TeachEvidenceSubmission[]>([]);
  const [recommendations, setRecommendations] = useState<TeachRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [nextEnrollments, nextEvidence, nextRecommendations] = await Promise.all([
          TeachService.listEnrollments(user.uid),
          TeachService.listEvidence(user.uid),
          TeachService.listRecommendations(user.uid).catch(() => []),
        ]);
        setEnrollments(nextEnrollments);
        setEvidence(nextEvidence);
        setRecommendations(nextRecommendations);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const activeEnrollment = useMemo(() => enrollments.find((item) => item.status === "active") ?? enrollments[0], [enrollments]);
  const verifiedEvidence = evidence.filter((item) => item.status === "verified").length;
  const submittedEvidence = evidence.filter((item) => item.status === "submitted").length;
  const englishLabel = profile?.cefrLevel ?? "Set level";
  const target = profile?.targetCefrLevel ? `Target ${profile.targetCefrLevel}` : "Choose a target level";
  const mind = useMemo(() => recommendations[0] ?? (profile ? TeachMindService.recommendNextStep(profile, enrollments, evidence) : null), [recommendations, profile, enrollments, evidence]);

  return <TeachShell active="Dashboard"><TeachPrivate><main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-[11px] font-extrabold tracking-[.18em] text-[#6b2bd9]">MY PROFESSIONAL GROWTH</p><h1 className="mt-3 text-4xl font-black tracking-[-.055em] sm:text-5xl">Welcome back, {profile?.displayName || "educator"}.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#6677a5]">Your learning, evidence, credentials, and community activity now persist in one educator profile.</p></div><a href="/courses" className="inline-flex min-h-12 items-center rounded-xl bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] px-5 text-sm font-extrabold text-white">Continue learning →</a></div>

<section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
  ["English level", englishLabel, target],
  ["Active learning", activeEnrollment ? `${activeEnrollment.progressPercent}%` : "Not enrolled", activeEnrollment ? "Current course progress" : "Choose a professional course"],
  ["Evidence", String(evidence.length), `${verifiedEvidence} verified · ${submittedEvidence} awaiting review`],
  ["Community", String(profile?.communityContributionScore ?? 0), "Contribution score"],
].map(([label,value,detail],i)=><article key={label} className={`rounded-[24px] border p-6 shadow-[0_12px_30px_rgba(32,52,128,.06)] ${i===0?"border-[#cdc6ff] bg-[#f0ecff]":"border-[#dfe6f8] bg-white"}`}><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#6e7da5]">{label}</p><b className="mt-3 block text-3xl tracking-[-.05em]">{loading ? "—" : value}</b><p className="mt-2 text-sm font-bold text-[#536ba5]">{detail}</p></article>)}</section>

<section className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_.75fr]"><article className="rounded-[28px] border border-[#dfe6f8] bg-white p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#6b2bd9]">CURRENT PATH</p><h2 className="mt-3 text-2xl font-black tracking-[-.04em]">{activeEnrollment ? "Your current professional learning path" : "Start a professional learning path"}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#6677a5]">Teach connects course progress to evidence and the persistent educator profile rather than treating completion as the final outcome.</p><div className="mt-7 h-3 overflow-hidden rounded-full bg-[#edf1fb]"><div className="h-full rounded-full bg-gradient-to-r from-[#6b2bd9] via-[#315fd7] to-[#12cdd4]" style={{width:`${activeEnrollment?.progressPercent ?? 0}%`}}/></div><div className="mt-5 flex items-center justify-between gap-3 text-sm"><b>{activeEnrollment ? `${activeEnrollment.progressPercent}% complete` : "No active enrollment"}</b><a href="/courses" className="font-extrabold text-[#315fd7]">Browse learning →</a></div></article><article className="rounded-[28px] bg-gradient-to-br from-[#071d67] to-[#315fd7] p-7 text-white"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#8df4ef]">LUREXA MIND · NEXT BEST STEP</p><h2 className="mt-3 text-2xl font-black tracking-[-.04em]">{mind?.title ?? "Build enough evidence for a personalized next step."}</h2><p className="mt-4 text-sm leading-6 text-indigo-100">{mind?.rationale ?? "As you complete learning, submit evidence, and set goals, Lurexa Mind can recommend the next highest-value action."}</p><a href={mind?.actionHref ?? "/growth"} className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-extrabold text-[#24358e]">{mind?.actionLabel ?? "Update growth profile"} →</a>{recommendations.length===0&&mind&&<p className="mt-3 text-[11px] font-bold text-indigo-200">MVP recommendation generated from current authorized Teach state.</p>}</article></section>

<section className="mt-5 grid gap-5 lg:grid-cols-2"><article className="rounded-[28px] border border-[#dfe6f8] bg-white p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#6b2bd9]">EVIDENCE PIPELINE</p><h2 className="mt-2 text-2xl font-black">Professional growth with proof.</h2>{evidence.length ? evidence.slice(0,3).map((item)=><div key={item.id} className="mt-5 border-t border-[#edf1fb] pt-5"><div className="flex items-center justify-between gap-4"><div><b>{item.title}</b><p className="mt-1 text-xs text-[#7180a8]">{item.type.replaceAll("-", " ")}</p></div><span className="rounded-full bg-[#f0ecff] px-3 py-1.5 text-xs font-extrabold capitalize text-[#6b2bd9]">{item.status}</span></div></div>) : <p className="mt-5 rounded-2xl bg-[#f7f9ff] p-5 text-sm leading-6 text-[#6677a5]">No evidence yet. Submit a classroom artifact, reflection, practice simulation, or eligible peer contribution from your growth profile.</p>}<a href="/growth" className="mt-5 inline-flex min-h-11 items-center text-sm font-extrabold text-[#315fd7]">Manage evidence →</a></article><article className="rounded-[28px] border border-[#dfe6f8] bg-white p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#6b2bd9]">COMMUNITY & GROWTH</p><h2 className="mt-2 text-2xl font-black">Professional learning includes contribution.</h2><p className="mt-4 text-sm leading-6 text-[#6677a5]">Join topic-focused circles, exchange classroom evidence, and build a professional record that can support selected competency requirements.</p><a href="/community" className="mt-5 inline-flex min-h-11 items-center text-sm font-extrabold text-[#315fd7]">Go to community →</a></article></section></main></TeachPrivate></TeachShell>;
}
