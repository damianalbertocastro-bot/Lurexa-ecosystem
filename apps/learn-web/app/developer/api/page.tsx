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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">🔌 Lurexa Public API</h1>
            <p className="text-slate-500">Integrate Lurexa&apos;s AI engine directly into your SIS/LMS</p>
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
                <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-sm rounded-lg overflow-x-auto">
                  {issuedKey}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="API Endpoints Reference">
          <div className="space-y-3 text-xs text-slate-700 font-mono">
            <div className="p-3 bg-white border border-slate-200 rounded-lg flex justify-between">
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
