"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RelatedExperiences, type RelatedExperience } from "@lurexa/ui/RelatedExperiences";
import { getEcosystemUrl } from "@lurexa/config/domains";

const ecosystemUrl = getEcosystemUrl("root");
const docsUrl = getEcosystemUrl("docs");
const learnUrl = getEcosystemUrl("learn");
const teachUrl = getEcosystemUrl("teach");
const insightUrl = process.env.NEXT_PUBLIC_LUREXA_INSIGHT_URL ?? ecosystemUrl;
const campusUrl = process.env.NEXT_PUBLIC_LUREXA_CAMPUS_URL ?? ecosystemUrl;

export function AdminRelatedExperiences() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  const items: RelatedExperience[] = [
    { kind: "campus", title: "Lurexa Campus", description: "Configure and govern institutional learning, academic cohorts, faculty, and campus-wide deployments.", href: campusUrl, badge: "Institutional", cta: "Manage Campus" },
    { kind: "insight", title: "Lurexa Insight", description: "Move from platform operations into learning intelligence, adoption patterns, outcomes, and decision-ready analysis.", href: insightUrl, badge: "Decision support", cta: "Explore Insight" },
    { kind: "docs", title: "Lurexa Docs", description: "Review the canonical architecture, governance, product boundaries, and operational standards behind the ecosystem.", href: docsUrl, cta: "Open Docs" },
    { kind: "learn", title: "Lurexa Learn", description: "Inspect the learner and teacher-facing operational experience that Admin helps govern and support.", href: learnUrl, cta: "View Learn" },
    { kind: "teach", title: "Lurexa Teach", description: "Understand the professional-growth, credential, and teacher-community experience connected to institutional adoption.", href: teachUrl, cta: "View Teach" },
  ];

  return <div className="bg-[#f6f8ff] px-5 pb-14 sm:px-8"><div className="mx-auto max-w-7xl">
    <section className="mb-8 grid gap-4 sm:grid-cols-2" aria-label="Admin governance tools">
      <Link href="/educators" className="rounded-3xl border border-[#cbd8f8] bg-white p-6 text-[#071d67] shadow-[0_12px_30px_rgba(32,52,128,.06)] transition hover:-translate-y-0.5 hover:border-[#315fd7] motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]"><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#315fd7]">EDUCATOR GOVERNANCE</p><h2 className="mt-2 text-xl font-black">Qualifications and teaching authorization</h2><p className="mt-2 text-sm leading-6 text-[#6677a5]">Inspect trusted educator scope and assign institution courses without treating membership roles as teaching qualification.</p><span className="mt-4 inline-flex text-sm font-extrabold text-[#315fd7]">Manage educators →</span></Link>
      <Link href="/signature-operations" className="rounded-3xl border border-[#cbd8f8] bg-white p-6 text-[#071d67] shadow-[0_12px_30px_rgba(32,52,128,.06)] transition hover:-translate-y-0.5 hover:border-[#315fd7] motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315fd7]"><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#315fd7]">SIGNATURE OPERATIONS</p><h2 className="mt-2 text-xl font-black">Experience health and continuity</h2><p className="mt-2 text-sm leading-6 text-[#6677a5]">Review identity-free Signature projection health, Product Bridge continuity, and latency budgets.</p><span className="mt-4 inline-flex text-sm font-extrabold text-[#315fd7]">Open operations →</span></Link>
    </section>
    <RelatedExperiences items={items} eyebrow="CONNECTED OPERATIONS" title="Administration works best with context from the products it supports." description="Move from system health into intelligence, documentation, and the experiences used by learners and educators—without losing the ecosystem view." />
  </div></div>;
}
