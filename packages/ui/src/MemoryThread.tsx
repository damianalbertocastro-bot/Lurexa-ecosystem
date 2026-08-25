import React from "react";
import type { MemoryThreadEventV1, MemoryThreadV1 } from "@lurexa/types";

export interface MemoryThreadProps {
  thread: MemoryThreadV1;
  className?: string;
}

const eventLabel: Record<MemoryThreadEventV1["kind"], string> = {
  observed: "Observed",
  practiced: "Practiced",
  feedback: "Feedback",
  improved: "Improved",
  stabilized: "Stabilized",
  regressed: "Needs attention",
  context: "Context",
};

const dotStyle: Record<MemoryThreadEventV1["kind"], string> = {
  observed: "bg-amber-400",
  practiced: "bg-sky-400",
  feedback: "bg-violet-400",
  improved: "bg-teal-500",
  stabilized: "bg-emerald-500",
  regressed: "bg-rose-400",
  context: "bg-slate-400",
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

export function MemoryThread({ thread, className = "" }: MemoryThreadProps) {
  return (
    <section className={`rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,.07)] sm:p-6 ${className}`} aria-labelledby="memory-thread-title">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Lurexa Memory Thread</p>
      <h2 id="memory-thread-title" className="mt-1 text-xl font-bold tracking-[-.03em] text-slate-950">{thread.topic.title}</h2>
      {thread.currentSummary && <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{thread.currentSummary}</p>}

      <ol className="relative mt-6 space-y-5 before:absolute before:bottom-3 before:left-[7px] before:top-3 before:w-px before:bg-slate-200">
        {thread.events.map((event) => (
          <li key={event.id} className="relative pl-8">
            <span className={`absolute left-0 top-1.5 z-10 h-[15px] w-[15px] rounded-full border-4 border-white shadow-sm ${dotStyle[event.kind]}`} aria-hidden="true" />
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <time dateTime={event.occurredAt} className="font-semibold">{formatDate(event.occurredAt)}</time>
              <span aria-hidden="true">·</span>
              <span className="font-semibold capitalize">Lurexa {event.sourceProduct}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">{eventLabel[event.kind]}</span>
            </div>
            <h3 className="mt-1 text-sm font-bold text-slate-900">{event.title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{event.summary}</p>
          </li>
        ))}
      </ol>

      {thread.events.length === 0 && <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">This thread is intentionally empty until governed learning evidence exists.</div>}

      <p className="mt-5 text-xs leading-5 text-slate-500">This is a learning-development projection, not a raw activity log or a complete record of everything you have done.</p>
    </section>
  );
}
