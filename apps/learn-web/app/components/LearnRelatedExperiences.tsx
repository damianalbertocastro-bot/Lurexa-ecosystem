"use client";

import { usePathname } from "next/navigation";
import { RelatedExperiences, type RelatedExperience } from "@lurexa/ui/RelatedExperiences";

const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";
const teachUrl = process.env.NEXT_PUBLIC_LUREXA_TEACH_URL ?? ecosystemUrl;
const docsUrl = process.env.NEXT_PUBLIC_LUREXA_DOCS_URL ?? ecosystemUrl;

export function LearnRelatedExperiences() {
  const pathname = usePathname();
  if (pathname !== "/" && pathname !== "/dashboard") return null;

  const items: RelatedExperience[] = pathname === "/dashboard"
    ? [
        { kind: "coach", title: "Practice with Lurexa Coach", description: "Turn what you are learning into guided speaking and pronunciation practice that can use your existing learner context.", href: "/coach", badge: "Best next step", cta: "Start practicing" },
        { kind: "teach", title: "Lurexa Teach", description: "Professional learning, English growth, credentials, and community for educators.", href: teachUrl, cta: "Explore Teach" },
        { kind: "docs", title: "Lurexa Docs", description: "Explore the methodology, learning architecture, and ecosystem documentation behind Lurexa.", href: docsUrl, cta: "Open Docs" },
      ]
    : [
        { kind: "coach", title: "Lurexa Coach", description: "Build speaking confidence with guided conversation and pronunciation practice connected to the wider Lurexa learner model.", href: "/coach", badge: "For learners", cta: "Meet Coach" },
        { kind: "teach", title: "Lurexa Teach", description: "A separate professional-growth space for teachers who want to strengthen English, pedagogy, and credentials.", href: teachUrl, cta: "For educators" },
        { kind: "ecosystem", title: "Explore the full ecosystem", description: "See how Learn, Coach, Teach, Admin, Insight, Studio, Core, and Mind fit together.", href: ecosystemUrl, cta: "View ecosystem" },
      ];

  return <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8"><RelatedExperiences items={items} title={pathname === "/dashboard" ? "Your learning can continue beyond this dashboard." : "One Lurexa identity. More ways to grow."} /></div>;
}
