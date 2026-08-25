"use client";

import React, { useEffect, useState } from "react";
import { LearnerPulse } from "@lurexa/ui/LearnerPulse";
import { AdaptiveLearningPath } from "@lurexa/ui/AdaptiveLearningPath";
import { MemoryThread } from "@lurexa/ui/MemoryThread";
import { MindTrace } from "@lurexa/ui/MindTrace";
import type {
  AdaptiveLearningPathV1,
  LearnerPulseProjectionV1,
  MemoryThreadV1,
  MindTraceV1,
  SignatureProjectionKind,
} from "@lurexa/types";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";

export interface SignatureExperiencePanelProps {
  enabled: boolean;
}

type SignatureState = {
  pulse: LearnerPulseProjectionV1 | null;
  path: AdaptiveLearningPathV1 | null;
  thread: MemoryThreadV1 | null;
  trace: MindTraceV1 | null;
};

const emptyState: SignatureState = { pulse: null, path: null, thread: null, trace: null };
const rolloutEnabled = process.env.NEXT_PUBLIC_SIGNATURE_EXPERIENCE_V1 === "on";

async function loadProjection<T>(projection: SignatureProjectionKind): Promise<T> {
  const response = await authenticatedFetch(`/api/signature?projection=${encodeURIComponent(projection)}`);
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `Unable to load ${projection}.`);
  }
  return response.json() as Promise<T>;
}

export function SignatureExperiencePanel({ enabled }: SignatureExperiencePanelProps) {
  const active = enabled && rolloutEnabled;
  const [state, setState] = useState<SignatureState>(emptyState);
  const [loading, setLoading] = useState(active);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    Promise.allSettled([
      loadProjection<LearnerPulseProjectionV1>("learner_pulse"),
      loadProjection<AdaptiveLearningPathV1>("adaptive_path"),
      loadProjection<MemoryThreadV1>("memory_thread"),
      loadProjection<MindTraceV1>("mind_trace"),
    ]).then((results) => {
      if (cancelled) return;
      const [pulse, path, thread, trace] = results;
      const next: SignatureState = {
        pulse: pulse?.status === "fulfilled" ? pulse.value : null,
        path: path?.status === "fulfilled" ? path.value : null,
        thread: thread?.status === "fulfilled" ? thread.value : null,
        trace: trace?.status === "fulfilled" ? trace.value : null,
      };
      setState(next);

      const failures = results.filter((result) => result.status === "rejected") as PromiseRejectedResult[];
      if (failures.length > 0) {
        const reason = failures[0]?.reason;
        setError(
          failures.length === results.length && reason instanceof Error
            ? reason.message
            : "Some signature projections could not be loaded.",
        );
      } else {
        setError(null);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [active, reloadKey]);

  if (!active) return null;

  const retry = () => {
    setState(emptyState);
    setError(null);
    setLoading(true);
    setReloadKey((value) => value + 1);
  };

  if (loading && !state.pulse) {
    return (
      <section aria-label="Loading Lurexa learning intelligence" aria-live="polite" className="rounded-[28px] border border-indigo-100 bg-white p-6 shadow-sm">
        <div className="h-3 w-28 animate-pulse rounded bg-indigo-100 motion-reduce:animate-none" />
        <div className="mt-3 h-7 w-64 max-w-full animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-slate-50 motion-reduce:animate-none" />)}
        </div>
      </section>
    );
  }

  if (error && !state.pulse && !state.path && !state.thread && !state.trace) {
    return (
      <section role="status" aria-live="polite" className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-600">
        <p className="font-bold text-slate-900">Your evolving learning view is temporarily unavailable.</p>
        <p className="mt-1">{error}</p>
        <button type="button" onClick={retry} className="mt-4 rounded-full border border-indigo-200 px-4 py-2 font-bold text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">Try again</button>
      </section>
    );
  }

  return (
    <section aria-labelledby="signature-learning-heading" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Your Lurexa learning model</p>
          <h2 id="signature-learning-heading" className="mt-1 text-2xl font-black tracking-[-.04em] text-[#071d67]">One learning history, adapting with you</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">See what Lurexa currently understands, what it recommends next, and the evidence-aware story behind that guidance.</p>
        </div>
        <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">Signature experience · v1</span>
      </div>

      {state.pulse && <LearnerPulse pulse={state.pulse} />}

      <div className="grid gap-5 xl:grid-cols-2">
        {state.trace && <MindTrace trace={state.trace} />}
        {state.path && <AdaptiveLearningPath path={state.path} />}
      </div>

      {state.thread && <MemoryThread thread={state.thread} />}

      {error && <p role="status" aria-live="polite" className="text-xs text-amber-700">{error} Available projections are still shown.</p>}
    </section>
  );
}
