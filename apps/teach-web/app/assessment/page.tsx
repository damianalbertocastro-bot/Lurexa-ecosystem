"use client";

import { useEffect, useState } from "react";
import { TeachService } from "@lurexa/backend";
import type { TeachAssessmentDomain, TeachAssessmentRequest } from "@lurexa/types";
import { TeachPrivate } from "../components/TeachPrivate";
import { TeachShell } from "../components/TeachShell";
import { useTeachAuth } from "../components/TeachAuthProvider";
import { Button } from "@lurexa/ui/button";
import { Input } from "@lurexa/ui/Input";

export default function AssessmentPage() {
  const { user, profile } = useTeachAuth();
  const [assessments, setAssessments] = useState<TeachAssessmentRequest[]>([]);
  const [domains, setDomains] = useState<TeachAssessmentDomain[]>(["cefr"]);
  const [competencies, setCompetencies] = useState("speaking-instruction");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!user) return;
    try { setAssessments(await TeachService.listAssessments(user.uid)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Assessments could not be loaded."); }
  };

  useEffect(() => { void load(); }, [user]);

  const toggleDomain = (domain: TeachAssessmentDomain) => setDomains((current) => current.includes(domain) ? current.filter((item) => item !== domain) : [...current, domain]);

  const submit = async () => {
    if (!user || domains.length === 0) return;
    setSaving(true); setError("");
    try {
      await TeachService.requestAssessment(user.uid, domains, competencies.split(",").map((item) => item.trim()).filter(Boolean), note);
      setNote("");
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Assessment request could not be submitted."); }
    finally { setSaving(false); }
  };

  return <TeachShell active="Assessment"><TeachPrivate><main className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8">
    <section className="grid gap-6 rounded-[34px] bg-gradient-to-br from-[var(--color-brand-navy)] via-[#203b95] to-[var(--lx-primary)] p-8 text-white lg:grid-cols-[1fr_.55fr] lg:items-end sm:p-10">
      <div><p className="text-[10px] font-extrabold tracking-[.18em] text-[var(--lx-accent)]">TRUSTED PROFESSIONAL ASSESSMENT</p><h1 className="mt-3 text-4xl font-black tracking-[-.055em] sm:text-5xl">Turn professional growth into verified capability.</h1><p className="mt-4 max-w-3xl text-sm leading-7 text-indigo-100">Self-reported growth helps personalization. Credentials use independently verified CEFR and competency outcomes recorded through a trusted assessment.</p></div>
      <div className="rounded-2xl border border-white/15 bg-white/10 p-5"><p className="text-xs font-extrabold text-[var(--lx-accent)]">CURRENT VERIFIED STATE</p><b className="mt-2 block text-2xl">CEFR {profile?.verifiedCefrLevel ?? "Not verified"}</b><p className="mt-2 text-sm text-indigo-100">{profile?.verifiedCompetencies?.length ?? 0} verified competencies</p></div>
    </section>

    {error && <p role="alert" className="mt-6 rounded-2xl bg-[#fff0f2] p-4 text-sm font-bold text-[#b52c49]">{error}</p>}

    <section className="mt-7 grid gap-5 lg:grid-cols-[.75fr_1.25fr]">
      <article className="rounded-[28px] border border-[var(--lx-surface)] bg-white p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">REQUEST ASSESSMENT</p><h2 className="mt-2 text-2xl font-black">Choose what needs verification.</h2><div className="mt-5 flex flex-wrap gap-2">{(["cefr","teaching-competency"] as TeachAssessmentDomain[]).map((domain)=><Button key={domain} type="button" onClick={()=>toggleDomain(domain)} className={`min-h-11 rounded-full border px-4 text-sm font-extrabold ${domains.includes(domain)?"border-[var(--lx-primary)] bg-[var(--lx-primary)] text-white":"border-[#d7e0f6] bg-white text-[#536ba5]"}`}>{domain==="cefr"?"English CEFR":"Teaching competency"}</Button>)}</div><label className="mt-5 block text-xs font-extrabold text-[var(--lx-muted)]">COMPETENCY IDS<Input value={competencies} onChange={(event)=>setCompetencies(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-[#d7e0f6] px-3 text-sm font-medium" placeholder="speaking-instruction, assessment-literacy" /></label><label className="mt-5 block text-xs font-extrabold text-[var(--lx-muted)]">CONTEXT FOR ASSESSOR<textarea value={note} onChange={(event)=>setNote(event.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-[#d7e0f6] p-3 text-sm font-medium" placeholder="What professional capability are you ready to demonstrate?" /></label><Button type="button" onClick={()=>void submit()} disabled={saving||domains.length===0} className="mt-5 min-h-12 rounded-xl bg-gradient-to-br from-[var(--lx-primary)] to-[var(--lx-secondary)] px-5 text-sm font-extrabold text-white disabled:opacity-50">{saving?"Submitting…":"Request trusted assessment"}</Button></article>

      <article className="rounded-[28px] border border-[var(--lx-surface)] bg-white p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">ASSESSMENT HISTORY</p><h2 className="mt-2 text-2xl font-black">Your verification pipeline</h2>{assessments.length===0?<p className="mt-5 rounded-2xl bg-[var(--lx-surface)] p-5 text-sm text-[var(--lx-muted)]">No trusted assessments requested yet.</p>:assessments.map((assessment)=><div key={assessment.id} className="mt-5 border-t border-[#edf1fb] pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><b className="capitalize">{assessment.domains.join(" + ").replaceAll("-"," ")}</b><p className="mt-1 text-xs text-[#8994b4]">Requested {new Date(assessment.requestedAt).toLocaleDateString()}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-extrabold capitalize ${assessment.status==="completed"?"bg-[#e4f8f2] text-[#137867]":"bg-[#f0ecff] text-[var(--lx-primary)]"}`}>{assessment.status.replaceAll("_"," ")}</span></div></div>)}</article>
    </section>
  </main></TeachPrivate></TeachShell>;
}
