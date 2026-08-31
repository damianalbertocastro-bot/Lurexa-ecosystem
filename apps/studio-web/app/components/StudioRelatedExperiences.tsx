"use client";

import { usePathname } from "next/navigation";
import { RelatedExperiences, type RelatedExperience } from "@lurexa/ui/RelatedExperiences";
import { getEcosystemUrl } from "@lurexa/config/domains";

const learnUrl = getEcosystemUrl("learn");
const coachUrl = getEcosystemUrl("coach");
const teachUrl = getEcosystemUrl("teach");
const insightUrl = getEcosystemUrl("root", "/insight");
const docsUrl = getEcosystemUrl("docs");

export function StudioRelatedExperiences() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  const items: RelatedExperience[] = [
    {
      kind: "learn",
      title: "Lurexa Learn",
      description: "Deliver published Knowledge Objects inside interactive 7-skill lessons.",
      href: learnUrl,
      cta: "Open Learn",
    },
    {
      kind: "coach",
      title: "Lurexa Coach",
      description: "Deploy articulatory remediation rules into real-time pronunciation practice.",
      href: coachUrl,
      cta: "Open Coach",
    },
    {
      kind: "teach",
      title: "Lurexa Teach",
      description: "Connect authored learning assets to educator training and credentials.",
      href: teachUrl,
      cta: "Open Teach",
    },
    {
      kind: "insight",
      title: "Lurexa Insight",
      description: "Analyze learning asset efficacy and cohort phonemic error heatmaps.",
      href: insightUrl,
      cta: "Open Insight",
    },
    {
      kind: "docs",
      title: "Lurexa Docs",
      description: "Explore canonical CEFR competency schemas and authoring standards.",
      href: docsUrl,
      cta: "Explore Docs",
    },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8">
      <RelatedExperiences
        items={items}
        title="Deploy authored Knowledge Objects across the Lurexa ecosystem."
      />
    </div>
  );
}
