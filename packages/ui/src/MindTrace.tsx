import React from "react";

export type MindTraceView = {
  id: string;
  signal: string;
  interpretation: string;
  action: { label: string };
  confidence: string;
  evidenceBasis: { freshness: string };
  limitations: string[];
};

export interface MindTraceProps {
  trace: MindTraceView;
  className?: string;
  onAction?: () => void;
}

export function MindTrace({ trace, className = "", onAction }: MindTraceProps) {
  return (
    <section className={`rounded-[26px] border border-indigo-100 bg-[linear-gradient(145deg,#ffffff,#f7f8ff)] p-5 shadow-[0_14px_36px_rgba(79,70,229,.08)] ${className}`} aria-labelledby={`${trace.id}-title`}>
      <div className="flex items-center gap-3">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-white" aria-hidden="true">
          <span className="absolute h-5 w-5 rounded-full border border-sky-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 shadow-[0_0_16px_rgba(56,189,248,.5)]" />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-600">Mind Trace</p>
          <h2 id={`${trace.id}-title`} className="text-base font-bold tracking-[-.02em] text-slate-950">Why Lurexa suggested this</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Signal</span>
          <p className="mt-2 text-sm leading-6 text-slate-700">{trace.signal}</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-sky-700">Interpretation</span>
          <p className="mt-2 text-sm leading-6 text-slate-700">{trace.interpretation}</p>
        </div>
        <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700">Action</span>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{trace.action.label}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2.5 py-1">Confidence: {trace.confidence}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1">Evidence: {trace.evidenceBasis.freshness}</span>
        </div>
        {onAction && (
          <button type="button" onClick={onAction} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
            {trace.action.label}
          </button>
        )}
      </div>

      {trace.limitations.length > 0 && (
        <details className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
          <summary className="cursor-pointer font-semibold text-slate-700">What this explanation does not claim</summary>
          <ul className="mt-2 space-y-1.5 pl-4">
            {trace.limitations.map((limitation) => <li key={limitation} className="list-disc leading-5">{limitation}</li>)}
          </ul>
        </details>
      )}
    </section>
  );
}
