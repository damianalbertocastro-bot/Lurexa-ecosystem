import Link from "next/link";
import { TeacherWorkspaceBanner } from "../components/TeacherWorkspaceBanner";

export default function TeacherBillingPage() {
  return (
    <>
      <TeacherWorkspaceBanner
        title="Billing & Subscription"
        subtitle="Commercial planning surface — checkout is not active"
        breadcrumbs={[{ label: "Dashboard", href: "/teacher/dashboard" }, { label: "Billing" }]}
      />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[30px] border border-[#dfe7fb] bg-white p-8 shadow-sm">
          <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-[.14em] text-amber-800">
            Billing preview · no payment processing
          </span>
          <h1 className="mt-5 text-3xl font-black tracking-[-.045em] text-[var(--color-brand-navy)]">Plans can be designed here, but they cannot be purchased yet.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--lx-muted)]">
            This surface intentionally does not display a fake active organization plan, fabricated usage counts, or redirect to a demo Stripe URL. Production billing must be tied to the authenticated organization and verified through a trusted server-owned payment lifecycle.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Free", "Entry access and bounded usage"],
              ["Institution", "Managed seats, courses and governance"],
              ["Enterprise", "Contracted scale and advanced controls"],
            ].map(([name, description]) => (
              <article key={name} className="rounded-2xl border border-[#e3e9f8] bg-[#f8faff] p-5">
                <h2 className="font-black text-[var(--color-brand-navy)]">{name}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--lx-muted)]">{description}</p>
                <p className="mt-4 text-xs font-black uppercase tracking-[.12em] text-[#7b88a9]">Pricing not finalized</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#dfe7fb] p-5">
            <h2 className="font-black text-[var(--color-brand-navy)]">Activation requirements</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--lx-muted)]">
              <li>• Authenticated organization and authorized billing administrator.</li>
              <li>• Server-created checkout/session with verified provider response.</li>
              <li>• Signed webhook reconciliation before subscription state changes.</li>
              <li>• Core-owned entitlement, invoice and audit records.</li>
            </ul>
          </div>

          <Link href="/teacher/dashboard" className="mt-8 inline-flex rounded-xl bg-[var(--color-brand-navy)] px-5 py-3 text-sm font-black text-white">
            Return to Teacher Workspace
          </Link>
        </section>
      </main>
    </>
  );
}
