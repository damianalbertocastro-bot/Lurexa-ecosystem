"use client";

import React, { useState } from "react";
import { Badge } from "@lurexa/ui/Badge";
import type { BranchingScenarioNode } from "@lurexa/backend";

export default function LearnScenarioLabPage() {
  const [nodes] = useState<BranchingScenarioNode[]>([
    {
      id: "node_start",
      title: "Scenario example: Lab dilemma",
      contentMarkdown: "A chemical reaction starts bubbling unexpectedly. What is your immediate protocol?",
      choiceOptions: [
        { label: "Option A: Seal container with cap", nextNodeId: "node_fail", isCorrectPath: false },
        { label: "Option B: Neutralize with buffer solution", nextNodeId: "node_success", isCorrectPath: true },
      ],
    },
  ]);

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8 sm:py-12">
      <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071d67] via-[#17368f] to-[#592bd6] px-6 py-10 text-white shadow-[0_22px_60px_rgba(35,48,133,.18)] sm:px-10 sm:py-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#12cdd4]/20 blur-3xl" />
        <div className="relative max-w-3xl"><p className="text-[11px] font-extrabold tracking-[.2em] text-[#8df4ef]">LEARN SCENARIO LAB · PROTOTYPE</p><h1 className="mt-4 text-4xl font-black tracking-[-.055em] sm:text-5xl">Prototype branching activities safely.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100">This is an experimental authoring surface inside Lurexa Learn. It is not the standalone Lurexa Studio product, and demo scenarios are not persisted to learner courses.</p></div>
      </section>

      <section className="mt-6 rounded-[30px] border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-extrabold tracking-[.18em] text-amber-700">AUTHORING GUARDRAIL</p><h2 className="mt-2 text-xl font-black">Saving is intentionally disabled for this demo.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-amber-800">A production scenario must be created from an authenticated course/lesson context, use the governed learning-activity contract, and persist through the normal Learn authoring workflow. Hard-coded demo course IDs are not allowed.</p></div><Badge variant="warning">Prototype only</Badge></div>
      </section>

      <section className="mt-6 space-y-4">
        {nodes.map((node, index) => <article key={node.id} className="rounded-[30px] border border-[#dfe6f8] bg-white p-7 shadow-[0_14px_36px_rgba(32,52,128,.07)]"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold tracking-[.18em] text-[#592bd6]">NODE {String(index + 1).padStart(2, "0")}</p><h2 className="mt-2 text-2xl font-black tracking-[-.04em] text-[#10245f]">{node.title}</h2></div><Badge variant="info">Branch node</Badge></div><p className="mt-5 rounded-2xl bg-[#f3f6ff] p-4 font-mono text-sm leading-6 text-[#314b88]">{node.contentMarkdown}</p><div className="mt-5 space-y-3"><p className="text-[10px] font-extrabold tracking-[.15em] text-[#7280a6]">DECISION PATHWAYS</p>{node.choiceOptions.map((option, optionIndex) => <div key={`${option.label}-${optionIndex}`} className="flex flex-col gap-3 rounded-2xl border border-[#dfe6f8] bg-white p-4 text-sm sm:flex-row sm:items-center sm:justify-between"><span className="font-semibold text-[#10245f]">{option.label}</span><Badge variant={option.isCorrectPath ? "success" : "warning"}>{option.isCorrectPath ? "Target branch" : "Remedial branch"}</Badge></div>)}</div></article>)}
      </section>
    </main>
  );
}
