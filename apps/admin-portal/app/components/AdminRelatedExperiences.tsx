"use client";

import { usePathname } from "next/navigation";
import { RelatedExperiences, type RelatedExperience } from "@lurexa/ui/RelatedExperiences";

const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";
const insightUrl = process.env.NEXT_PUBLIC_LUREXA_INSIGHT_URL ?? ecosystemUrl;
const docsUrl = process.env.NEXT_PUBLIC_LUREXA_DOCS_URL ?? ecosystemUrl;
const learnUrl = process.env.NEXT_PUBLIC_LUREXA_LEARN_URL ?? ecosystemUrl;
const teachUrl = process.env.NEXT_PUBLIC_LUREXA_TEACH_URL ?? ecosystemUrl;

export function AdminRelatedExperiences() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  const items: RelatedExperience[] = [
    { kind: "insight", title: "Lurexa Insight", description: "Move from platform operations into learning intelligence, adoption patterns, outcomes, and decision-ready analysis.", href: insightUrl, badge: "Decision support", cta: "Explore Insight" },
    { kind: "docs", title: "Lurexa Docs", description: "Review the canonical architecture, governance, product boundaries, and operational standards behind the ecosystem.", href: docsUrl, cta: "Open Docs" },
    { kind: "learn", title: "Lurexa Learn", description: "Inspect the learner and teacher-facing operational experience that Admin helps govern and support.", href: learnUrl, cta: "View Learn" },
    { kind: "teach", title: "Lurexa Teach", description: "Understand the professional-growth, credential, and teacher-community experience connected to institutional adoption.", href: teachUrl, cta: "View Teach" },
  ];

  return <div className="bg-[#f6f8ff] px-5 pb-14 sm:px-8"><div className="mx-auto max-w-7xl"><RelatedExperiences items={items} eyebrow="CONNECTED OPERATIONS" title="Administration works best with context from the products it supports." description="Move from system health into intelligence, documentation, and the experiences used by learners and educators—without losing the ecosystem view." /></div></div>;
}
