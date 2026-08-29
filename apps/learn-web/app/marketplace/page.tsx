import Link from "next/link";

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-[var(--learn-canvas)] px-4 py-10 sm:px-8">
      <section className="mx-auto max-w-4xl rounded-[32px] border border-[#dfe7fb] bg-white p-8 shadow-[0_18px_50px_rgba(32,52,128,.08)] sm:p-12">
        <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-[.14em] text-amber-800">
          Product concept · transactions disabled
        </span>
        <h1 className="mt-5 text-4xl font-black tracking-[-.055em] text-[var(--color-brand-navy)] sm:text-5xl">
          Lurexa Marketplace is not yet a production commerce surface.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#536792]">
          The marketplace concept is retained for product design and future institutional licensing work, but Lurexa does not currently process course purchases, create licenses, issue receipts, report author earnings, or expose a production catalog from this surface.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-[#e3e9f8] bg-[#f8faff] p-5">
            <h2 className="font-black text-[var(--color-brand-navy)]">Required before activation</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--lx-muted)]">
              <li>• Server-owned payment intent and verified settlement.</li>
              <li>• Core-owned license and entitlement records.</li>
              <li>• Publisher identity, provenance, tax and payout governance.</li>
              <li>• Refund, dispute, audit and institutional purchasing policy.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-[#e3e9f8] bg-[#f8faff] p-5">
            <h2 className="font-black text-[var(--color-brand-navy)]">Current status</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--lx-muted)]">
              Prototype/reference only. No button on this page can charge money, publish a listing, create a purchase record, or grant access.
            </p>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-xl bg-[var(--color-brand-navy)] px-5 py-3 text-sm font-black text-white">
            Return to Learn
          </Link>
          <Link href="/teacher/dashboard" className="rounded-xl border border-[#cfd9f0] px-5 py-3 text-sm font-black text-[var(--color-brand-navy)]">
            Teacher Workspace
          </Link>
        </div>
      </section>
    </main>
  );
}
