"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ProductBridgeResolutionV1 } from "@lurexa/types";
import { authenticatedFetch } from "../../lib/authenticated-fetch";

export function CoachBridgeArrival() {
  const searchParams = useSearchParams();
  const bridgeId = searchParams.get("bridge");
  const [resolution, setResolution] = useState<ProductBridgeResolutionV1 | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bridgeId) return;
    let cancelled = false;

    authenticatedFetch("/api/product-bridge?action=resolve", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bridgeId, destination: "coach" }),
    })
      .then(async (response) => {
        const payload = await response.json() as ProductBridgeResolutionV1 & { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Unable to validate the Lurexa handoff.");
        if (!cancelled) setResolution(payload);
      })
      .catch((cause) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Unable to validate the Lurexa handoff.");
      });

    return () => { cancelled = true; };
  }, [bridgeId]);

  if (!bridgeId) return null;

  if (error) {
    return (
      <div role="alert" className="mx-auto mb-4 max-w-6xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Secure handoff unavailable.</strong> {error} You can still start Coach normally; Coach will request its own authorized learner context.
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className="mx-auto mb-4 max-w-6xl rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${resolution ? "bg-teal-500" : "animate-pulse bg-cyan-400"}`} aria-hidden="true" />
        <div>
          <strong>{resolution ? "Learn context handoff verified." : "Verifying your Learn → Coach handoff…"}</strong>
          <span className="ml-1 text-cyan-800">Coach will independently re-authorize the learning context it needs for this session.</span>
        </div>
      </div>
    </div>
  );
}
