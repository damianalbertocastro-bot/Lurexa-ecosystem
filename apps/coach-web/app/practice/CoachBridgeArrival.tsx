"use client";

import { useEffect, useState } from "react";
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
    void authenticatedFetch("/api/product-bridge?action=resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bridgeId, destination: "coach" }),
    }).then(async (response) => {
      const payload = await response.json() as ProductBridgeResolutionV1 & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to validate the Lurexa handoff.");
      if (!cancelled) setResolution(payload);
    }).catch((caught) => {
      if (!cancelled) setError(caught instanceof Error ? caught.message : "Unable to validate the Lurexa handoff.");
    });
    return () => { cancelled = true; };
  }, [bridgeId]);

  if (!bridgeId) return null;
  if (error) return <div role="alert" className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"><b>Secure handoff unavailable.</b> {error} Coach can still request its own authorized context when you start.</div>;
  return <div role="status" aria-live="polite" className="mb-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950"><b>{resolution ? "Cross-product context verified." : "Verifying your Lurexa handoff…"}</b><span className="ml-1">Coach independently authorizes the context it needs for this session.</span></div>;
}
