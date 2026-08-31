"use client";

import { FormEvent, useEffect, useState } from "react";
import { TeachService } from "@lurexa/backend";
import type { TeachCommunityPost } from "@lurexa/types";
import { TeachShell } from "../components/TeachShell";
import { TeachPrivate } from "../components/TeachPrivate";
import { useTeachAuth } from "../components/TeachAuthProvider";
import { Button } from "@lurexa/ui/button";
import { Input } from "@lurexa/ui/Input";

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

  return <TeachShell active="Community"><TeachPrivate><main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8"><section className="rounded-[34px] bg-gradient-to-br from-[var(--lx-warning)] to-[var(--lx-surface)] p-7 sm:p-10"><div className="grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="text-[11px] font-extrabold tracking-[.18em] text-[var(--lx-warning)]">LUREXA TEACH COMMUNITY</p><h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-.055em] sm:text-6xl">Professional growth should have people in it.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-[var(--lx-muted)]">Ask, share, practice, reflect, mentor, and learn with educators who understand the work. Contributions are stored in your professional identity and may become evidence when explicitly eligible.</p></div><Button onClick={()=>setShowComposer((value)=>!value)} className="min-h-12 justify-self-start rounded-xl bg-[var(--lx-primary)] px-6 text-sm font-extrabold text-white hover:opacity-90 lg:justify-self-end">{showComposer?"Close composer":"Create a post"}</Button></div></section>

{showComposer&&<form onSubmit={submit} className="mt-6 rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 sm:p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">NEW PROFESSIONAL CONTRIBUTION</p><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm font-extrabold text-[var(--lx-muted)]">Circle<select value={circleId} onChange={(e)=>setCircleId(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[var(--lx-border)] bg-[var(--lx-surface)] px-4"><option value="">General Teach community</option>{circles.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label><label className="text-sm font-extrabold text-[var(--lx-muted)]">Title<Input required value={title} onChange={(e)=>setTitle(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[var(--lx-border)] px-4" placeholder="What do you want other teachers to discuss?"/></label></div><label className="mt-4 block text-sm font-extrabold text-[var(--lx-muted)]">Contribution<textarea required value={body} onChange={(e)=>setBody(e.target.value)} className="mt-2 min-h-36 w-full rounded-xl border border-[var(--lx-border)] p-4" placeholder="Share the classroom context, what you tried, what happened, or what you want feedback on."/></label><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-bold text-[var(--lx-muted)]">Posts may be marked evidence-eligible, but community activity is never automatically verified evidence.</p><Button disabled={busy} className="min-h-11 rounded-xl bg-[var(--lx-primary)] px-5 text-sm font-extrabold text-white disabled:opacity-60">{busy?"Publishing…":"Publish contribution"}</Button></div></form>}
{error&&<p role="alert" className="mt-5 rounded-2xl bg-[var(--lx-destructive)] p-4 text-sm font-bold text-[var(--lx-destructive)]">{error}</p>}

<section className="mt-10"><div><p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">PROFESSIONAL CIRCLES</p><h2 className="mt-2 text-3xl font-black tracking-[-.045em]">Find the context that matches your work.</h2></div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{circles.map(([id,name,copy],i)=>{const isActive = circleId === id; return <article key={id} className={`flex flex-col justify-between rounded-[24px] border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${isActive ? "border-[var(--lx-primary)] bg-[var(--lx-canvas)] ring-2 ring-[var(--lx-primary)]/20" : "border-[var(--lx-border)] bg-[var(--lx-surface)]"}`}><div className="flex items-center justify-between"><div className={`grid h-12 w-12 place-items-center rounded-2xl font-black ${i%2?"bg-[var(--lx-canvas)] text-[var(--lx-accent)]":"bg-[var(--lx-canvas)] text-[var(--lx-primary)]"}`}>{name.charAt(0)}</div>{isActive && <span className="rounded-full bg-[var(--lx-primary)]/10 px-2.5 py-1 text-[10px] font-extrabold text-[var(--lx-primary)]">Active Circle</span>}</div><h3 className="mt-5 text-lg font-black">{name}</h3><p className="mt-2 text-sm leading-6 text-[var(--lx-muted)]">{copy}</p><Button type="button" onClick={async()=>{setCircleId(isActive ? "" : id); try{setPosts(await TeachService.listCommunityPosts(isActive ? undefined : id));}catch(err){setError(err instanceof Error?err.message:"Circle could not be loaded.");}}} className={`mt-5 min-h-11 rounded-xl text-sm font-extrabold transition ${isActive ? "bg-[var(--lx-primary)] text-white" : "border border-[var(--lx-border)] bg-[var(--lx-surface)] text-[var(--lx-secondary)] hover:bg-[var(--lx-canvas)]"}`}>{isActive ? "Viewing circle ✓" : "Open circle →"}</Button></article>;})}</div></section>

<section className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_.65fr]"><article className="rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7"><div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">COMMUNITY FEED</p><h2 className="mt-2 text-2xl font-black">Conversations worth joining</h2></div>{circleId&&<Button onClick={()=>{setCircleId("");void load();}} className="text-sm font-extrabold text-[var(--lx-secondary)]">Show all</Button>}</div>{posts.length?posts.map((post)=><article key={post.id} className="mt-6 border-t border-[var(--lx-border)] pt-6"><div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--lx-surface)] font-black text-[var(--lx-secondary)]">{post.authorName.charAt(0)}</span><div><b className="text-sm text-[var(--lx-muted)]">{post.authorName}</b><h3 className="mt-1 text-lg font-black leading-6">{post.title}</h3><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--lx-muted)]">{post.body}</p><p className="mt-2 text-xs font-bold text-[var(--lx-muted)]">{new Date(post.createdAt).toLocaleDateString()} {post.evidenceEligible?"· Evidence eligible":""}</p></div></div></article>):<p className="mt-6 rounded-2xl bg-[var(--lx-surface)] p-5 text-sm leading-6 text-[var(--lx-muted)]">No contributions here yet. Start the professional conversation.</p>}</article><aside className="space-y-5"><article className="rounded-[28px] bg-gradient-to-br from-[var(--color-brand-navy)] to-[var(--lx-secondary)] p-7 text-white"><p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-accent)]">WEEKLY CHALLENGE</p><h2 className="mt-3 text-2xl font-black">Share one classroom move that increased student talk time.</h2><Button onClick={()=>setShowComposer(true)} className="mt-6 min-h-11 rounded-xl bg-white px-4 text-sm font-extrabold text-[var(--color-brand-navy)]">Contribute →</Button></article><article className="rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-7"><p className="text-[10px] font-extrabold tracking-[.17em] text-[var(--lx-primary)]">COMMUNITY STANDARD</p><h2 className="mt-3 text-xl font-black">Useful professional exchange over engagement metrics.</h2><p className="mt-3 text-sm leading-6 text-[var(--lx-muted)]">Teach prioritizes contextual questions, classroom evidence, reflection, resources, and peer feedback—not follower counts or viral ranking.</p></article></aside></section></main></TeachPrivate></TeachShell>;
}
