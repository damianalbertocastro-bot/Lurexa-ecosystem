import React from "react";

export type LearnerPulseDimensionView = {
  dimension: string;
  state: "unknown" | "emerging" | "developing" | "stable" | "strong";
  momentum: "declining" | "watch" | "steady" | "improving" | "accelerating" | "unknown";
  summary: string;
  historicalDeltaPercent?: number;
  comparisonWindowDays?: number;
};

export type LearnerPulseView = {
  learnerId: string;
  dimensions: LearnerPulseDimensionView[];
  overallMomentum: LearnerPulseDimensionView["momentum"];
  highlights: Array<{ kind: string; label: string }>;
  longitudinalVelocity?: {
    trend: "accelerating" | "improving" | "steady" | "watch";
    percentChange: number;
    daysWindow: number;
    headline: string;
  };
};

export interface LearnerPulseProps {
  pulse: LearnerPulseView;
  className?: string;
  compact?: boolean;
}

const stateStyles: Record<LearnerPulseDimensionView["state"], string> = {
  unknown: "border-[var(--lx-border)] bg-[var(--lx-canvas)] text-[var(--lx-muted)]",
  emerging: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  developing: "border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-200",
  stable: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  strong: "border-indigo-500/30 bg-indigo-500/10 text-indigo-800 dark:text-indigo-200",
};

const momentumGlyph: Record<LearnerPulseDimensionView["momentum"], string> = {
  declining: "↓",
  watch: "↘",
  steady: "→",
  improving: "↗",
  accelerating: "↑",
  unknown: "·",
};

const momentumBadge: Record<LearnerPulseDimensionView["momentum"], { icon: string; text: string }> = {
  accelerating: { icon: "🚀", text: "Accelerating" },
  improving: { icon: "📈", text: "Improving" },
  steady: { icon: "🎯", text: "Consistent" },
  watch: { icon: "⚠️", text: "Needs Focus" },
  declining: { icon: "📉", text: "Declining" },
  unknown: { icon: "·", text: "Baseline" },
};

function Dimension({ item }: { item: LearnerPulseDimensionView }) {
  return (
    <li className={`rounded-2xl border p-4 transition ${stateStyles[item.state]}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-wider">{item.dimension}</span>
        <div className="flex items-center gap-1.5">
          {item.historicalDeltaPercent != null && (
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${
                item.historicalDeltaPercent >= 0
                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                  : "bg-rose-500/20 text-rose-700 dark:text-rose-300"
              }`}
            >
              {item.historicalDeltaPercent >= 0 ? `+${item.historicalDeltaPercent}%` : `${item.historicalDeltaPercent}%`}
            </span>
          )}
          <span
            aria-label={`Momentum: ${item.momentum}`}
            className="text-base font-black"
            title={`Momentum: ${item.momentum}`}
          >
            {momentumGlyph[item.momentum]}
          </span>
        </div>
      </div>
      <div className="mt-1.5 text-sm font-bold capitalize">{item.state}</div>
      <p className="mt-1 text-xs leading-relaxed opacity-85">{item.summary}</p>
    </li>
  );
}

export function LearnerPulse({ pulse, className = "", compact = false }: LearnerPulseProps) {
  const titleId = `learner-pulse-${pulse.learnerId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const known = pulse.dimensions.filter((dimension) => dimension.state !== "unknown").length;
  const velocity = pulse.longitudinalVelocity;

  return (
    <section
      aria-labelledby={titleId}
      className={`overflow-hidden rounded-[28px] border border-[var(--lx-border)] bg-[var(--lx-surface)] shadow-[var(--lx-card-shadow)] ${className}`}
    >
      <div className="relative border-b border-[var(--lx-border)] bg-[radial-gradient(circle_at_top_left,rgba(89,43,214,.12),transparent_48%),radial-gradient(circle_at_top_right,rgba(18,205,212,.12),transparent_48%)] px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--lx-primary)]">
              Signature Experience · Learner Pulse
            </p>
            <h2 id={titleId} className="mt-1 text-xl font-black tracking-tight text-[var(--lx-ink)]">
              Your learning is evolving
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--lx-muted)]">
              A continuous, evidence-aware pulse of your English capabilities across Lurexa. Unknown
              dimensions stay unknown until verified evidence is recorded.
            </p>
          </div>
          <div
            className="relative hidden h-16 w-16 shrink-0 items-center justify-center sm:flex"
            aria-hidden="true"
          >
            <div className="absolute h-16 w-16 rounded-full border border-indigo-500/20" />
            <div className="absolute h-10 w-10 rounded-full border border-cyan-500/30" />
            <div className="absolute h-6 w-6 rounded-full bg-gradient-to-br from-[var(--lx-primary)] to-[var(--lx-accent)] shadow-[0_0_20px_rgba(89,43,214,.4)]" />
          </div>
        </div>

        {/* Momentum & Longitudinal Velocity Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-[var(--lx-border)] bg-[var(--lx-canvas)]/80 px-3 py-1 font-bold text-[var(--lx-ink)]">
            {known}/{pulse.dimensions.length} evidence-aware dimensions
          </span>
          <span className="rounded-full border border-[var(--lx-border)] bg-[var(--lx-canvas)]/80 px-3 py-1 font-bold text-[var(--lx-primary)]">
            {momentumBadge[pulse.overallMomentum]?.icon} {momentumBadge[pulse.overallMomentum]?.text} Momentum
          </span>
          {velocity && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-black text-emerald-700 dark:text-emerald-300">
              ⚡ {velocity.headline} (+{velocity.percentChange}% over {velocity.daysWindow}d)
            </span>
          )}
        </div>
      </div>

      <div className={compact ? "p-4" : "p-5 sm:p-6"}>
        <ul className={`grid gap-3 ${compact ? "grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
          {pulse.dimensions.map((dimension) => (
            <Dimension key={dimension.dimension} item={dimension} />
          ))}
        </ul>

        {pulse.highlights.length > 0 && (
          <div className="mt-5 rounded-2xl bg-[var(--lx-canvas)] border border-[var(--lx-border)] p-4">
            <p className="text-xs font-black uppercase tracking-wider text-[var(--lx-muted)]">
              Current Evidence Highlights
            </p>
            <ul className="mt-2 space-y-2 text-sm text-[var(--lx-ink)]">
              {pulse.highlights.map((highlight, index) => (
                <li key={`${highlight.kind}-${index}`} className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--lx-primary)]"
                  />
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
