"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@lurexa/backend";
import type { SignatureOperationalRollupV1 } from "@lurexa/types";
import { ProductMark } from "@lurexa/ui/ProductMark";
import { authenticatedFetch } from "../../lib/authenticated-fetch";

const windows = [60, 360, 1440] as const;

function readError(payload: unknown): string {
  return typeof payload === "object" && payload !== null && typeof (payload as { error?: unknown }).error === "string"
    ? String((payload as { error: string }).error)
    : "Unable to load Signature Operations.";
}

export default function SignatureOperationsPage() {
  const router = useRouter();
  const [windowMinutes, setWindowMinutes] = useState<number>(60);
  const [rollup, setRollup] = useState<SignatureOperationalRollupV1 | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (nextWindow: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authenticatedFetch(`/api/admin/signature-operations?windowMinutes=${nextWindow}`, { cache: "no-store" });
      const body: unknown = await response.json();
      if (!response.ok) throw new Error(readError(body));
      setRollup(body as SignatureOperationalRollupV1);
    } catch (caught) {
      setRollup(null);
      setError(caught instanceof Error ? caught.message : "Unable to load Signature Operations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => AuthService.onUserChanged((user) => {
    if (!user) {
      router.replace("/login");
      return;
    }
    void load(windowMinutes);
  }), [load, router, windowMinutes]);

  const resolutionRate = rollup && rollup.bridge.created > 0
    ? Math.round((rollup.bridge.resolved / rollup.bridge.created) * 100)
    : null;

  return <main className="min-h-screen bg-[#f6f8ff] text-[#071d67]">
    <header className="border-b border-white/10 bg-gradient-to-br from-[#071d67] via-[#142f85] to-[#2355bf] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8"><div className="flex flex-wrap items-center justify-between gap-4"><ProductMark product="admin" inverse /><a href="/" className="rounded-xl border border-white/20 px-4 py-2 text-sm font-extrabold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Platform operations</a></div><p className="mt-10 text-[10px] font-extrabold tracking-[.2em] text-[#7ee9ed]">SIGNATURE OPERATIONS</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-.055em] sm:text-5xl">Measure the experience layer<br />without tracking learners.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-indigo-100">Identity-free operational telemetry for projection health, latency, and Product Bridge continuity.</p></div>
    </header>

    <div className="mx-auto max-w-7xl space-y-6 px-5 py-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex flex-wrap gap-2" aria-label="Telemetry window">{windows.map((value) => <button key={value} type="button" onClick={() => setWindowMinutes(value)} aria-pressed={windowMinutes === value} className={`min-h-11 rounded-xl px-4 text-sm font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7] ${windowMinutes === value ? "bg-[#071d67] text-white" : "border border-[#dbe4f7] bg-white text-[#3450a8]"}`}>{value === 60 ? "1 hour" : value === 360 ? "6 hours" : "24 hours"}</button>)}</div><button type="button" onClick={() => void load(windowMinutes)} className="min-h-11 rounded-xl border border-[#dbe4f7] bg-white px-4 text-sm font-extrabold text-[#3450a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]">Refresh</button></div>

      {loading ? <div role="status" aria-live="polite" className="rounded-3xl border border-[#dfe6f8] bg-white p-7 text-sm font-bold text-[#64749b]">Loading identity-free telemetry…</div> : null}
      {error ? <div role="alert" className="rounded-3xl border border-rose-200 bg-rose-50 p-7 text-sm font-bold text-rose-800">{error}</div> : null}

      {rollup ? <>
        <section className="grid gap-4 sm:grid-cols-3" aria-label="Product Bridge health"><article className="rounded-3xl border border-[#dfe6f8] bg-white p-6"><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#7180a8]">Bridges created</p><b className="mt-3 block text-3xl">{rollup.bridge.created}</b></article><article className="rounded-3xl border border-[#dfe6f8] bg-white p-6"><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#7180a8]">Bridges resolved</p><b className="mt-3 block text-3xl">{rollup.bridge.resolved}</b></article><article className="rounded-3xl border border-[#c7d4fa] bg-[#eff3ff] p-6"><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#7180a8]">Resolution ratio</p><b className="mt-3 block text-3xl">{resolutionRate === null ? "—" : `${resolutionRate}%`}</b><p className="mt-2 text-xs text-[#64749b]">Descriptive telemetry only; not a learner success metric.</p></article></section>

        <section className="rounded-3xl border border-[#dfe6f8] bg-white p-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#592bd6]">PROJECTION HEALTH</p><h2 className="mt-2 text-2xl font-black">Signature consumers</h2></div><span className="text-xs font-bold text-[#7180a8]">Window: {rollup.windowMinutes} min</span></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><caption className="sr-only">Signature projection success, failure, and average duration by consumer.</caption><thead className="border-y border-[#e6ecfb] bg-[#f8faff] text-[10px] font-extrabold uppercase tracking-[.13em] text-[#7180a8]"><tr><th className="px-4 py-3" scope="col">Consumer</th><th className="px-4 py-3" scope="col">Projection</th><th className="px-4 py-3" scope="col">Success</th><th className="px-4 py-3" scope="col">Failure</th><th className="px-4 py-3" scope="col">Avg duration</th></tr></thead><tbody className="divide-y divide-[#edf1fb]">{rollup.projections.length ? rollup.projections.map((entry) => <tr key={`${entry.consumer}:${entry.projection}`}><td className="px-4 py-4 font-extrabold capitalize">{entry.consumer}</td><td className="px-4 py-4">{entry.projection.replaceAll("_", " ")}</td><td className="px-4 py-4">{entry.successCount}</td><td className="px-4 py-4">{entry.failureCount}</td><td className="px-4 py-4">{entry.averageDurationMs === null ? "—" : `${entry.averageDurationMs} ms`}</td></tr>) : <tr><td colSpan={5} className="px-4 py-7 text-center text-[#7180a8]">No projection telemetry in this window.</td></tr>}</tbody></table></div></section>

        <aside className="rounded-2xl bg-[#eef3ff] p-5 text-xs leading-5 text-[#536a91]"><b className="text-[#1f3d8f]">Measurement boundaries:</b> {rollup.limitations.join(" ")}</aside>
      </> : null}
    </div>
  </main>;
}
