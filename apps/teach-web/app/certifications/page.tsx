"use client";

import { useEffect, useState } from "react";
import { evaluateTeachCredential, TeachService } from "@lurexa/backend";
import type { TeachCredentialAward, TeachCredentialDefinition, TeachEnrollment, TeachEvidenceSubmission } from "@lurexa/types";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";

export default function CertificationsPage(){
  const {user,profile}=useTeachAuth();
  const [definitions,setDefinitions]=useState<TeachCredentialDefinition[]>([]);
  const [awards,setAwards]=useState<TeachCredentialAward[]>([]);
  const [enrollments,setEnrollments]=useState<TeachEnrollment[]>([]);
  const [evidence,setEvidence]=useState<TeachEvidenceSubmission[]>([]);
  const [error,setError]=useState("");

  useEffect(()=>{
    if(!user) return;
    Promise.all([
      TeachService.listCredentialDefinitions(),
      TeachService.listCredentialAwards(user.uid),
      TeachService.listEnrollments(user.uid),
      TeachService.listEvidence(user.uid),
    ]).then(([a,b,c,d])=>{setDefinitions(a);setAwards(b);setEnrollments(c);setEvidence(d);}).catch((err)=>setError(err instanceof Error?err.message:"Credentials could not be loaded."));
  },[user]);

  return <TeachShell active="Credentials"><TeachPrivate><main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8"><section className="grid gap-7 lg:grid-cols-[1fr_.75fr] lg:items-end"><div><p className="text-[11px] font-extrabold tracking-[.18em] text-[#6b2bd9]">CREDENTIALS & PROFESSIONAL EVIDENCE</p><h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-.055em] sm:text-6xl">Credentials should represent demonstrated capability.</h1></div><p className="max-w-xl text-base leading-7 text-[#6677a5]">Eligibility is calculated from persistent course progress, verified evidence, competency state, and CEFR level. Awarding remains a trusted Core action rather than a client-side button.</p></section>

{error&&<p role="alert" className="mt-6 rounded-2xl bg-[#fff0f2] p-4 text-sm font-bold text-[#b52c49]">{error}</p>}
<section className="mt-9 grid gap-4 md:grid-cols-2">{definitions.map((credential,i)=>{const awarded=awards.find((item)=>item.credentialId===credential.id);const result=evaluateTeachCredential(credential,profile,enrollments,evidence);const met=result.requirements.filter((item)=>item.met).length;return <article key={credential.id} className="rounded-[28px] border border-[#dfe6f8] bg-white p-7 shadow-[0_12px_30px_rgba(32,52,128,.05)]"><div className="flex items-start justify-between gap-4"><span className={`grid h-14 w-14 place-items-center rounded-2xl text-xl font-black ${i%2?"bg-[#e9fbf9] text-[#137d7f]":"bg-[#eee9ff] text-[#6b2bd9]"}`}>✦</span><span className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${awarded||result.eligible?"bg-[#e4f8f2] text-[#137867]":"bg-[#f0ecff] text-[#6b2bd9]"}`}>{awarded?"Awarded":result.eligible?"Eligible":"In progress"}</span></div><h2 className="mt-6 text-2xl font-black tracking-[-.04em]">{credential.name}</h2><p className="mt-3 text-sm leading-6 text-[#6677a5]">{credential.description}</p><div className="mt-6 border-t border-[#edf1fb] pt-5"><div className="flex items-center justify-between gap-3"><b className="text-sm text-[#315fd7]">{met} of {result.requirements.length} requirements met</b>{awarded&&<span className="text-xs font-bold text-[#7180a8]">{new Date(awarded.awardedAt).toLocaleDateString()}</span>}</div><div className="mt-4 space-y-2">{credential.requirements.map((requirement)=>{const state=result.requirements.find((item)=>item.requirementId===requirement.id)?.met;return <div key={requirement.id} className="flex items-center gap-3 rounded-xl bg-[#f7f9ff] p-3"><span className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-black ${state?"bg-[#e4f8f2] text-[#137867]":"bg-white text-[#8994b4]"}`}>{state?"✓":"·"}</span><span className="text-sm font-bold capitalize text-[#536ba5]">{requirement.type.replaceAll("-"," ")}</span></div>})}</div>{result.eligible&&!awarded&&<p className="mt-4 rounded-xl bg-[#e4f8f2] p-3 text-sm font-bold text-[#137867]">All requirements are satisfied. The credential is ready for trusted verification/award processing.</p>}</div></article>})}</section>

{!definitions.length&&<div className="mt-8 rounded-[28px] border border-dashed border-[#ccd7f2] bg-white p-8 text-center text-sm text-[#6677a5]">Credential definitions are loading or have not been published yet.</div>}
<section className="mt-8 grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><article className="rounded-[28px] bg-gradient-to-br from-[#071d67] to-[#315fd7] p-7 text-white"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#8df4ef]">CREDENTIAL WALLET</p><h2 className="mt-3 text-3xl font-black tracking-[-.045em]">{awards.length} verified credential{awards.length===1?"":"s"}</h2><p className="mt-3 text-sm leading-6 text-indigo-100">Credential awards are persistent trusted records connected to your educator profile.</p></article><article className="rounded-[28px] border border-[#dfe6f8] bg-white p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#6b2bd9]">TRUST MODEL</p><h2 className="mt-3 text-2xl font-black">Eligibility can be transparent without making awards self-service.</h2><div className="mt-6 grid gap-3 sm:grid-cols-3">{[["1","Clear competency"],["2","Verified evidence"],["3","Trusted award"]].map(([n,t])=><div key={n} className="rounded-2xl bg-[#f7f9ff] p-5"><b className="text-lg text-[#6b2bd9]">{n}</b><p className="mt-2 text-sm font-extrabold">{t}</p></div>)}</div></article></section></main></TeachPrivate></TeachShell>;
}
