import Link from "next/link";
import { CoachShell } from "../components/CoachShell";

export default function HistoryPage() {
  return <CoachShell active="History"><main className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8"><p className="text-[11px] font-black tracking-[.18em] text-[var(--lx-primary)]">MEMORY WITHOUT SURVEILLANCE</p><h1 className="mt-4 text-4xl font-black tracking-[-.055em] sm:text-6xl">Coach history should preserve learning value, not raw conversations forever.</h1><p className="mt-5 max-w-3xl text-base leading-8 text-[var(--lx-muted)]">Completed Coach sessions are designed to contribute minimized, governed learning evidence. Raw transcripts are not the long-term learner record. This page will surface trusted session summaries and Memory Threads as that projection is exposed to Coach.</p><section className="mt-10 grid gap-4 md:grid-cols-3">{[
["Session outcomes", "What you practiced and the approved outcome summary."],
["Recurring targets", "Knowledge Objects and pronunciation or fluency targets supported by evidence."],
["Memory Thread", "How a target has changed across Learn and Coach without exposing unnecessary raw evidence."],
].map(([title, copy]) => <article key={title} className="rounded-[26px] border border-[#dce8f5] bg-white p-6"><h2 className="text-xl font-black">{title}</h2><p className="mt-3 text-sm leading-6 text-[var(--lx-muted)]">{copy}</p></article>)}</section><div className="mt-10 rounded-[28px] border border-cyan-200 bg-cyan-50 p-6"><b className="text-sm text-cyan-950">Current implementation note</b><p className="mt-2 text-sm leading-6 text-cyan-900">Until the governed Coach-history projection is exposed by Core, this screen intentionally shows no fabricated session list or invented progress metrics.</p></div><Link href="/practice" className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-[var(--color-brand-navy)] px-6 text-sm font-black text-white">Start a new session →</Link></main></CoachShell>;
}
