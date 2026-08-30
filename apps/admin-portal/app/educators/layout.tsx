import Link from "next/link";
import type { ReactNode } from "react";

export default function EducatorsLayout({ children }: { children: ReactNode }) {
  return <>
    <nav aria-label="Educator governance" className="border-b border-[var(--lx-surface)] bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 py-3 sm:px-8 lg:px-10">
        <Link href="/educators" className="rounded-xl px-4 py-2 text-sm font-extrabold text-[var(--color-brand-navy-light)] hover:bg-[var(--lx-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-secondary)]">Teaching authorization</Link>
        <Link href="/educators/review" className="rounded-xl px-4 py-2 text-sm font-extrabold text-[var(--lx-primary)] hover:bg-[var(--lx-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lx-primary)]">Qualification review</Link>
      </div>
    </nav>
    {children}
  </>;
}
