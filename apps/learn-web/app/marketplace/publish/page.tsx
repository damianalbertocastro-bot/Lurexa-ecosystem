import Link from "next/link";

export default function CoursePublishPage() {
  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] px-4 py-10 sm:px-8">
      <section className="mx-auto max-w-3xl rounded-[30px] border border-[var(--lx-border)] bg-white p-8 shadow-[0_18px_50px_rgba(32,52,128,.08)] sm:p-10">
        <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-[.14em] text-amber-800">
          Publishing disabled · prototype retained
        </span>
        <h1 className="mt-5 text-4xl font-black tracking-[-.05em] text-[var(--color-brand-navy)]">Marketplace publishing is not active yet.</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--lx-muted)]">
          Lurexa will not claim that a course is listed for sale, Stripe-connected, licensed, or revenue-generating until the production commerce and entitlement pipeline exists server-side.
        </p>
        <div className="mt-7 rounded-2xl border border-[var(--lx-border)] bg-[var(--lx-canvas)] p-5 text-sm leading-7 text-[var(--lx-muted)]">
          Future publishing must validate educator/publisher identity, governed content provenance, institutional licensing terms, pricing policy, payment settlement, Core entitlements, payout state, refunds, and audit history before a listing can become active.
        </div>
        <div className="mt-8 flex gap-3">
          <Link href="/marketplace" className="rounded-xl bg-[var(--color-brand-navy)] px-5 py-3 text-sm font-black text-white">Marketplace status</Link>
          <Link href="/teacher/dashboard" className="rounded-xl border border-[var(--lx-border)] px-5 py-3 text-sm font-black text-[var(--color-brand-navy)]">Teacher Workspace</Link>
        </div>
      </section>
    </main>
  );
}
