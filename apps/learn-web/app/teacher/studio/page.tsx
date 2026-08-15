"use client";

import React, { useState } from "react";
import { Button } from "@lurexa/ui/Button";
import { Card } from "@lurexa/ui/Card";
import { Badge } from "@lurexa/ui/Badge";
import { EcosystemService, BranchingScenarioNode } from "@lurexa/backend";

export default function LurexaStudioPage() {
  const [nodes] = useState<BranchingScenarioNode[]>([
    {
      id: "node_start",
      title: "Scenario Start: Lab Dilemma",
      contentMarkdown: "A chemical reaction starts bubbling unexpectedly. What is your immediate protocol?",
      choiceOptions: [
        { label: "Option A: Seal container with cap", nextNodeId: "node_fail", isCorrectPath: false },
        { label: "Option B: Neutralize with buffer solution", nextNodeId: "node_success", isCorrectPath: true },
      ],
    },
  ]);
  const [saving, setSaving] = useState(false);

  const handleSaveScenario = async () => {
    setSaving(true);
    try {
      const nodeMap: Record<string, BranchingScenarioNode> = {};
      nodes.forEach((n) => (nodeMap[n.id] = n));

      await EcosystemService.saveBranchingScenario({
        courseId: "crs_studio_chem",
        rootNodeId: "node_start",
        nodes: nodeMap,
      });
      alert("Interactive branching scenario saved successfully!");
    } catch {
      alert("Failed to save Studio scenario.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">🎬 Lurexa Studio</h1>
            <p className="text-slate-500">Advanced interactive branching scenario authoring tool</p>
          </div>
          <Button variant="primary" onClick={handleSaveScenario} isLoading={saving}>
            Save Branching Scenario
          </Button>
        </div>

        {/* Node Hierarchy Editor */}
        <div className="space-y-4">
          {nodes.map((node, idx) => (
            <Card key={node.id} title={`Node #${idx + 1}: ${node.title}`} action={<Badge variant="info">Branch Node</Badge>}>
              <div className="space-y-3 pt-2">
                <p className="text-sm text-slate-700 bg-slate-100 p-3 rounded-lg font-mono">
                  {node.contentMarkdown}
                </p>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Decision Pathways</span>
                  {node.choiceOptions.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center justify-between border border-slate-200 p-3 rounded-lg bg-white text-xs">
                      <span>{opt.label}</span>
                      <Badge variant={opt.isCorrectPath ? "success" : "warning"}>
                        {opt.isCorrectPath ? "Correct Branch ✓" : "Remedial Branch"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
