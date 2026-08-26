import Link from "next/link";
import type { ReactNode } from "react";

export default function EducatorsLayout({ children }: { children: ReactNode }) {
  return <>
    <nav aria-label="Educator governance" className="border-b border-[#dfe6f8] bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 py-3 sm:px-8 lg:px-10">
        <Link href="/educators" className="rounded-xl px-4 py-2 text-sm font-extrabold text-[#17398f] hover:bg-[#edf2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]">Teaching authorization</Link>
        <Link href="/educators/review" className="rounded-xl px-4 py-2 text-sm font-extrabold text-[#6b2bd9] hover:bg-[#f1edff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b2bd9]">Qualification review</Link>
      </div>
    </nav>
    {children}
  </>;
}
