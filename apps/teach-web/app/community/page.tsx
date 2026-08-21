"use client";

import { FormEvent, useEffect, useState } from "react";
import { TeachService } from "@lurexa/backend";
import type { TeachCommunityPost } from "@lurexa/types";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";

const circles=[
  ["dominican-english-teachers","Dominican English Teachers","Speaking, pronunciation, transfer, local classroom realities"],
  ["a1-a2-teachers","A1–A2 Teachers","Beginners, confidence, scaffolding, classroom routines"],
  ["ai-in-elt","AI in ELT","Practical AI use, assessment, prompts, ethics"],
  ["teacher-english-growth","Teacher English Growth","Study partners, speaking practice, CEFR progression"],
] as const;

export default function CommunityPage(){
  const { user, profile } = useTeachAuth();
  const [posts,setPosts]=useState<TeachCommunityPost[]>([]);
  const [circleId,setCircleId]=useState("");
  const [title,setTitle]=useState("");
  const [body,setBody]=useState("");
  const [showComposer,setShowComposer]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");

  const load = async () => {
    try { setPosts(await TeachService.listCommunityPosts()); }
    catch (err) { setError(err instanceof Error ? err.message : "Community could not be loaded."); }
  };
  useEffect(()=>{ if(user) void load(); },[user]);

  const submit=async(event:FormEvent)=>{
    event.preventDefault();
    if(!user || !title.trim() || !body.trim()) return;
    setBusy(true); setError("");
    try{
      const post=await TeachService.createCommunityPost({userId:user.uid,authorName:profile?.displayName||"Educator",circleId:circleId||undefined,title:title.trim(),body:body.trim(),tags:[],evidenceEligible:true});
      setPosts((current)=>[post,...current]); setTitle(""); setBody(""); setCircleId(""); setShowComposer(false);
    }catch(err){setError(err instanceof Error?err.message:"Post could not be published.");}
    finally{setBusy(false);}
  };

  return <TeachShell active="Community"><TeachPrivate><main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8"><section className="rounded-[34px] bg-gradient-to-br from-[#fff8ed] to-[#f7f3ff] p-7 sm:p-10"><div className="grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="text-[11px] font-extrabold tracking-[.18em] text-[#a05e20]">LUREXA TEACH COMMUNITY</p><h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-.055em] sm:text-6xl">Professional growth should have people in it.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-[#6c6372]">Ask, share, practice, reflect, mentor, and learn with educators who understand the work. Contributions are stored in your professional identity and may become evidence when explicitly eligible.</p></div><button onClick={()=>setShowComposer((value)=>!value)} className="min-h-12 justify-self-start rounded-xl bg-[#071d67] px-6 text-sm font-extrabold text-white lg:justify-self-end">{showComposer?"Close composer":"Create a post"}</button></div></section>

{showComposer&&<form onSubmit={submit} className="mt-6 rounded-[28px] border border-[#dfe6f8] bg-white p-6 sm:p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#6b2bd9]">NEW PROFESSIONAL CONTRIBUTION</p><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm font-extrabold text-[#30457f]">Circle<select value={circleId} onChange={(e)=>setCircleId(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] bg-white px-4"><option value="">General Teach community</option>{circles.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label><label className="text-sm font-extrabold text-[#30457f]">Title<input required value={title} onChange={(e)=>setTitle(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#d7e0f6] px-4" placeholder="What do you want other teachers to discuss?"/></label></div><label className="mt-4 block text-sm font-extrabold text-[#30457f]">Contribution<textarea required value={body} onChange={(e)=>setBody(e.target.value)} className="mt-2 min-h-36 w-full rounded-xl border border-[#d7e0f6] p-4" placeholder="Share the classroom context, what you tried, what happened, or what you want feedback on."/></label><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-bold text-[#7180a8]">Posts may be marked evidence-eligible, but community activity is never automatically verified evidence.</p><button disabled={busy} className="min-h-11 rounded-xl bg-[#6b2bd9] px-5 text-sm font-extrabold text-white disabled:opacity-60">{busy?"Publishing…":"Publish contribution"}</button></div></form>}
{error&&<p role="alert" className="mt-5 rounded-2xl bg-[#fff0f2] p-4 text-sm font-bold text-[#b52c49]">{error}</p>}

<section className="mt-10"><div><p className="text-[10px] font-extrabold tracking-[.17em] text-[#6b2bd9]">PROFESSIONAL CIRCLES</p><h2 className="mt-2 text-3xl font-black tracking-[-.045em]">Find the context that matches your work.</h2></div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{circles.map(([id,name,copy],i)=><article key={id} className="rounded-[24px] border border-[#dfe6f8] bg-white p-6"><div className={`grid h-12 w-12 place-items-center rounded-2xl font-black ${i%2?"bg-[#e7f9f8] text-[#147c7e]":"bg-[#eee9ff] text-[#6b2bd9]"}`}>{name.charAt(0)}</div><h3 className="mt-5 text-lg font-black">{name}</h3><p className="mt-4 text-sm leading-6 text-[#6677a5]">{copy}</p><button type="button" onClick={async()=>{setCircleId(id); try{setPosts(await TeachService.listCommunityPosts(id));}catch(err){setError(err instanceof Error?err.message:"Circle could not be loaded.");}}} className="mt-5 min-h-11 text-sm font-extrabold text-[#315fd7]">Open circle →</button></article>)}</div></section>

<section className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_.65fr]"><article className="rounded-[28px] border border-[#dfe6f8] bg-white p-7"><div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold tracking-[.17em] text-[#6b2bd9]">COMMUNITY FEED</p><h2 className="mt-2 text-2xl font-black">Conversations worth joining</h2></div>{circleId&&<button onClick={()=>{setCircleId("");void load();}} className="text-sm font-extrabold text-[#315fd7]">Show all</button>}</div>{posts.length?posts.map((post)=><article key={post.id} className="mt-6 border-t border-[#edf1fb] pt-6"><div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eef3ff] font-black text-[#315fd7]">{post.authorName.charAt(0)}</span><div><b className="text-sm text-[#536ba5]">{post.authorName}</b><h3 className="mt-1 text-lg font-black leading-6">{post.title}</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#6677a5]">{post.body}</p><p className="mt-2 text-xs font-bold text-[#8994b4]">{new Date(post.createdAt).toLocaleDateString()} {post.evidenceEligible?"· Evidence eligible":""}</p></div></div></article>):<p className="mt-6 rounded-2xl bg-[#f7f9ff] p-5 text-sm leading-6 text-[#6677a5]">No contributions here yet. Start the professional conversation.</p>}</article><aside className="space-y-5"><article className="rounded-[28px] bg-gradient-to-br from-[#071d67] to-[#315fd7] p-7 text-white"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#8df4ef]">WEEKLY CHALLENGE</p><h2 className="mt-3 text-2xl font-black">Share one classroom move that increased student talk time.</h2><button onClick={()=>setShowComposer(true)} className="mt-6 min-h-11 rounded-xl bg-white px-4 text-sm font-extrabold text-[#26358c]">Contribute →</button></article><article className="rounded-[28px] border border-[#dfe6f8] bg-white p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[#6b2bd9]">COMMUNITY STANDARD</p><h2 className="mt-3 text-xl font-black">Useful professional exchange over engagement metrics.</h2><p className="mt-3 text-sm leading-6 text-[#6677a5]">Teach prioritizes contextual questions, classroom evidence, reflection, resources, and peer feedback—not follower counts or viral ranking.</p></article></aside></section></main></TeachPrivate></TeachShell>;
}
