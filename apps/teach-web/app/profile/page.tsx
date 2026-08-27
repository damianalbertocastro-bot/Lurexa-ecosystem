"use client";

import { FormEvent, useEffect, useState } from "react";
import { TeachService } from "@lurexa/backend";
import type { TeachCefrLevel, TeachCredentialAward, TeachEvidenceSubmission } from "@lurexa/types";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";

const cefr: TeachCefrLevel[] = ["A1","A2","B1","B2","C1","C2"];

export default function ProfilePage(){
  const {user,profile,refreshProfile}=useTeachAuth();
  const [editing,setEditing]=useState(false);
  const [displayName,setDisplayName]=useState("");
  const [headline,setHeadline]=useState("");
  const [level,setLevel]=useState<TeachCefrLevel|"">("");
  const [target,setTarget]=useState<TeachCefrLevel|"">("");
  const [experience,setExperience]=useState("");
  const [interests,setInterests]=useState("");
  const [goals,setGoals]=useState("");
  const [evidence,setEvidence]=useState<TeachEvidenceSubmission[]>([]);
  const [awards,setAwards]=useState<TeachCredentialAward[]>([]);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");

  useEffect(()=>{
    if(!profile) return;
    setDisplayName(profile.displayName); setHeadline(profile.headline??""); setLevel(profile.cefrLevel??""); setTarget(profile.targetCefrLevel??""); setExperience(profile.teachingExperienceYears?.toString()??""); setInterests(profile.interests.join(", ")); setGoals(profile.goals.join(", "));
  },[profile]);
  useEffect(()=>{if(user) Promise.all([TeachService.listEvidence(user.uid),TeachService.listCredentialAwards(user.uid)]).then(([a,b])=>{setEvidence(a);setAwards(b);}).catch(()=>{});},[user]);

  const save=async(event:FormEvent)=>{
    event.preventDefault(); if(!user||!profile) return; setBusy(true); setError("");
    try{
      await TeachService.upsertEducatorProfile({...profile,displayName:displayName.trim()||"Educator",headline:headline.trim()||undefined,cefrLevel:level||undefined,targetCefrLevel:target||undefined,teachingExperienceYears:experience?Number(experience):undefined,interests:interests.split(",").map((x)=>x.trim()).filter(Boolean),goals:goals.split(",").map((x)=>x.trim()).filter(Boolean),updatedAt:new Date().toISOString()});
      await refreshProfile(); setEditing(false);
    }catch(err){setError(err instanceof Error?err.message:"Profile could not be saved.");}
    finally{setBusy(false);}
  };

  const initials=(profile?.displayName||"Educator").split(" ").map((x)=>x[0]).join("").slice(0,2).toUpperCase();
  const verified=evidence.filter((item)=>item.status==="verified").length;

  return <TeachShell active="Dashboard"><TeachPrivate><main className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8"><section className="rounded-[30px] bg-gradient-to-br from-[#071d67] to-[#4825a8] p-8 text-white sm:p-10"><div className="flex flex-col gap-6 sm:flex-row sm:items-center"><span className="grid h-24 w-24 shrink-0 place-items-center rounded-[28px] bg-white/12 text-3xl font-black">{initials}</span><div><p className="text-[10px] font-extrabold tracking-[.18em] text-[#8df4ef]">EDUCATOR PROFILE</p><h1 className="mt-2 text-4xl font-black tracking-[-.055em]">{profile?.displayName||"Educator"}</h1><p className="mt-2 text-sm text-indigo-100">{profile?.headline||"Build your professional identity in Lurexa Teach."}</p></div><button onClick={()=>setEditing((value)=>!value)} className="min-h-11 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-extrabold sm:ml-auto">{editing?"Close editor":"Edit profile"}</button></div></section>

{editing&&<form onSubmit={save} className="mt-6 rounded-[28px] border border-[#dfe6f8] bg-white p-7"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-extrabold text-[#30457f]">Display name<input value={displayName} onChange={(e)=>setDisplayName(e.target.value)} required className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4"/></label><label className="text-sm font-extrabold text-[#30457f]">Professional headline<input value={headline} onChange={(e)=>setHeadline(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4" placeholder="English educator · Speaking development"/></label><label className="text-sm font-extrabold text-[#30457f]">Current CEFR level<select value={level} onChange={(e)=>setLevel(e.target.value as TeachCefrLevel|"")} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] bg-white px-4"><option value="">Not set</option>{cefr.map((x)=><option key={x}>{x}</option>)}</select></label><label className="text-sm font-extrabold text-[#30457f]">Target CEFR level<select value={target} onChange={(e)=>setTarget(e.target.value as TeachCefrLevel|"")} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] bg-white px-4"><option value="">Not set</option>{cefr.map((x)=><option key={x}>{x}</option>)}</select></label><label className="text-sm font-extrabold text-[#30457f]">Teaching experience (years)<input type="number" min="0" max="60" value={experience} onChange={(e)=>setExperience(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4"/></label><label className="text-sm font-extrabold text-[#30457f]">Professional interests<input value={interests} onChange={(e)=>setInterests(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4" placeholder="speaking, assessment, AI"/></label></div><label className="mt-4 block text-sm font-extrabold text-[#30457f]">Goals <span className="font-medium text-[#8994b4]">(comma separated)</span><textarea value={goals} onChange={(e)=>setGoals(e.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-[#d7e0f6] p-4" placeholder="Reach C1 professional English, strengthen speaking instruction"/></label>{error&&<p role="alert" className="mt-4 rounded-xl bg-[#fff0f2] p-3 text-sm font-bold text-[#b52c49]">{error}</p>}<button disabled={busy} className="mt-5 min-h-11 rounded-xl bg-[#6b2bd9] px-5 text-sm font-extrabold text-white disabled:opacity-60">{busy?"Saving…":"Save educator profile"}</button></form>}

<section className="mt-6 grid gap-5 lg:grid-cols-[.72fr_1.28fr]"><aside className="space-y-5"><article className="rounded-[26px] border border-[#dfe6f8] bg-white p-6"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#6b2bd9]">PROFESSIONAL IDENTITY</p>{[["English level",profile?.cefrLevel??"Not set"],["Target",profile?.targetCefrLevel??"Not set"],["Teaching experience",profile?.teachingExperienceYears!=null?`${profile.teachingExperienceYears} years`:"Not set"],["Interests",profile?.interests.join(", ")||"Not set"]].map(([k,v])=><div key={k} className="mt-4 border-t border-[#edf1fb] pt-4"><p className="text-xs font-bold text-[#8994b4]">{k}</p><b className="mt-1 block text-sm">{v}</b></div>)}</article><article className="rounded-[26px] border border-[#dfe6f8] bg-[#fffaf2] p-6"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#a05e20]">GOALS</p>{profile?.goals.length?profile.goals.map((goal)=><p key={goal} className="mt-3 text-sm leading-6 text-[#76664e]">• {goal}</p>):<p className="mt-3 text-sm leading-6 text-[#76664e]">Add goals to improve course and Lurexa Mind recommendations.</p>}</article></aside><div className="space-y-5"><article className="rounded-[26px] border border-[#dfe6f8] bg-white p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#6b2bd9]">PROFESSIONAL EVIDENCE</p><h2 className="mt-2 text-2xl font-black">Growth record</h2><div className="mt-6 grid gap-3 sm:grid-cols-3">{[[profile?.cefrLevel??"—","English"],[String(verified),"Verified evidence"],[String(awards.length),"Credentials"]].map(([n,l])=><div key={l} className="rounded-2xl bg-[#f7f9ff] p-5"><b className="text-3xl tracking-[-.05em]">{n}</b><p className="mt-2 text-xs font-bold text-[#7180a8]">{l}</p></div>)}</div><a href="/growth" className="mt-5 inline-flex min-h-11 items-center text-sm font-extrabold text-[#315fd7]">Open evidence portfolio →</a></article><article className="rounded-[26px] border border-[#dfe6f8] bg-white p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#6b2bd9]">RECENT EVIDENCE</p>{evidence.length?evidence.slice(0,4).map((item)=><div key={item.id} className="mt-5 flex gap-4 border-t border-[#edf1fb] pt-5"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-black ${item.status==="verified"?"bg-[#e9fbf9] text-[#137d7f]":"bg-[#f0ecff] text-[#6b2bd9]"}`}>{item.status==="verified"?"✓":"·"}</span><div><b className="text-sm">{item.title}</b><p className="mt-1 text-xs capitalize text-[#8994b4]">{item.status} · {item.type.replaceAll("-"," ")}</p></div></div>):<p className="mt-4 text-sm text-[#4d5e8c]">No evidence submitted yet.</p>}</article></div></section></main></TeachPrivate></TeachShell>;
}
