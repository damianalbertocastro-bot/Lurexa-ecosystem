import { MasterMark } from "@lurexa/ui/MasterMark";
import { ProductMark } from "@lurexa/ui/ProductMark";

const learners = [
  ["José Luis", "Pronunciation: /θ/", "Review"],
  ["Ana Rodríguez", "Low activity this week", "Review"],
  ["Michael Peña", "Ready for B1 challenge", "Ready"],
];

const navItems = ["Overview", "My classes", "Learner insights", "Assignments", "Resources"];
const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";

export default function TeacherPortalHome() {
  return <main className="min-h-screen bg-[#f5f7ff] text-[#0b1f5f]">
    <header className="sticky top-0 z-40 border-b border-[#dfe6f8]/90 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 py-3 sm:px-8">
        <a href="/" aria-label="Lurexa Learn teacher dashboard" className="shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]"><ProductMark product="learn" /></a>
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Lurexa Learn teacher navigation">{navItems.map((item,index)=><button key={item} type="button" aria-current={index===0?"page":undefined} className={`rounded-xl px-3.5 py-2.5 text-sm font-extrabold transition ${index===0?"bg-[#eee9ff] text-[#592bd6]":"text-[#596b9c] hover:bg-[#f3f6ff] hover:text-[#071d67]"}`}>{item}</button>)}</nav>
        <div className="ml-auto flex items-center gap-2"><a href={ecosystemUrl} aria-label="Go to the Lurexa ecosystem home" className="grid h-11 w-11 place-items-center rounded-xl border border-[#dfe6f8] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><MasterMark compact size="sm" /></a><button type="button" className="min-h-11 rounded-xl bg-gradient-to-br from-[#592bd6] to-[#315fd7] px-4 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(71,65,190,.22)]">Create activity →</button></div>
      </div>
      <nav className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-5 pb-3 lg:hidden" aria-label="Lurexa Learn teacher mobile navigation">{navItems.map((item,index)=><button key={item} type="button" aria-current={index===0?"page":undefined} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-extrabold ${index===0?"border-[#592bd6] bg-[#592bd6] text-white":"border-[#d7e0f6] bg-white text-[#3450a8]"}`}>{item}</button>)}</nav>
    </header>

    <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12">
      <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071d67] via-[#17368f] to-[#592bd6] px-6 py-10 text-white shadow-[0_22px_60px_rgba(35,48,133,.18)] sm:px-10 sm:py-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#12cdd4]/20 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-[11px] font-extrabold tracking-[.2em] text-[#8df4ef]">LUREXA LEARN · TEACHER WORKSPACE</p><h1 className="mt-4 text-4xl font-black tracking-[-.055em] sm:text-6xl">Good morning, Damian.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">Manage classes, assignments, and learner progress from one focused workspace. Professional growth stays in Lurexa Teach; classroom operations stay here in Learn.</p></div><div className="rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur"><p className="text-[10px] font-extrabold tracking-[.16em] text-[#9af4ef]">TODAY’S FOCUS</p><b className="mt-2 block text-xl">3 learners need review</b><p className="mt-2 max-w-[260px] text-sm leading-6 text-indigo-100">Prioritize pronunciation and participation before the next live challenge.</p></div></div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">{[["ACTIVE LEARNERS","126","+8 this week"],["CLASS MOMENTUM","82%","↑ 12% from last week"],["NEEDS REVIEW","9","3 priority learners"]].map(([label,value,detail],index)=><article key={label} className={`rounded-[26px] border p-6 shadow-[0_12px_30px_rgba(32,52,128,.06)] ${index===1?"border-[#cfeee9] bg-[#e9fbf9]":"border-[#dfe6f8] bg-white"}`}><p className={`text-[10px] font-extrabold tracking-[.15em] ${index===1?"text-[#137d7f]":"text-[#7280a6]"}`}>{label}</p><b className="mt-2 block text-4xl tracking-[-.055em]">{value}</b><p className={`mt-2 text-sm font-bold ${index===1?"text-[#137d7f]":"text-[#167c76]"}`}>{detail}</p></article>)}</section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <article className="rounded-[30px] border border-[#dfe6f8] bg-white p-7 shadow-[0_14px_36px_rgba(32,52,128,.07)] sm:p-8"><p className="text-[10px] font-extrabold tracking-[.18em] text-[#592bd6]">CLASS MOMENTUM</p><div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-3xl font-black tracking-[-.045em]">Speaking confidence</h2><p className="mt-2 text-sm text-[#6677a5]">A2 learners are trending upward across recent activities.</p></div><span className="rounded-full bg-[#eee9ff] px-3 py-1 text-xs font-extrabold text-[#592bd6]">Target 80%</span></div><div aria-label="Speaking confidence trend" className="my-10 overflow-hidden text-4xl tracking-[.18em] text-[#592bd6] sm:text-5xl">▁▂▃▄▅▅▆▇</div><div className="flex items-center justify-between text-sm font-semibold text-[#6677a5]"><span><span className="text-[#12aab0]" aria-hidden="true">●</span> Speaking confidence</span><b className="text-[#137d7f]">82%</b></div></article>
        <article className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#071d67] via-[#173a9d] to-[#315fd7] p-7 text-white shadow-[0_18px_38px_rgba(32,52,128,.2)] sm:p-8"><div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#12cdd4]/25 blur-2xl"/><p className="relative text-[10px] font-extrabold tracking-[.18em] text-[#9af4ef]">LUREXA MIND · AI INSIGHT</p><h2 className="relative mt-4 text-2xl font-black tracking-[-.04em]">Your class is ready for a live speaking challenge.</h2><p className="relative mt-4 text-sm leading-7 text-indigo-100">Confidence is rising across A2. Focus feedback this week on /θ/ and connected speech.</p><button type="button" className="relative mt-7 min-h-11 rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-extrabold text-white transition hover:bg-white hover:text-[#173a9d]">View recommendation →</button></article>
      </section>

      <section className="mt-6 rounded-[30px] border border-[#dfe6f8] bg-white p-7 shadow-[0_14px_36px_rgba(32,52,128,.07)] sm:p-8"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold tracking-[.18em] text-[#592bd6]">LEARNERS TO SUPPORT</p><h2 className="mt-2 text-3xl font-black tracking-[-.045em]">Timely intervention</h2><p className="mt-2 text-sm text-[#6677a5]">The clearest opportunities to help learners before the next activity.</p></div><button type="button" className="min-h-11 rounded-xl border border-[#dfe6f8] bg-white px-4 text-sm font-extrabold text-[#315fd7] hover:bg-[#f3f6ff]">View all learners →</button></div><div className="mt-5 divide-y divide-[#edf1fb]">{learners.map(([name,detail,status])=><div key={name} className="flex flex-col items-start justify-between gap-4 py-5 sm:flex-row sm:items-center"><div><b className="text-[#10245f]">{name}</b><p className="mt-1 text-sm text-[#6677a5]">{detail}</p></div><button type="button" className={`min-h-11 w-full rounded-xl px-4 py-2 text-sm font-extrabold sm:w-auto ${status==="Ready"?"bg-[#e4f8f2] text-[#137867]":"bg-[#fff3dc] text-[#a66013]"}`}>{status} →</button></div>)}</div></section>
    </div>
  </main>;
}
