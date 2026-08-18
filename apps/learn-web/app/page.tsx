import Link from "next/link";

const learnerBenefits = [
  "Learn with clear, structured lessons",
  "Track progress across every course",
  "Get support when you need it",
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.42),_transparent_42%),radial-gradient(circle_at_15%_20%,_rgba(20,184,166,0.25),_transparent_32%)]" />
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">lurexa<span className="text-indigo-300">.</span></Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10">Sign in</Link>
            <Link href="/signup" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-50">Get started</Link>
          </div>
        </nav>

        <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-32 lg:pt-24">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex rounded-full border border-indigo-300/30 bg-indigo-300/10 px-3 py-1 text-sm font-medium text-indigo-100">Learning that moves with you</p>
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">Build confidence, one meaningful lesson at a time.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Lurexa gives learners a focused path forward and gives educators the tools to create, guide, and understand progress.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="rounded-xl bg-indigo-500 px-6 py-3 text-center font-semibold shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-400">Start learning</Link>
              <Link href="/signup" className="rounded-xl border border-white/20 px-6 py-3 text-center font-semibold text-slate-100 transition hover:bg-white/10">Create a school account</Link>
            </div>
            <ul className="mt-10 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              {learnerBenefits.map((benefit) => <li key={benefit} className="flex items-center gap-2"><span className="text-teal-300">✓</span>{benefit}</li>)}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-indigo-950/50 backdrop-blur">
            <div className="rounded-[1.5rem] bg-slate-50 p-6 text-slate-900">
              <div className="flex items-center justify-between"><div><p className="text-sm font-medium text-indigo-600">Today&apos;s learning</p><h2 className="mt-1 text-xl font-bold">English B1</h2></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">On track</span></div>
              <div className="mt-7 rounded-2xl bg-indigo-600 p-5 text-white"><p className="text-sm text-indigo-100">Continue where you left off</p><p className="mt-2 text-lg font-semibold">Present tense in conversation</p><div className="mt-5 h-2 rounded-full bg-indigo-400"><div className="h-2 w-2/3 rounded-full bg-white" /></div><p className="mt-2 text-xs text-indigo-100">65% complete</p></div>
              <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl border border-slate-200 p-4"><p className="text-2xl font-bold">12</p><p className="mt-1 text-xs text-slate-500">Lessons complete</p></div><div className="rounded-xl border border-slate-200 p-4"><p className="text-2xl font-bold text-teal-600">5</p><p className="mt-1 text-xs text-slate-500">Day streak</p></div></div>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white px-6 py-20 text-slate-900 lg:px-8"><div className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">One connected platform</p><h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Made for learning progress—not just course completion.</h2><div className="mt-10 grid gap-5 md:grid-cols-3"><article className="rounded-2xl border border-slate-200 p-6"><p className="text-sm font-semibold text-indigo-600">For learners</p><h3 className="mt-3 text-xl font-bold">A clear next step</h3><p className="mt-3 text-sm leading-6 text-slate-600">Pick up lessons, see progress, and build momentum with a calm learning workspace.</p></article><article className="rounded-2xl border border-slate-200 p-6"><p className="text-sm font-semibold text-teal-600">For educators</p><h3 className="mt-3 text-xl font-bold">Create with confidence</h3><p className="mt-3 text-sm leading-6 text-slate-600">Create courses, publish lessons, and invite students from one teacher workspace.</p></article><article className="rounded-2xl border border-slate-200 p-6"><p className="text-sm font-semibold text-violet-600">For schools</p><h3 className="mt-3 text-xl font-bold">A platform that grows</h3><p className="mt-3 text-sm leading-6 text-slate-600">Give every learner a consistent experience while keeping access organized by school.</p></article></div></div></section>
    </main>
  );
}
