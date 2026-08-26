import Link from "next/link";
import { LurexaLearnLogo } from "./components/LurexaLearnLogo";
import { getEcosystemUrl } from "@lurexa/config/domains";

const ecosystemUrl = getEcosystemUrl("root");
const proof = [
  ["Built around you", "One evolving path connects goals, practice, and the next useful step."],
  ["Made for real life", "Speak, understand, and use English in the situations that matter."],
  ["Guidance that helps", "Teachers see the right moments to support without losing the human connection."],
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] text-slate-950">
      <section className="overflow-hidden bg-slate-950 text-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-5 sm:px-8">
          <LurexaLearnLogo inverse />
          <div className="flex items-center gap-1 sm:gap-3">
            <a href={ecosystemUrl} className="rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 sm:text-sm">Lurexa ecosystem</a>
            <Link href="/login" className="rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 sm:text-sm">Sign in</Link>
            <Link href="/onboarding" className="rounded-full bg-sky-400 px-3.5 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-300 sm:px-4 sm:text-sm">Start free</Link>
          </div>
        </nav>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:pb-28 lg:pt-20">
          <div className="absolute -right-32 top-4 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-bold tracking-[0.18em] text-sky-200">ENGLISH THAT ADAPTS TO REAL LIFE</p>
            <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[.95] tracking-tight sm:text-7xl">Learn English.<br /><span className="text-sky-300">Feel ready to use it.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">Lurexa Learn turns meaningful practice into a clear, personal path—so every lesson moves confidence forward.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/onboarding" className="rounded-xl bg-sky-400 px-6 py-3 text-center font-bold text-slate-950 shadow-lg shadow-sky-900/40 transition hover:bg-sky-300">Start learning free</Link>
              <Link href="/signup?role=educator" className="rounded-xl border border-white/20 px-6 py-3 text-center font-bold text-slate-100 transition hover:bg-white/10">I&apos;m an educator</Link>
            </div>
            <p className="mt-5 text-sm text-slate-400">No credit card. Start with the English you want to use.</p>
          </div>
          <div className="relative rounded-[2rem] bg-[var(--learn-surface)] p-3 shadow-2xl shadow-indigo-950/50">
            <div className="rounded-[1.5rem] bg-slate-50 p-6 text-slate-900 sm:p-8">
              <div className="flex items-center justify-between"><p className="text-xs font-bold tracking-[.15em] text-indigo-600">TODAY&apos;S PATH</p><span className="rounded-full bg-[var(--learn-mint)] px-3 py-1 text-xs font-bold text-teal-800">On track</span></div>
              <h2 className="mt-5 text-2xl font-bold">Speak naturally: making plans</h2><p className="mt-2 text-sm text-slate-500">Conversation foundations · A2</p>
              <div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-[68%] rounded-full bg-teal-400" /></div><div className="mt-3 flex justify-between text-xs font-semibold text-slate-500"><span>Week 6 progress</span><span>68%</span></div>
              <div className="mt-8 rounded-2xl bg-[var(--learn-ink)] p-5 text-white"><p className="text-xs font-bold tracking-[.15em] text-sky-200">UP NEXT · 12 MIN</p><p className="mt-3 text-lg font-bold">Make a plan with a friend</p><p className="mt-2 text-sm text-slate-300">Try it, get feedback, use it again.</p></div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="grid gap-10 lg:grid-cols-[.8fr_1.8fr]"><div><p className="text-xs font-bold tracking-[.18em] text-indigo-700">A CALMER WAY TO PROGRESS</p><h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-[var(--learn-ink)]">A learning platform that meets people where they are.</h2></div><div className="grid gap-4 md:grid-cols-3">{proof.map(([title, description], index) => <article key={title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-bold text-indigo-600">0{index + 1}</p><h3 className="mt-10 text-xl font-bold text-slate-900">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p></article>)}</div></div></section>
    </main>
  );
}
