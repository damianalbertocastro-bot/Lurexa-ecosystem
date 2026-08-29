import Link from "next/link";
import { CoachShell } from "../components/CoachShell";

const principles = [
  ["Intelligibility", "Prioritize being understood reliably before chasing accent similarity."],
  ["Transfer awareness", "Use governed Dominican-Spanish transfer patterns as hypotheses, never stereotypes or automatic diagnoses."],
  ["Contextual practice", "Practice sounds inside meaningful words, phrases, rhythm, and conversation rather than isolated drilling only."],
  ["Level-sensitive feedback", "Keep beginner correction confidence-safe while increasing precision and directness at higher proficiency."],
];

export default function PronunciationPage() {
  return <CoachShell active="Pronunciation"><main className="mx-auto max-w-[1260px] px-5 py-14 sm:px-8"><p className="text-[11px] font-black tracking-[.18em] text-[var(--lx-primary)]">PRONUNCIATION & INTELLIGIBILITY</p><h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-.055em] sm:text-6xl">Train the parts of speech that change understanding, rhythm, and confidence.</h1><p className="mt-5 max-w-3xl text-base leading-8 text-[var(--lx-muted)]">Coach’s pronunciation work is grounded in intelligibility—not accent erasure. It can use authorized recurring patterns, CEFR context, and Dominican-Spanish transfer knowledge to choose more useful practice.</p><section className="mt-10 grid gap-4 md:grid-cols-2">{principles.map(([title, copy]) => <article key={title} className="rounded-[28px] border border-[#dce8f5] bg-white p-7"><h2 className="text-2xl font-black tracking-[-.04em]">{title}</h2><p className="mt-3 text-sm leading-7 text-[var(--lx-muted)]">{copy}</p></article>)}</section><div className="mt-10 rounded-[30px] bg-gradient-to-br from-[var(--color-brand-navy)] to-[#5c2ac7] p-8 text-white"><p className="text-[10px] font-black tracking-[.17em] text-[var(--lx-accent)]">PRACTICE, DON’T JUST READ</p><h2 className="mt-3 text-3xl font-black tracking-[-.05em]">Use these principles inside a live adaptive session.</h2><Link href="/practice" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-white px-6 text-sm font-black text-[#4525a7]">Open Coach practice →</Link></div></main></CoachShell>;
}
