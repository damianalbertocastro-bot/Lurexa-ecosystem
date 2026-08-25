"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@lurexa/ui/Badge";
import { Button } from "@lurexa/ui/Button";
import { ProductMark } from "@lurexa/ui/ProductMark";
import type { ProductBridgeV1 } from "@lurexa/types";
import { authenticatedFetch } from "../../../lib/authenticated-fetch";

export const CoachPracticeCard: React.FC = () => {
  const router = useRouter();
  const [bridging, setBridging] = useState(false);
  const [bridgeError, setBridgeError] = useState<string | null>(null);

  const startCoachPractice = async () => {
    setBridging(true);
    setBridgeError(null);
    try {
      const response = await authenticatedFetch("/api/product-bridge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          destination: "coach",
          purpose: "targeted_practice",
          destinationRef: "/coach",
          contextRef: "learner-context:coach_session_adaptation",
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(payload.error ?? "Unable to create a secure Coach handoff.");
      }
      const bridge = await response.json() as ProductBridgeV1;
      router.push(`/coach?bridge=${encodeURIComponent(bridge.bridgeId)}`);
    } catch (error) {
      setBridgeError(error instanceof Error ? error.message : "Unable to continue to Coach.");
    } finally {
      setBridging(false);
    }
  };

  return (
    <article className="relative overflow-hidden rounded-3xl border border-violet-200/70 bg-gradient-to-br from-[#180e3d] via-[#24175b] to-[#122868] p-6 text-white shadow-xl shadow-indigo-950/15 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-3">
            <ProductMark product="coach" inverse />
            <Badge variant="info">AI Speaking & Pronunciation</Badge>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
            Practice speaking without pressure.
          </h2>

          <p className="text-sm leading-6 text-indigo-100/90">
            Build conversational confidence and pronunciation control. Coach adapts around what Lurexa already knows about your English without asking you to start over.
          </p>

          <div className="flex flex-wrap gap-2 pt-1 text-xs text-indigo-200">
            <span className="rounded-full bg-white/10 px-3 py-1 font-medium backdrop-blur-sm">🗣️ Dominican English Transfer</span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-medium backdrop-blur-sm">🎯 Intelligibility & Fluency</span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-medium backdrop-blur-sm">🔒 Purpose-scoped handoff</span>
          </div>
          {bridgeError ? <p role="alert" className="text-xs font-semibold text-rose-200">{bridgeError}</p> : null}
        </div>

        <div className="flex-shrink-0">
          <Button
            variant="primary"
            className="w-full sm:w-auto bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-black shadow-lg shadow-violet-900/40 border-0"
            disabled={bridging}
            onClick={startCoachPractice}
          >
            {bridging ? "Connecting securely…" : "Continue in Coach →"}
          </Button>
        </div>
      </div>
    </article>
  );
};
