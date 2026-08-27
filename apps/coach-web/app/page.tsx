import Link from "next/link";
import { CoachShell } from "./components/CoachShell";

const capabilities = [
  ["Speaking that adapts", "Practice from your current CEFR level, recent learning context, goals, and recurring patterns—not from a blank slate."],
  ["Pronunciation with context", "Build intelligibility, rhythm, stress, and sound control with Dominican-Spanish transfer awareness and no accent-erasure goal."],
  ["A memory across practice", "Authorized Coach evidence contributes to the same evolving Lurexa Learner Model used across your learning journey."],
];

export default function CoachHome() {
  return <CoachShell active="Home"><main>
    <section className="relative overflow-hidden bg-gradient-to-br from-[#071d67] via-[#34208a] to-[#6b2bd9] text-white">
      <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#12cdd4]/15 blur-3xl" />
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#58e4b8]/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-28">
        <div>
          <p className="text-[11px] font-black tracking-[.2em] text-[#91f5eb]">LUREXA COACH · AI SPEAKING & PRONUNCIATION</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[.93] tracking-[-.065em] sm:text-7xl">Your English should sound more like <span className="text-[#8df4ef]">you—only clearer.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-indigo-100">Coach is Lurexa&apos;s dedicated speaking product: an adaptive space for conversation, pronunciation, fluency, intelligibility, and professional English practice.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/practice" className="inline-flex min-h-13 items-center rounded-2xl bg-white px-6 text-sm font-black text-[#4224a2] shadow-xl">Start speaking →</Link><Link href="/pronunciation" className="inline-flex min-h-13 items-center rounded-2xl border border-white/20 bg-white/10 px-6 text-sm font-black text-white">Explore pronunciation</Link></div>
          <p className="mt-5 text-xs font-bold text-indigo-200">One Lurexa identity. One evolving model. Coach remembers what matters.</p>
        </div>
        <div className="rounded-[36px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
          <div className="rounded-[28px] bg-white p-7 text-[#071d67]">
            <p className="text-[10px] font-black tracking-[.17em] text-[#6b2bd9]">COACHING PRINCIPLE</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.05em]">Intelligibility before imitation.</h2>
            <p className="mt-4 text-sm leading-7 text-[#6074a5]">Coach helps learners communicate naturally and confidently. It can target transfer patterns from Dominican Spanish without asking learners to erase identity or copy a single prestige accent.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">{["Conversation", "Pronunciation", "Fluency", "Professional English"].map((item) => <div key={item} className="rounded-2xl bg-gradient-to-br from-[#f2edff] to-[#e8fbfb] p-4 text-sm font-black">{item}</div>)}</div>
          </div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8"><p className="text-[11px] font-black tracking-[.18em] text-[#6b2bd9]">A PRODUCT OF ITS OWN · CONNECTED BY DESIGN</p><h2 className="mt-4 max-w-4xl text-4xl font-black tracking-[-.055em] sm:text-5xl">Coach can stand alone without making learners start over.</h2><div className="mt-10 grid gap-4 lg:grid-cols-3">{capabilities.map(([title, copy], index) => <article key={title} className="rounded-[28px] border border-[#dce8f5] bg-white p-7 shadow-[0_14px_40px_rgba(39,61,132,.06)]"><span className="text-xs font-black text-[#6b2bd9]">0{index + 1}</span><h3 className="mt-5 text-2xl font-black tracking-[-.04em]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#6074a5]">{copy}</p></article>)}</div></section>
    <section className="mx-auto mb-20 max-w-[1380px] rounded-[38px] bg-[#071d67] px-6 py-14 text-white sm:px-10 lg:px-14"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-[11px] font-black tracking-[.18em] text-[#8df4ef]">CONNECTED EXPERIENCES</p><h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.055em]">Practice from Learn. Grow through Teach. Return with better evidence.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-indigo-200">Learn and Teach can open Coach through purpose-scoped Product Bridges, while Coach independently re-authorizes the context it needs. Coach does not own Learn curriculum or Teach qualification.</p></div><Link href="/login" className="inline-flex min-h-12 items-center rounded-xl bg-[#8df4ef] px-6 text-sm font-black text-[#071d67]">Use your Lurexa account →</Link></div></section>
  </main></CoachShell>;
}
