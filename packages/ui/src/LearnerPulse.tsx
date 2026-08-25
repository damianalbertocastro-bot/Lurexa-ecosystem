import React from "react";

export type LearnerPulseDimensionView = {
  dimension: string;
  state: "unknown" | "emerging" | "developing" | "stable" | "strong";
  momentum: "declining" | "watch" | "steady" | "improving" | "accelerating" | "unknown";
  summary: string;
};

export type LearnerPulseView = {
  learnerId: string;
  dimensions: LearnerPulseDimensionView[];
  overallMomentum: LearnerPulseDimensionView["momentum"];
  highlights: Array<{ kind: string; label: string }>;
};

export interface LearnerPulseProps {
  pulse: LearnerPulseView;
  className?: string;
  compact?: boolean;
}

const stateStyles: Record<LearnerPulseDimensionView["state"], string> = {
  unknown: "border-slate-200 bg-slate-50 text-slate-500",
  emerging: "border-amber-200 bg-amber-50 text-amber-800",
  developing: "border-sky-200 bg-sky-50 text-sky-800",
  stable: "border-teal-200 bg-teal-50 text-teal-800",
  strong: "border-indigo-200 bg-indigo-50 text-indigo-800",
};

const momentumGlyph: Record<LearnerPulseDimensionView["momentum"], string> = {
  declining: "↓",
  watch: "↘",
  steady: "→",
  improving: "↗",
  accelerating: "↑",
  unknown: "·",
};

function Dimension({ item }: { item: LearnerPulseDimensionView }) {
  return (
    <li className={`rounded-2xl border px-3 py-3 ${stateStyles[item.state]}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-[0.12em]">{item.dimension}</span>
        <span aria-label={`Momentum: ${item.momentum}`} className="text-lg font-semibold" title={`Momentum: ${item.momentum}`}>
          {momentumGlyph[item.momentum]}
        </span>
      </div>
      <div className="mt-1 text-sm font-semibold capitalize">{item.state}</div>
      <p className="mt-1 text-xs leading-5 opacity-80">{item.summary}</p>
    </li>
  );
}

export function LearnerPulse({ pulse, className = "", compact = false }: LearnerPulseProps) {
  const titleId = `learner-pulse-${pulse.learnerId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const known = pulse.dimensions.filter((dimension) => dimension.state !== "unknown").length;

  return (
    <section
      aria-labelledby={titleId}
      className={`overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-[0_18px_45px_rgba(49,95,215,.10)] ${className}`}
    >
      <div className="relative border-b border-indigo-100 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,.16),transparent_42%),radial-gradient(circle_at_top_right,rgba(45,212,191,.14),transparent_42%)] px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Learner Pulse</p>
            <h2 id={titleId} className="mt-1 text-xl font-bold tracking-[-.03em] text-slate-950">Your learning is evolving</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              A current, evidence-aware view of the learning areas Lurexa can support. Unknown areas stay unknown until enough evidence exists.
            </p>
          </div>
          <div className="relative hidden h-20 w-20 shrink-0 items-center justify-center sm:flex" aria-hidden="true">
            <div className="absolute h-20 w-20 rounded-full border border-indigo-200" />
            <div className="absolute h-14 w-14 rounded-full border border-sky-200" />
            <div className="absolute h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 via-sky-400 to-teal-300 shadow-[0_0_28px_rgba(56,189,248,.45)]" />
            <div className="absolute h-2 w-2 translate-x-8 -translate-y-2 rounded-full bg-teal-400" />
            <div className="absolute h-2 w-2 -translate-x-6 translate-y-6 rounded-full bg-indigo-400" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 font-semibold">{known}/{pulse.dimensions.length} evidence-aware dimensions</span>
          <span className="rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5">Momentum: {pulse.overallMomentum}</span>
        </div>
      </div>

      <div className={compact ? "p-4" : "p-5 sm:p-6"}>
        <ul className={`grid gap-3 ${compact ? "grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
          {pulse.dimensions.map((dimension) => <Dimension key={dimension.dimension} item={dimension} />)}
        </ul>

        {pulse.highlights.length > 0 && (
          <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Current focus</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">
              {pulse.highlights.map((highlight, index) => (
                <li key={`${highlight.kind}-${index}`} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  <span>{highlight.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
