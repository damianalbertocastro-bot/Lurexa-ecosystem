"use client";

import { usePathname } from "next/navigation";
import { RelatedExperiences, type RelatedExperience } from "@lurexa/ui/RelatedExperiences";
import { getEcosystemUrl } from "@lurexa/config/domains";

const ecosystemUrl = getEcosystemUrl("root");
const teachUrl = getEcosystemUrl("teach");
const docsUrl = getEcosystemUrl("docs");
const campusUrl = process.env.NEXT_PUBLIC_LUREXA_CAMPUS_URL ?? ecosystemUrl;

export function LearnRelatedExperiences() {
  const pathname = usePathname();
  if (pathname !== "/" && pathname !== "/dashboard") return null;

  const items: RelatedExperience[] = pathname === "/dashboard"
    ? [
        { kind: "teach", title: "Lurexa Teach", description: "Professional learning, English growth, credentials, and community for educators.", href: teachUrl, cta: "Explore Teach" },
        { kind: "campus", title: "Lurexa Campus", description: "Institutional cohorts, academic programs, and connected campus learning experiences.", href: campusUrl, badge: "Campus", cta: "Explore Campus" },
        { kind: "docs", title: "Lurexa Docs", description: "Explore the methodology, learning architecture, and ecosystem documentation behind Lurexa.", href: docsUrl, cta: "Open Docs" },
        { kind: "ecosystem", title: "Explore the full ecosystem", description: "See how Learn, Coach, Teach, Admin, Insight, Studio, Campus, Core, and Mind fit together.", href: ecosystemUrl, cta: "View ecosystem" },
      ]
    : [
        { kind: "coach", title: "Lurexa Coach", description: "Build speaking confidence with guided conversation and pronunciation practice connected to the wider Lurexa learner model.", href: "/coach", badge: "For learners", cta: "Meet Coach" },
        { kind: "teach", title: "Lurexa Teach", description: "A separate professional-growth space for teachers who want to strengthen English, pedagogy, and credentials.", href: teachUrl, cta: "For educators" },
        { kind: "campus", title: "Lurexa Campus", description: "Connect with institutional learning programs and campus community cohorts.", href: campusUrl, cta: "For campuses" },
        { kind: "ecosystem", title: "Explore the full ecosystem", description: "See how Learn, Coach, Teach, Admin, Insight, Studio, Campus, Core, and Mind fit together.", href: ecosystemUrl, cta: "View ecosystem" },
      ];

  return <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8"><RelatedExperiences items={items} title={pathname === "/dashboard" ? "Your learning can continue beyond this dashboard." : "One Lurexa identity. More ways to grow."} /></div>;
}
