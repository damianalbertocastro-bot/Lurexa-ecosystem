"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TeachService } from "@lurexa/backend";
import type { TeachEvidenceSubmission } from "@lurexa/types";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";

export default function GrowthPage(){
  const {user,profile}=useTeachAuth();
  const search=useSearchParams();
  const [evidence,setEvidence]=useState<TeachEvidenceSubmission[]>([]);
  const [showForm,setShowForm]=useState(Boolean(search.get("moduleId")));
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [type,setType]=useState<TeachEvidenceSubmission["type"]>("reflection");
  const [resourceUrl,setResourceUrl]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");

  useEffect(()=>{if(user) TeachService.listEvidence(user.uid).then(setEvidence).catch((err)=>setError(err instanceof Error?err.message:"Evidence could not be loaded."));},[user]);

  const competencyMap=useMemo(()=>new Map(profile?.competencies.map((item)=>[item.id,item])??[]),[profile]);
  const dimensions=[
    ["English proficiency",profile?.cefrLevel??"Not set",profile?.targetCefrLevel?`Target ${profile.targetCefrLevel}`:"Set a CEFR goal"],
    ["Instructional practice",String(competencyMap.get("speaking-instruction")?.level??0)+" / 5","Evidence-backed teaching capability"],
    ["Digital & AI literacy",String(competencyMap.get("ai-literacy")?.level??0)+" / 5","Responsible classroom AI workflows"],
    ["Professional contribution",String(profile?.communityContributionScore??0),"Community contribution score"],
  ];

  const submit=async(event:FormEvent)=>{
    event.preventDefault(); if(!user) return; setBusy(true); setError("");
    try{
      const item=await TeachService.submitEvidence({userId:user.uid,title:title.trim(),description:description.trim(),type,competencyIds:[],courseId:search.get("courseId")||undefined,moduleId:search.get("moduleId")||undefined,resourceUrl:resourceUrl.trim()||undefined,status:"submitted"});
      setEvidence((current)=>[item,...current]); setTitle(""); setDescription(""); setResourceUrl(""); setShowForm(false);
    }catch(err){setError(err instanceof Error?err.message:"Evidence could not be submitted.");}
    finally{setBusy(false);}
  };

  return <TeachShell active="Growth"><TeachPrivate><main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8"><section className="grid gap-7 lg:grid-cols-[1fr_.75fr] lg:items-end"><div><p className="text-[11px] font-extrabold tracking-[.18em] text-[#6b2bd9]">EDUCATOR GROWTH PROFILE</p><h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-.055em] sm:text-6xl">One evolving view of the educator you are becoming.</h1></div><p className="max-w-xl text-base leading-7 text-[#6677a5]">Teach combines proficiency, teaching practice, evidence, goals, credentials, reflection, and professional contribution. Course completion alone does not define growth.</p></section>

<section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{dimensions.map(([name,value,detail])=><article key={name} className="rounded-[26px] border border-[#dfe6f8] bg-white p-6"><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#7180a8]">{name}</p><b className="mt-3 block text-2xl tracking-[-.04em]">{value}</b><p className="mt-3 text-sm leading-6 text-[#6677a5]">{detail}</p></article>)}</section>

<div className="mt-6 flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] font-extrabold tracking-[.17em] text-[#6b2bd9]">EVIDENCE PORTFOLIO</p><h2 className="mt-2 text-2xl font-black">Proof of growth, not just claims.</h2></div><button onClick={()=>setShowForm((value)=>!value)} className="min-h-11 rounded-xl bg-[#071d67] px-5 text-sm font-extrabold text-white">{showForm?"Close":"Submit evidence"}</button></div>

{showForm&&<form onSubmit={submit} className="mt-5 rounded-[28px] border border-[#dfe6f8] bg-white p-7"><div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-extrabold text-[#30457f]">Evidence title<input required value={title} onChange={(e)=>setTitle(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4" placeholder="e.g. Speaking feedback simulation"/></label><label className="text-sm font-extrabold text-[#30457f]">Evidence type<select value={type} onChange={(e)=>setType(e.target.value as TeachEvidenceSubmission["type"])} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] bg-white px-4"><option value="reflection">Reflection</option><option value="artifact">Artifact</option><option value="practice">Practice</option><option value="peer-contribution">Peer contribution</option></select></label></div><label className="mt-4 block text-sm font-extrabold text-[#30457f]">What does this demonstrate?<textarea required value={description} onChange={(e)=>setDescription(e.target.value)} className="mt-2 min-h-32 w-full rounded-xl border border-[#d7e0f6] p-4" placeholder="Describe the context, what you did, and what capability this evidence demonstrates."/></label><label className="mt-4 block text-sm font-extrabold text-[#30457f]">Resource URL <span className="font-medium text-[#8994b4]">(optional)</span><input type="url" value={resourceUrl} onChange={(e)=>setResourceUrl(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4" placeholder="https://…"/></label><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-bold text-[#7180a8]">Submission does not mean verification. Verified status is reserved for trusted review.</p><button disabled={busy} className="min-h-11 rounded-xl bg-[#6b2bd9] px-5 text-sm font-extrabold text-white disabled:opacity-60">{busy?"Submitting…":"Submit for review"}</button></div></form>}
{error&&<p role="alert" className="mt-5 rounded-2xl bg-[#fff0f2] p-4 text-sm font-bold text-[#b52c49]">{error}</p>}

<section className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><article className="rounded-[28px] border border-[#dfe6f8] bg-white p-7">{evidence.length?evidence.map((item)=><div key={item.id} className="mt-4 first:mt-0 border-t first:border-t-0 border-[#edf1fb] pt-4 first:pt-0"><div className="flex flex-wrap items-start justify-between gap-3"><div><b>{item.title}</b><p className="mt-1 text-sm leading-6 text-[#6677a5]">{item.description}</p><p className="mt-2 text-xs font-bold text-[#8994b4]">{item.type.replaceAll("-"," ")} · {new Date(item.createdAt).toLocaleDateString()}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-extrabold capitalize ${item.status==="verified"?"bg-[#e4f8f2] text-[#137867]":item.status==="rejected"?"bg-[#fff0f2] text-[#b52c49]":"bg-[#f0ecff] text-[#6b2bd9]"}`}>{item.status}</span></div></div>):<p className="rounded-2xl bg-[#f7f9ff] p-5 text-sm leading-6 text-[#6677a5]">No professional evidence has been submitted yet.</p>}</article><aside className="rounded-[28px] bg-[#fffaf2] p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#a05e20]">GOALS</p><h2 className="mt-2 text-2xl font-black">What matters next?</h2>{profile?.goals.length?profile.goals.map((goal)=><div key={goal} className="mt-5 border-t border-[#eadfcb] pt-5"><b>{goal}</b></div>):<><p className="mt-3 text-sm leading-6 text-[#76664e]">No goals yet. Add goals to your educator profile so recommendations can become more precise.</p><a href="/profile" className="mt-5 inline-flex min-h-11 items-center font-extrabold text-[#a05e20]">Edit professional profile →</a></>}</aside></section></main></TeachPrivate></TeachShell>;
}
