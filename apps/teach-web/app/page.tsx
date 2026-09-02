import { ProductMark } from "@lurexa/ui/ProductMark";
import { TeachShell } from "./components/TeachShell";

const pillars = [
  ["Language growth", "Strengthen your English from your current CEFR level with a path built for educators.", "A2 → C2"],
  ["Teaching practice", "Develop classroom skills through evidence-informed courses, demonstrations, and practical challenges.", "Practice"],
  ["Professional evidence", "Build a verified record of completed learning, projects, badges, and credentials.", "Credentials"],
  ["Teacher community", "Exchange ideas, resources, feedback, and support with educators who are growing too.", "Community"],
];

export default function TeachHome() {
  return (
    <TeachShell active="Home">
      <main className="space-y-12 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1931] via-[#15284f] to-[var(--lx-primary)] text-white">
          <div className="absolute -right-28 -top-28 h-[420px] w-[420px] rounded-full bg-[var(--lx-accent)]/15 blur-3xl" />
          <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-28">
            <div className="relative">
              <p className="text-[11px] font-black tracking-[.2em] text-[#50e3c2]">
                PROFESSIONAL LEARNING FOR EDUCATORS
              </p>
              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[.94] tracking-[-.065em] text-white sm:text-7xl">
                Become the teacher your learners need next.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-indigo-100">
                Lurexa Teach connects English growth, teaching knowledge, real classroom practice, professional credentials, and a community of educators in one evolving professional profile.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="/dashboard"
                  className="inline-flex min-h-12 items-center rounded-xl bg-white px-6 text-sm font-black text-black shadow-xl transition hover:bg-slate-100"
                >
                  Start your growth path →
                </a>
                <a
                  href="/courses"
                  className="inline-flex min-h-12 items-center rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-extrabold text-white transition hover:bg-white/20"
                >
                  Explore learning
                </a>
              </div>
              <p className="mt-5 text-xs font-bold text-indigo-200">
                One educator profile. Language + pedagogy + evidence + community.
              </p>
            </div>
            <div className="relative grid place-items-center">
              <div className="w-full max-w-[520px] rounded-[34px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
                <div className="rounded-[26px] bg-white p-6 text-slate-900">
                  <ProductMark product="teach" />
                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                      <p className="text-[10px] font-black tracking-[.15em] text-[var(--lx-primary)]">ENGLISH</p>
                      <b className="mt-2 block text-3xl font-black text-slate-900">B2</b>
                      <p className="mt-1 text-xs text-slate-500">Working toward C1</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                      <p className="text-[10px] font-black tracking-[.15em] text-[var(--lx-secondary)]">PRACTICE</p>
                      <b className="mt-2 block text-3xl font-black text-slate-900">74%</b>
                      <p className="mt-1 text-xs text-slate-500">Evidence portfolio</p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl border border-slate-200 p-5 bg-white">
                    <p className="text-xs font-extrabold text-[var(--lx-primary)]">NEXT BEST STEP</p>
                    <b className="mt-2 block text-lg font-bold text-slate-900">Giving feedback that improves speaking</b>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[var(--lx-primary)] to-[var(--lx-secondary)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Banner */}
        <section className="mx-auto max-w-[1380px] px-5 sm:px-8">
          <div className="rounded-[36px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-8 shadow-[var(--lx-card-shadow)] sm:p-12 lg:p-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-[11px] font-black tracking-[.18em] text-[var(--lx-secondary)]">
                  COMMUNITY IS PART OF THE LEARNING
                </p>
                <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.055em] text-[var(--lx-ink)] sm:text-5xl">
                  Teachers improve faster when professional growth stops being solitary.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--lx-muted)]">
                  Join topic circles, ask for feedback, share classroom resources, find study partners, and participate in educator challenges.
                </p>
              </div>
              <a
                href="/community"
                className="inline-flex min-h-12 items-center rounded-xl bg-[var(--lx-primary)] px-7 text-sm font-extrabold text-white shadow-lg transition hover:opacity-90"
              >
                Enter the community →
              </a>
            </div>
          </div>
        </section>

        {/* 4 Pillars Section - Moved to bottom before Final CTA */}
        <section className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mb-8">
            <p className="text-[11px] font-black tracking-[.18em] text-[var(--lx-primary)]">
              ONE PROFESSIONAL JOURNEY
            </p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
              <h2 className="text-4xl font-black tracking-[-.055em] text-[var(--lx-ink)] sm:text-5xl">
                Grow what you know, what you can do, and who you can learn with.
              </h2>
              <p className="max-w-xl text-base leading-7 text-[var(--lx-muted)]">
                Teach is designed around durable professional capability—not content consumption. Every course connects to practice, evidence, reflection, and the educator profile.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map(([title, copy, tag], i) => (
              <article
                key={title}
                className="rounded-[26px] border border-[var(--lx-border)] bg-[var(--lx-surface)] p-6 shadow-[var(--lx-card-shadow)] transition hover:translate-y-[-2px]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--lx-canvas)] text-sm font-black text-[var(--lx-primary)] shadow-xs">
                  0{i + 1}
                </span>
                <p className="mt-6 text-[10px] font-extrabold tracking-[.15em] text-[var(--lx-muted)]">
                  {tag}
                </p>
                <h3 className="mt-2 text-xl font-black tracking-[-.035em] text-[var(--lx-ink)]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--lx-muted)]">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Final Chapter CTA */}
        <section className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="rounded-[34px] border border-indigo-400/40 dark:border-white/20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white shadow-2xl sm:p-12">
            <p className="text-xs font-black tracking-[.22em] text-teal-300 drop-shadow-xs">
              YOUR NEXT PROFESSIONAL CHAPTER
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.055em] text-white sm:text-5xl drop-shadow-sm">
              Build a professional record that grows with you.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/95 dark:text-white/90 font-medium">
              Your Lurexa Teach profile becomes the evidence layer for learning, credentials, strengths, goals, and contributions across your teaching career.
            </p>
            <a
              href="/growth"
              className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-white px-6 text-sm font-black text-black shadow-xl transition hover:bg-slate-100"
            >
              View the growth model →
            </a>
          </div>
        </section>
      </main>
    </TeachShell>
  );
}
