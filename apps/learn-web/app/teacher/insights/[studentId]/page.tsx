"use client";

import React, { useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { Input } from "@lurexa/ui/Input";

export default function StudentInterventionPage({
  params,
}: {
  params: { studentId: string };
}) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSendIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setMessage("");
      setSent(false);
      alert("Targeted review material sent to student!");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Student Profile & Targeted Intervention</h1>
            <p className="text-slate-500">Student ID: {params.studentId}</p>
          </div>
          <Badge variant="warning">At Risk</Badge>
        </div>

        {/* Learning Diagnosis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Learning Diagnosis">
            <p className="text-sm text-slate-600 mb-2">
              <strong>Struggle Concept:</strong> Present Perfect Tense vs Past Simple
            </p>
            <p className="text-sm text-slate-600 mb-2">
              <strong>AI Tutor Interactions:</strong> 8 queries (Asked for extra examples 3x)
            </p>
            <p className="text-sm text-slate-600">
              <strong>Quiz Retries:</strong> 3 attempts on Module 2 Quiz
            </p>
          </Card>

          <Card title="Suggested Remedy">
            <p className="text-sm text-indigo-900 bg-indigo-50 p-3 rounded-lg">
              "Assign 5 extra practice exercises focusing on key time markers ('already', 'yet', 'since') before next module unlock."
            </p>
          </Card>
        </div>

        {/* Send Targeted Material / Nudge */}
        <Card title="Send Targeted Intervention" subtitle="Message student directly with custom review materials">
          <form onSubmit={handleSendIntervention} className="space-y-4 pt-2">
            <Input
              label="Intervention Note / Action Item"
              placeholder="e.g. Hi Carlos, please review Module 2 practice exercises before Friday's quiz."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" isLoading={sent}>
              Send Review Package
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}