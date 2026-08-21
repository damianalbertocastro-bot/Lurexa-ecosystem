"use client";

import { usePathname } from "next/navigation";
import { RelatedExperiences, type RelatedExperience } from "@lurexa/ui/RelatedExperiences";

const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";
const teachUrl = process.env.NEXT_PUBLIC_LUREXA_TEACH_URL ?? ecosystemUrl;
const communityUrl = process.env.NEXT_PUBLIC_LUREXA_TEACH_COMMUNITY_URL ?? teachUrl;
const docsUrl = process.env.NEXT_PUBLIC_LUREXA_DOCS_URL ?? ecosystemUrl;
const coachUrl = process.env.NEXT_PUBLIC_LUREXA_COACH_URL ?? ecosystemUrl;

export function TeacherRelatedExperiences() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  const items: RelatedExperience[] = [
    { kind: "teach", title: "Lurexa Teach", description: "Develop your English, pedagogy, evidence portfolio, credentials, and long-term professional profile outside the operational classroom dashboard.", href: teachUrl, badge: "Recommended for educators", cta: "Continue professional growth" },
    { kind: "community", title: "Teach Community", description: "Exchange classroom ideas, evidence, feedback, and resources with other educators in professional circles.", href: communityUrl, cta: "Open community" },
    { kind: "coach", title: "Lurexa Coach", description: "Practice your own speaking and pronunciation with guided support that can build on your existing Lurexa context.", href: coachUrl, cta: "Practice with Coach" },
    { kind: "docs", title: "Lurexa Docs", description: "Use the canonical methodology, curriculum, architecture, and product guidance behind the learning experiences you deliver.", href: docsUrl, cta: "Open Docs" },
  ];

  return <div className="bg-[#f6f8ff] px-5 pb-14 sm:px-8 md:pl-[304px] md:pr-8"><div className="mx-auto max-w-[1180px]"><RelatedExperiences items={items} eyebrow="FOR YOUR NEXT TEACHING MOVE" title="Your classroom work connects to a wider professional ecosystem." description="Lurexa Learn is where you operate student learning. These adjacent experiences help you develop yourself, collaborate, practice, and understand the system behind the classroom." /></div></div>;
}
