import Link from "next/link";
import { LurexaLearnLogo } from "./components/LurexaLearnLogo";
import { EcosystemDropdown } from "@lurexa/ui/EcosystemDropdown";

const proof = [
  {
    tag: "Adaptive Mastery",
    title: "Built around you",
    description: "One evolving Learner Model connects your goals, targeted speaking practice, and the next most useful step.",
    icon: "🎯",
  },
  {
    tag: "Real-World Context",
    title: "Made for real life",
    description: "Speak, understand, and use English with confidence in Caribbean, Latin American, and international situations.",
    icon: "🌍",
  },
  {
    tag: "Educator Synchrony",
    title: "Guidance that empowers",
    description: "Teachers see the exact moments to intervene and guide without losing authentic human interaction.",
    icon: "🤝",
  },
];

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-[var(--lx-canvas)] text-slate-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-950 text-white">
          {/* Multi-layered ambient lighting */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-10 h-[500px] w-[500px] rounded-full bg-indigo-500/25 blur-[140px]" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-400/15 blur-[100px]" />

          {/* Global Navigation */}
          <nav aria-label="Primary" className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-5 sm:px-8">
            <LurexaLearnLogo inverse />
            <div className="flex items-center gap-2 sm:gap-3">
              <EcosystemDropdown currentApp="learn" inverse />
              <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10 sm:text-sm"
              >
                Sign in
              </Link>
              <Link
                href="/onboarding"
                className="rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-4 py-2 text-xs font-black text-slate-950 shadow-md shadow-cyan-500/20 transition hover:brightness-110 sm:px-5 sm:text-sm"
              >
                Start free
              </Link>
            </div>
          </nav>

          {/* Hero Grid */}
          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-12 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:pb-32 lg:pt-16">
            <div className="animate-fade-slide-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3.5 py-1 text-xs font-extrabold tracking-wide text-sky-300 backdrop-blur-md">
                <span aria-hidden="true" className="h-2 w-2 animate-ping rounded-full bg-sky-400" />
                ENGLISH THAT ADAPTS TO REAL LIFE
              </div>

              <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Learn English.
                <br />
                <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                  Feel ready to use it.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Lurexa Learn turns meaningful speaking and listening practice into an adaptive personal path — so every lesson moves your confidence forward.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/onboarding"
                  className="rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-7 py-3.5 text-center font-black text-slate-950 shadow-xl shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-cyan-400/35"
                >
                  Start learning free
                </Link>
                <Link
                  href="/signup?role=educator"
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-center font-bold text-slate-100 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  I&apos;m an educator
                </Link>
              </div>

              <p className="mt-4 text-xs font-medium text-[var(--lx-muted)]">
                ✓ No credit card required &nbsp;·&nbsp; ✓ Free placement check &nbsp;·&nbsp; ✓ CEFR A1–C2
              </p>
            </div>

            {/* Hero Preview Card */}
            <div className="animate-scale-in relative rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/15 to-white/5 p-3 shadow-[0_24px_60px_rgba(0,0,0,.45)] backdrop-blur-2xl">
              <div className="rounded-[1.6rem] bg-slate-900/90 p-6 text-white sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">TODAY&apos;S PATH</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    On track
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-tight text-white">Speak naturally: making plans</h2>
                <p className="mt-1.5 text-sm text-[var(--lx-muted)]">Conversational foundations · CEFR A2</p>

                <div className="mt-7 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[var(--lx-muted)]">
                    <span>Weekly mastery milestone</span>
                    <span className="text-cyan-300">68%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-label="Weekly mastery milestone" aria-valuemin={0} aria-valuemax={100} aria-valuenow={68}>
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 transition-all duration-500" style={{ width: "68%" }} />
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/80 to-violet-950/70 p-5 text-white shadow-inner">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[.18em] text-cyan-200">UP NEXT · 12 MIN</p>
                    <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold text-cyan-200">+50 Pts</span>
                  </div>
                  <p className="mt-2.5 text-lg font-bold text-white">Make a plan with a friend</p>
                  <p className="mt-1 text-xs text-slate-300">Practice real audio turns, receive instant phonetic clarity feedback.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proof Section */}
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[.85fr_1.75fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-[var(--lx-primary)]">A CALMER WAY TO PROGRESS</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--lx-ink)] sm:text-4xl">
                A learning ecosystem built around how you actually speak.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--lx-muted)]">
                Forget static flashcards and robotic drills. Lurexa integrates listening, grammar, pronunciation, and AI conversation into one continuous, remembered journey.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {proof.map((item, index) => (
                <article
                  key={item.title}
                  className="animate-fade-slide-up rounded-[24px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-[var(--lx-card-shadow)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--lx-card-hover-shadow)]"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <span aria-hidden="true" className="text-3xl">{item.icon}</span>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-[var(--lx-primary)]">
                    {item.tag}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[var(--lx-ink)]">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--lx-muted)]">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--lx-border)] bg-[var(--lx-surface)] py-12 text-[var(--lx-muted)]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row sm:px-8">
            <div className="flex items-center gap-3">
              <LurexaLearnLogo />
              <span className="text-xs font-bold text-[var(--lx-muted)]">
                © {new Date().getFullYear()} Lurexa Learning Technologies. All rights reserved.
              </span>
            </div>
            <nav aria-label="Footer" className="flex flex-wrap items-center gap-5 text-xs font-bold text-[var(--lx-muted)]">
              <Link href="/onboarding" className="transition hover:text-[var(--lx-primary)]">Placement</Link>
              <Link href="/login" className="transition hover:text-[var(--lx-primary)]">Student Sign In</Link>
              <Link href="/signup?role=educator" className="transition hover:text-[var(--lx-primary)]">Educator Portal</Link>
            </nav>
          </div>
        </footer>
      </main>
  );
}
