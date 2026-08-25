import React from "react";

export type ProductBridgeView = {
  bridgeId: string;
  source: string;
  destination: string;
};

export interface ProductBridgeProps {
  bridge: ProductBridgeView;
  title?: string;
  description?: string;
  className?: string;
  onContinue?: () => void;
}

export function ProductBridge({ bridge, title = "Continue with your context", description, className = "", onContinue }: ProductBridgeProps) {
  return (
    <section className={`overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-[0_16px_40px_rgba(49,95,215,.09)] ${className}`} aria-labelledby={`${bridge.bridgeId}-title`}>
      <div className="bg-[linear-gradient(120deg,rgba(79,70,229,.10),rgba(56,189,248,.10),rgba(45,212,191,.10))] p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Lurexa Bridge</p>
        <h2 id={`${bridge.bridgeId}-title`} className="mt-1 text-xl font-bold tracking-[-.03em] text-slate-950">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{description ?? `Move from Lurexa ${bridge.source} to Lurexa ${bridge.destination} without starting over.`}</p>

        <div className="mt-6 flex items-center gap-3" aria-label={`Bridge from ${bridge.source} to ${bridge.destination}`}>
          <div className="min-w-0 flex-1 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">From</span>
            <div className="mt-0.5 truncate text-sm font-bold capitalize text-slate-900">Lurexa {bridge.source}</div>
          </div>
          <div className="relative flex w-20 shrink-0 items-center justify-center" aria-hidden="true">
            <span className="absolute h-px w-full bg-gradient-to-r from-indigo-300 via-sky-400 to-teal-300" />
            <span className="relative h-4 w-4 rounded-full border-4 border-white bg-sky-500 shadow-[0_0_18px_rgba(56,189,248,.55)]" />
          </div>
          <div className="min-w-0 flex-1 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">To</span>
            <div className="mt-0.5 truncate text-sm font-bold capitalize text-slate-900">Lurexa {bridge.destination}</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs leading-5 text-slate-500">Purpose-scoped · server-validated · expires automatically</p>
          {onContinue && <button type="button" onClick={onContinue} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">Continue</button>}
        </div>
      </div>
    </section>
  );
}
