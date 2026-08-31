"use client";

import { usePathname } from "next/navigation";
import { RelatedExperiences, type RelatedExperience } from "@lurexa/ui/RelatedExperiences";
import { getEcosystemUrl } from "@lurexa/config/domains";

const learnUrl = getEcosystemUrl("learn");
const coachUrl = getEcosystemUrl("coach");
const teachUrl = getEcosystemUrl("teach");
const studioUrl = getEcosystemUrl("root", "/studio");
const docsUrl = getEcosystemUrl("docs");

export function InsightRelatedExperiences() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  const items: RelatedExperience[] = [
    {
      kind: "learn",
      title: "Lurexa Learn",
      description: "Classroom delivery, instructional dashboards, assignments, and learner progress tracking.",
      href: learnUrl,
      cta: "Open Learn",
    },
    {
      kind: "coach",
      title: "Lurexa Coach",
      description: "AI-driven speaking studio and multi-L1 pronunciation practice sessions.",
      href: coachUrl,
      cta: "Open Coach",
    },
    {
      kind: "teach",
      title: "Lurexa Teach",
      description: "Teacher development, CEFR proficiency growth, and pedagogical credentials.",
      href: teachUrl,
      cta: "Open Teach",
    },
    {
      kind: "studio",
      title: "Lurexa Studio",
      description: "Authoring workbench for CEFR-aligned Knowledge Objects and linguistic linting.",
      href: studioUrl,
      cta: "Open Studio",
    },
    {
      kind: "docs",
      title: "Lurexa Docs",
      description: "Canonical architecture, evidence provenance contracts, and curriculum specifications.",
      href: docsUrl,
      cta: "Explore Docs",
    },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8">
      <RelatedExperiences
        items={items}
        title="Connect institutional analytics to the entire Lurexa ecosystem."
      />
    </div>
  );
}
