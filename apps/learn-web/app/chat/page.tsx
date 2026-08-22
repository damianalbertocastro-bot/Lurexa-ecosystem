"use client";

import Link from "next/link";
import { ConversationWindow } from "../../components/ConversationWindow";
import { ProductMark } from "@lurexa/ui/ProductMark";

type ChatSession = { user?: { name?: string } };
export default function ChatPage({ session }: { session?: ChatSession }) {
  const userName = session?.user?.name || "User";
  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-[#dfe7fb] pb-6">
          <Link href="/coach" className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d5add] focus-visible:ring-offset-2" aria-label="Lurexa Coach practice space"><ProductMark product="coach" /></Link>
          <Link href="/dashboard" className="inline-flex min-h-11 items-center rounded-xl border border-[#d7e0f6] bg-white px-4 text-sm font-extrabold text-[#315fd7] shadow-sm transition hover:border-[#b8c7f1] hover:bg-[#f7f9ff]">Dashboard</Link>
        </header>
        <section className="mt-8 rounded-[28px] border border-[#d7def4] bg-gradient-to-br from-[#071d67] via-[#183c96] to-[#592bd6] p-6 text-white shadow-[0_18px_42px_rgba(32,52,128,.18)] sm:p-8">
          <p className="text-[10px] font-extrabold tracking-[.18em] text-[#8df4ef]">GUIDED SPEAKING PRACTICE</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-.055em] sm:text-4xl">Practice a conversation, {userName}.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100">Use Coach to rehearse English in a low-pressure space. Your practice should build confidence, not replace your learning path.</p>
        </section>
        <section className="mt-5 rounded-[24px] border border-[#dfe7fb] bg-white p-5 shadow-[0_12px_30px_rgba(32,52,128,.06)] sm:p-6" aria-label="Coach conversation">
          <ConversationWindow />
        </section>
      </div>
    </main>
  );
}
