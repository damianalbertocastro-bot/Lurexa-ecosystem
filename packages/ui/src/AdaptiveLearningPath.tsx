import React from "react";

export type AdaptivePathNodeView = {
  id: string;
  state: "completed" | "current" | "recommended" | "locked" | "optional";
  title: string;
  product: string;
  knowledgeObjectIds: string[];
  reason:
    | "canonical_sequence"
    | "reinforce_recurring_error"
    | "practice_prerequisite"
    | "coach_speaking_transfer"
    | "review_after_instability"
    | "optional_enrichment";
  required: boolean;
};

export type AdaptiveLearningPathView = {
  nodes: AdaptivePathNodeView[];
};

export interface AdaptiveLearningPathProps {
  path: AdaptiveLearningPathView;
  className?: string;
  onSelectNode?: (node: AdaptivePathNodeView) => void;
}

const nodeStyle: Record<AdaptivePathNodeView["state"], string> = {
  completed: "border-teal-200 bg-teal-50",
  current: "border-indigo-300 bg-indigo-50 shadow-[0_8px_24px_rgba(79,70,229,.12)]",
  recommended: "border-sky-200 bg-sky-50",
  locked: "border-slate-200 bg-slate-50 opacity-70",
  optional: "border-violet-200 bg-violet-50",
};

const reasonLabel: Record<AdaptivePathNodeView["reason"], string> = {
  canonical_sequence: "Curriculum",
  reinforce_recurring_error: "Reinforcement",
  practice_prerequisite: "Prerequisite",
  coach_speaking_transfer: "Coach practice",
  review_after_instability: "Review",
  optional_enrichment: "Enrichment",
};

export function AdaptiveLearningPath({ path, className = "", onSelectNode }: AdaptiveLearningPathProps) {
  return (
    <section className={`rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,.07)] sm:p-6 ${className}`} aria-labelledby="adaptive-path-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Adaptive Learning Path</p>
          <h2 id="adaptive-path-title" className="mt-1 text-xl font-bold tracking-[-.03em] text-slate-950">Your route, with the curriculum intact</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Lurexa can add targeted support around your path without silently rewriting required learning.</p>
        </div>
        <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">Canonical requirements preserved</span>
      </div>

      <ol className="relative mt-6 space-y-3 before:absolute before:bottom-5 before:left-[18px] before:top-5 before:w-px before:bg-gradient-to-b before:from-indigo-200 before:via-sky-200 before:to-teal-200">
        {path.nodes.map((node, index) => (
          <li key={node.id} className="relative pl-12">
            <span className={`absolute left-[10px] top-5 z-10 h-[17px] w-[17px] rounded-full border-4 border-white ${node.state === "current" ? "bg-indigo-500" : node.state === "completed" ? "bg-teal-500" : "bg-sky-400"}`} aria-hidden="true" />
            <button
              type="button"
              disabled={node.state === "locked" || !onSelectNode}
              onClick={() => onSelectNode?.(node)}
              className={`w-full rounded-2xl border p-4 text-left transition ${nodeStyle[node.state]} ${onSelectNode && node.state !== "locked" ? "hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2" : ""}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{index + 1}</span>
                  <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-600">{reasonLabel[node.reason]}</span>
                  <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-600">{node.product}</span>
                </div>
                {node.required ? <span className="text-xs font-semibold text-slate-500">Required</span> : <span className="text-xs font-semibold text-sky-700">Adaptive overlay</span>}
              </div>
              <div className="mt-2 text-base font-bold tracking-[-.02em] text-slate-900">{node.title}</div>
              {node.knowledgeObjectIds.length > 0 && <p className="mt-1 text-xs text-slate-500">Targets {node.knowledgeObjectIds.length} mapped knowledge object{node.knowledgeObjectIds.length === 1 ? "" : "s"}</p>}
            </button>
          </li>
        ))}
      </ol>

      {path.nodes.length === 0 && <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">No route is available yet. Lurexa needs current curriculum context before it can build this view.</div>}
    </section>
  );
}
