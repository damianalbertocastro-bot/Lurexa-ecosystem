import Link from "next/link";
import { CoachShell } from "../components/CoachShell";

export default function CoachDashboard() {
  return <CoachShell active="Dashboard"><main className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8">
    <p className="text-[11px] font-black tracking-[.18em] text-[#6b2bd9]">YOUR COACH SPACE</p>
    <div className="mt-3 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><h1 className="text-4xl font-black tracking-[-.055em] sm:text-5xl">Choose the kind of speaking work you need now.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[#6074a5]">Coach reads authorized context when a session starts. This dashboard intentionally does not invent progress metrics before trusted learner evidence is available.</p></div><Link href="/practice" className="inline-flex min-h-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6b2bd9] to-[#315fd7] px-6 text-sm font-black text-white shadow-lg">Start adaptive practice →</Link></div>
    <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[
      ["Conversation", "Open adaptive speaking practice from your current learner context.", "/practice"],
      ["Pronunciation", "Work on intelligibility, sound contrasts, rhythm, and transfer patterns.", "/pronunciation"],
      ["History", "Review the role of completed Coach sessions and evidence without exposing raw transcripts.", "/history"],
      ["Educator practice", "Use professional English Coach mode when your educator benefit allows it.", "/educator"],
    ].map(([title, copy, href]) => <Link key={title} href={href} className="rounded-[26px] border border-[#dce8f5] bg-white p-6 shadow-[0_12px_35px_rgba(39,61,132,.06)] transition hover:-translate-y-0.5"><p className="text-[10px] font-black tracking-[.16em] text-[#6b2bd9]">COACH MODE</p><h2 className="mt-3 text-xl font-black">{title}</h2><p className="mt-3 text-sm leading-6 text-[#6074a5]">{copy}</p><span className="mt-5 inline-block text-sm font-black text-[#315fd7]">Open →</span></Link>)}</section>
  </main></CoachShell>;
}
