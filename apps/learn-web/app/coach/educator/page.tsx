"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CoachSessionStartResult } from "@lurexa/types";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";

const ACTIVE_SESSION_KEY = "lurexa.coach.active-session";

export default function EducatorCoachEntryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    setLoading(true);
    setError("");
    try {
      const response = await authenticatedFetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "startSession", mode: "educator_professional" }),
      });
      const body = await response.json() as CoachSessionStartResult & { error?: string };
      if (!response.ok || !body.session) throw new Error(body.error ?? "Unable to start professional Coach practice.");
      window.sessionStorage.setItem(ACTIVE_SESSION_KEY, body.session.id);
      router.push("/coach");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to start professional Coach practice.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="min-h-screen bg-gradient-to-b from-[#f7f2ff] to-[#eef3ff] px-5 py-10 text-[#10245f]"><div className="mx-auto max-w-3xl">
    <ProductMark product="coach" />
    <section className="mt-8 rounded-[34px] border border-violet-100 bg-white p-7 shadow-xl sm:p-10">
      <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#6b2bd9]">EDUCATOR PROFESSIONAL PRACTICE</p>
      <h1 className="mt-3 text-4xl font-black tracking-[-.055em] sm:text-5xl">Use Coach to strengthen your own professional English.</h1>
      <p className="mt-5 text-sm leading-7 text-[#6677a5]">This mode is available through your educator benefit. It focuses on your pronunciation, fluency, and professional language development. It does not expose student records, and Coach cannot grant or change your professional qualification.</p>
      <div className="mt-6 rounded-2xl bg-violet-50 p-5 text-xs leading-6 text-violet-900"><b>Professional evidence boundary:</b> when you finish, Coach stores only a minimized professional-practice record—no raw transcript and no student context—and returns you to your Teach Growth Plan.</div>
      {error ? <p role="alert" className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-800">{error}</p> : null}
      <div className="mt-7 flex flex-wrap gap-3"><button type="button" disabled={loading} onClick={() => void start()} className="min-h-12 rounded-xl bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] px-6 text-sm font-black text-white disabled:opacity-50">{loading ? "Starting…" : "Start professional Coach practice"}</button><button type="button" onClick={() => router.back()} className="min-h-12 rounded-xl border border-[#dfe6f8] bg-white px-5 text-sm font-black text-[#3450a8]">Back</button></div>
    </section>
  </div></main>;
}
