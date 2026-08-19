"use client";

import React, { useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { EcosystemService } from "@lurexa/backend";

export default function DeveloperAPIPage() {
  const [issuedKey, setIssuedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateKey = async () => {
    setLoading(true);
    try {
      const result = await EcosystemService.generateAPIKey("org_institutional_demo", 2500);
      setIssuedKey(result.rawKey);
    } catch {
      alert("Failed to issue API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--learn-canvas)] p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#dfe7fb] pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-[-.06em] text-[#071d67]">Build on Lurexa.</h1>
            <p className="mt-2 text-[#6677a5]">Use authorised contracts to connect your SIS or LMS responsibly.</p>
          </div>
          <Badge variant="success">v1.0 GraphQL / REST</Badge>
        </div>

        <Card title="Institutional API Keys" subtitle="Authenticate server-to-server requests">
          <div className="space-y-4 pt-2">
            {!issuedKey ? (
              <Button variant="primary" onClick={handleGenerateKey} isLoading={loading}>
                + Generate Production API Key
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase">Your New API Token (Save immediately):</p>
                <div className="rounded-xl bg-[#071d67] p-4 font-mono text-sm text-[#8ff2ed] overflow-x-auto">
                  {issuedKey}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="API Endpoints Reference">
          <div className="space-y-3 font-mono text-xs text-[#314b88]">
            <div className="flex justify-between rounded-xl border border-[#dfe7fb] bg-white p-4">
              <span><strong className="text-indigo-600">POST</strong> /api/v1/students/sync</span>
              <span className="text-slate-400">Sync SIS Rosters</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between">
              <span><strong className="text-emerald-600">GET</strong> /api/v1/analytics/scores</span>
              <span className="text-slate-400">Fetch Grades & AI Insights</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
