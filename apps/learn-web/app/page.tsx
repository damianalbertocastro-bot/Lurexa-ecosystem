import Link from "next/link";
import { LurexaLearnLogo } from "./components/LurexaLearnLogo";

const principles = [
  { number: "01", title: "Learn in context", description: "Every lesson begins with a real thing you want to say, understand, or do." },
  { number: "02", title: "Practise with purpose", description: "Short, varied practice helps you use English—not just recognize it." },
  { number: "03", title: "Keep moving forward", description: "Your progress and useful next step stay connected across your path." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] text-[var(--learn-ink)]">
      <section className="relative overflow-hidden bg-[var(--learn-ink)] text-white">
        <div aria-hidden="true" className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_78%_24%,rgba(79,70,229,.5),transparent_28%),radial-gradient(circle_at_82%_80%,rgba(45,212,191,.18),transparent_24%)]" />
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <LurexaLearnLogo inverse />
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200">
              Sign in
            </Link>
            <Link href="/signup" className="rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[var(--learn-ink)] transition hover:bg-[var(--learn-sky)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200">
              Start free
            </Link>
          </div>
        </nav>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:px-10 lg:pb-28 lg:pt-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[.18em] text-sky-200">LUREXA LEARN · ENGLISH FOR REAL LIFE</p>
            <h1 className="mt-6 text-5xl font-bold leading-[.96] tracking-[-.045em] sm:text-6xl lg:text-7xl">
              English becomes useful when it becomes <span className="text-sky-300">yours.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Learn through meaningful practice, get a clearer next step, and build confidence for the conversations that matter to you.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="rounded-xl bg-[var(--learn-brand)] px-6 py-3.5 text-center font-bold shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Start your learning path
              </Link>
              <Link href="/signup" className="rounded-xl border border-white/25 px-6 py-3.5 text-center font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                I&apos;m an educator
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-400">Start with your goals. No credit card required.</p>
          </div>

          <div className="relative self-center rounded-[1.7rem] border border-white/15 bg-white/10 p-3 shadow-2xl shadow-slate-950/40 backdrop-blur">
            <div className="rounded-[1.25rem] bg-[var(--learn-paper)] p-6 text-[var(--learn-ink)] sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[11px] font-bold tracking-[.16em] text-[var(--learn-brand-strong)]">YOUR NEXT STEP</p>
                <span className="rounded-full bg-[var(--learn-mint)] px-3 py-1 text-xs font-bold text-emerald-800">12 min</span>
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight">Make plans with a friend</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--learn-muted)]">A2 · Conversation foundations</p>
              <div className="mt-7 rounded-2xl bg-[var(--learn-sky)] p-4">
                <p className="text-xs font-bold text-sky-900">TODAY&apos;S MISSION</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">Use simple phrases to invite someone, suggest a time, and respond naturally.</p>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--learn-muted)]"><span>Current module</span><span>68% complete</span></div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-[68%] rounded-full bg-teal-500" /></div>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-[var(--learn-line)] pt-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--learn-ink)] text-sm" aria-hidden="true">→</span>
                <p className="text-sm font-semibold">Continue where your learning left off.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.78fr_1.8fr]">
          <div>
            <p className="text-xs font-bold tracking-[.18em] text-[var(--learn-brand-strong)]">A LEARNING PATH, NOT A CONTENT FEED</p>
            <h2 className="mt-4 max-w-md text-4xl font-bold leading-tight tracking-tight">The work you do today makes tomorrow&apos;s practice more useful.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.number} className="rounded-2xl border border-[var(--learn-line)] bg-[var(--learn-paper)] p-6 shadow-sm">
                <p className="text-sm font-bold text-[var(--learn-brand)]">{principle.number}</p>
                <h3 className="mt-10 text-xl font-bold">{principle.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--learn-muted)]">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--learn-line)] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-18 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div className="rounded-3xl bg-[var(--learn-ink)] p-8 text-white sm:p-10">
            <p className="text-xs font-bold tracking-[.18em] text-sky-200">FOR LEARNERS</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Less guessing. More useful practice.</h2>
            <p className="mt-4 max-w-md leading-7 text-slate-300">Know what you are working toward, take one meaningful action at a time, and return with your progress intact.</p>
            <Link href="/signup" className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 font-bold text-[var(--learn-ink)] transition hover:bg-[var(--learn-sky)]">Find your starting point</Link>
          </div>
          <div className="rounded-3xl bg-[var(--learn-mint)] p-8 sm:p-10">
            <p className="text-xs font-bold tracking-[.18em] text-emerald-800">FOR EDUCATORS</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">See where your attention will make the difference.</h2>
            <p className="mt-4 max-w-md leading-7 text-slate-700">Create learning experiences, manage your class, and use progress as a reason to teach—not just a report to read.</p>
            <Link href="/signup" className="mt-7 inline-flex rounded-xl bg-[var(--learn-ink)] px-5 py-3 font-bold text-white transition hover:bg-slate-700">Create your teaching space</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
        <p className="text-xs font-bold tracking-[.18em] text-[var(--learn-brand-strong)]">START WITH ONE MEANINGFUL STEP</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight">Build English you can actually use.</h2>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-[var(--learn-muted)]">Lurexa Learn brings practice, progress, and human teaching into one continuous path.</p>
        <Link href="/signup" className="mt-8 inline-flex rounded-xl bg-[var(--learn-brand)] px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-[var(--learn-brand-strong)]">Start learning free</Link>
      </section>
    </main>
  );
}
